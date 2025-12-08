import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { idParamSchema } from '../validators/common.validator';
import { validateParams } from '../middleware/validate';

const router = Router();

// All wishlist routes require authentication

// Get wishlist
router.get(
    '/',
    authenticate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customer = await prisma.customer.findUnique({
                where: { userId: req.user!.userId },
            });

            if (!customer) {
                res.json({ items: [] });
                return;
            }

            const items = await prisma.wishlistItem.findMany({
                where: { customerId: customer.id },
                include: {
                    customer: false,
                },
                orderBy: { createdAt: 'desc' },
            });

            // Get product details for wishlist items
            const productIds = items.map((item) => item.productId);
            const products = await prisma.product.findMany({
                where: { id: { in: productIds }, status: 'ACTIVE', deletedAt: null },
                include: {
                    variants: { take: 1, orderBy: { position: 'asc' } },
                    images: { take: 1, orderBy: { position: 'asc' } },
                },
            });

            const wishlistWithProducts = items
                .map((item) => {
                    const product = products.find((p) => p.id === item.productId);
                    if (!product) return null;
                    return {
                        id: item.id,
                        addedAt: item.createdAt,
                        product: {
                            id: product.id,
                            title: product.title,
                            slug: product.slug,
                            price: product.variants[0]?.price,
                            compareAtPrice: product.variants[0]?.compareAtPrice,
                            image: product.images[0]?.url,
                            inStock: (product.variants[0]?.inventoryQty || 0) > 0,
                        },
                    };
                })
                .filter(Boolean);

            res.json({ items: wishlistWithProducts });
        } catch (error) {
            next(error);
        }
    }
);

// Add to wishlist
router.post(
    '/:id',
    authenticate,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let customer = await prisma.customer.findUnique({
                where: { userId: req.user!.userId },
            });

            // Create customer profile if doesn't exist
            if (!customer) {
                customer = await prisma.customer.create({
                    data: { userId: req.user!.userId },
                });
            }

            // Check if product exists
            const product = await prisma.product.findUnique({
                where: { id: req.params.id, status: 'ACTIVE', deletedAt: null },
            });

            if (!product) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }

            // Check if already in wishlist
            const existing = await prisma.wishlistItem.findUnique({
                where: {
                    customerId_productId: {
                        customerId: customer.id,
                        productId: req.params.id,
                    },
                },
            });

            if (existing) {
                res.json({ message: 'Product already in wishlist' });
                return;
            }

            await prisma.wishlistItem.create({
                data: {
                    customerId: customer.id,
                    productId: req.params.id,
                },
            });

            res.status(201).json({ message: 'Added to wishlist' });
        } catch (error) {
            next(error);
        }
    }
);

// Remove from wishlist
router.delete(
    '/:id',
    authenticate,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customer = await prisma.customer.findUnique({
                where: { userId: req.user!.userId },
            });

            if (!customer) {
                res.status(404).json({ error: 'Item not found' });
                return;
            }

            await prisma.wishlistItem.deleteMany({
                where: {
                    customerId: customer.id,
                    productId: req.params.id,
                },
            });

            res.json({ message: 'Removed from wishlist' });
        } catch (error) {
            next(error);
        }
    }
);

// Check if product is in wishlist
router.get(
    '/check/:id',
    authenticate,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customer = await prisma.customer.findUnique({
                where: { userId: req.user!.userId },
            });

            if (!customer) {
                res.json({ inWishlist: false });
                return;
            }

            const item = await prisma.wishlistItem.findUnique({
                where: {
                    customerId_productId: {
                        customerId: customer.id,
                        productId: req.params.id,
                    },
                },
            });

            res.json({ inWishlist: !!item });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
