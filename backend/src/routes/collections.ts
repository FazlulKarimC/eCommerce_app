import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { requireStaff } from '../middleware/requireRole';
import {
    createCollectionSchema,
    updateCollectionSchema,
    slugParamSchema,
    idParamSchema,
    paginationSchema,
} from '../validators/common.validator';
import { generateSlug, generateUniqueSlug } from '../utils/helpers';

const router = Router();

// ==================== PUBLIC ROUTES ====================

// List collections
router.get(
    '/',
    validateQuery(paginationSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const [collections, total] = await Promise.all([
                prisma.collection.findMany({
                    where: { publishedAt: { not: null } },
                    include: {
                        _count: { select: { products: true } },
                    },
                    orderBy: { title: 'asc' },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                prisma.collection.count({ where: { publishedAt: { not: null } } }),
            ]);

            res.json({
                collections,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            });
        } catch (error) {
            next(error);
        }
    }
);

// Get collection by slug with products
router.get(
    '/slug/:slug',
    validateParams(slugParamSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const collection = await prisma.collection.findUnique({
                where: { slug: req.params.slug, publishedAt: { not: null } },
                include: {
                    products: {
                        where: { product: { status: 'ACTIVE', deletedAt: null } },
                        orderBy: { position: 'asc' },
                        include: {
                            product: {
                                include: {
                                    variants: { take: 1, orderBy: { position: 'asc' } },
                                    images: { take: 1, orderBy: { position: 'asc' } },
                                },
                            },
                        },
                    },
                },
            });

            if (!collection) {
                res.status(404).json({ error: 'Collection not found' });
                return;
            }

            res.json({
                ...collection,
                products: collection.products.map((p) => p.product),
            });
        } catch (error) {
            next(error);
        }
    }
);

// Featured collections
router.get(
    '/featured',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const collections = await prisma.collection.findMany({
                where: { featured: true, publishedAt: { not: null } },
                include: {
                    _count: { select: { products: true } },
                },
                take: 6,
            });

            res.json(collections);
        } catch (error) {
            next(error);
        }
    }
);

// ==================== ADMIN ROUTES ====================

// List all collections (admin)
router.get(
    '/admin/all',
    authenticate,
    requireStaff,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const collections = await prisma.collection.findMany({
                include: {
                    _count: { select: { products: true } },
                },
                orderBy: { createdAt: 'desc' },
            });

            res.json(collections);
        } catch (error) {
            next(error);
        }
    }
);

// Create collection
router.post(
    '/',
    authenticate,
    requireStaff,
    validateBody(createCollectionSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const slug = req.body.slug || generateSlug(req.body.title);
            const existing = await prisma.collection.findUnique({ where: { slug } });
            const finalSlug = existing ? generateUniqueSlug(req.body.title) : slug;

            const collection = await prisma.collection.create({
                data: {
                    title: req.body.title,
                    slug: finalSlug,
                    description: req.body.description,
                    image: req.body.image,
                    featured: req.body.featured,
                    sortOrder: req.body.sortOrder,
                    seoTitle: req.body.seoTitle,
                    seoDescription: req.body.seoDescription,
                    publishedAt: new Date(),
                },
            });

            // Add products if provided
            if (req.body.productIds && req.body.productIds.length > 0) {
                for (let i = 0; i < req.body.productIds.length; i++) {
                    await prisma.collectionProduct.create({
                        data: {
                            collectionId: collection.id,
                            productId: req.body.productIds[i],
                            position: i,
                        },
                    });
                }
            }

            res.status(201).json(collection);
        } catch (error) {
            next(error);
        }
    }
);

// Update collection
router.patch(
    '/:id',
    authenticate,
    requireStaff,
    validateParams(idParamSchema),
    validateBody(updateCollectionSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const collection = await prisma.collection.update({
                where: { id: req.params.id },
                data: {
                    title: req.body.title,
                    description: req.body.description,
                    image: req.body.image,
                    featured: req.body.featured,
                    sortOrder: req.body.sortOrder,
                    seoTitle: req.body.seoTitle,
                    seoDescription: req.body.seoDescription,
                },
            });

            res.json(collection);
        } catch (error) {
            next(error);
        }
    }
);

// Delete collection
router.delete(
    '/:id',
    authenticate,
    requireStaff,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await prisma.collection.delete({ where: { id: req.params.id } });
            res.json({ message: 'Collection deleted' });
        } catch (error) {
            next(error);
        }
    }
);

// Add product to collection
router.post(
    '/:id/products',
    authenticate,
    requireStaff,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { productId, position } = req.body;

            await prisma.collectionProduct.create({
                data: {
                    collectionId: req.params.id,
                    productId,
                    position: position || 0,
                },
            });

            res.json({ message: 'Product added to collection' });
        } catch (error) {
            next(error);
        }
    }
);

// Remove product from collection
router.delete(
    '/:id/products/:productId',
    authenticate,
    requireStaff,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await prisma.collectionProduct.delete({
                where: {
                    collectionId_productId: {
                        collectionId: req.params.id,
                        productId: req.params.productId,
                    },
                },
            });

            res.json({ message: 'Product removed from collection' });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
