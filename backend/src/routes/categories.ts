import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { validateBody, validateParams } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { requireStaff } from '../middleware/requireRole';
import { createCategorySchema, updateCategorySchema, slugParamSchema, idParamSchema } from '../validators/common.validator';
import { generateSlug, generateUniqueSlug } from '../utils/helpers';

const router = Router();

// ==================== PUBLIC ROUTES ====================

// List categories (hierarchical)
router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categories = await prisma.category.findMany({
                where: { parentId: null },
                include: {
                    children: {
                        include: {
                            children: true,
                            _count: { select: { products: true } },
                        },
                    },
                    _count: { select: { products: true } },
                },
                orderBy: { position: 'asc' },
            });

            res.json(categories);
        } catch (error) {
            next(error);
        }
    }
);

// Get category by slug with products
router.get(
    '/slug/:slug',
    validateParams(slugParamSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const category = await prisma.category.findUnique({
                where: { slug: req.params.slug },
                include: {
                    children: true,
                    parent: true,
                    products: {
                        where: { product: { status: 'ACTIVE', deletedAt: null } },
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

            if (!category) {
                res.status(404).json({ error: 'Category not found' });
                return;
            }

            res.json({
                ...category,
                products: category.products.map((p) => p.product),
            });
        } catch (error) {
            next(error);
        }
    }
);

// ==================== ADMIN ROUTES ====================

// Create category
router.post(
    '/',
    authenticate,
    requireStaff,
    validateBody(createCategorySchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const slug = req.body.slug || generateSlug(req.body.name);
            const existing = await prisma.category.findUnique({ where: { slug } });
            const finalSlug = existing ? generateUniqueSlug(req.body.name) : slug;

            const category = await prisma.category.create({
                data: {
                    name: req.body.name,
                    slug: finalSlug,
                    description: req.body.description,
                    image: req.body.image,
                    parentId: req.body.parentId,
                },
            });

            res.status(201).json(category);
        } catch (error) {
            next(error);
        }
    }
);

// Update category
router.patch(
    '/:id',
    authenticate,
    requireStaff,
    validateParams(idParamSchema),
    validateBody(updateCategorySchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const category = await prisma.category.update({
                where: { id: req.params.id },
                data: req.body,
            });

            res.json(category);
        } catch (error) {
            next(error);
        }
    }
);

// Delete category
router.delete(
    '/:id',
    authenticate,
    requireStaff,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Check for children
            const hasChildren = await prisma.category.count({
                where: { parentId: req.params.id },
            });

            if (hasChildren > 0) {
                res.status(400).json({ error: 'Cannot delete category with subcategories' });
                return;
            }

            await prisma.category.delete({ where: { id: req.params.id } });
            res.json({ message: 'Category deleted' });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
