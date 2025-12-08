import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { validateBody, validateParams } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { requireStaff } from '../middleware/requireRole';
import { createReviewSchema, updateReviewSchema, idParamSchema } from '../validators/common.validator';

const router = Router();

// Create review (authenticated customers only)
router.post(
    '/',
    authenticate,
    validateBody(createReviewSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get customer ID
            const customer = await prisma.customer.findUnique({
                where: { userId: req.user!.userId },
            });

            if (!customer) {
                res.status(400).json({ error: 'Customer profile not found' });
                return;
            }

            // Check if already reviewed
            const existing = await prisma.review.findUnique({
                where: {
                    productId_customerId: {
                        productId: req.body.productId,
                        customerId: customer.id,
                    },
                },
            });

            if (existing) {
                res.status(400).json({ error: 'You have already reviewed this product' });
                return;
            }

            // Check if customer has purchased this product
            const hasPurchased = await prisma.orderItem.findFirst({
                where: {
                    order: { customerId: customer.id, status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
                    variant: { productId: req.body.productId },
                },
            });

            const review = await prisma.review.create({
                data: {
                    productId: req.body.productId,
                    customerId: customer.id,
                    rating: req.body.rating,
                    title: req.body.title,
                    content: req.body.content,
                    approved: !!hasPurchased, // Auto-approve if verified purchase
                },
            });

            res.status(201).json(review);
        } catch (error) {
            next(error);
        }
    }
);

// Get reviews for product (public)
router.get(
    '/product/:id',
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const [reviews, total, stats] = await Promise.all([
                prisma.review.findMany({
                    where: { productId: req.params.id, approved: true },
                    include: {
                        customer: {
                            include: { user: { select: { name: true } } },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                prisma.review.count({ where: { productId: req.params.id, approved: true } }),
                prisma.review.aggregate({
                    where: { productId: req.params.id, approved: true },
                    _avg: { rating: true },
                    _count: { rating: true },
                }),
            ]);

            // Get rating distribution
            const distribution = await prisma.review.groupBy({
                by: ['rating'],
                where: { productId: req.params.id, approved: true },
                _count: { rating: true },
            });

            const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
                rating,
                count: distribution.find((d) => d.rating === rating)?._count.rating || 0,
            }));

            res.json({
                reviews: reviews.map((r) => ({
                    ...r,
                    reviewer: r.customer.user.name,
                })),
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
                stats: {
                    averageRating: stats._avg.rating || 0,
                    totalReviews: stats._count.rating,
                    ratingDistribution,
                },
            });
        } catch (error) {
            next(error);
        }
    }
);

// ==================== ADMIN ROUTES ====================

// List all reviews (admin)
router.get(
    '/',
    authenticate,
    requireStaff,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const approved = req.query.approved === 'true' ? true : req.query.approved === 'false' ? false : undefined;

            const where = approved !== undefined ? { approved } : {};

            const [reviews, total] = await Promise.all([
                prisma.review.findMany({
                    where,
                    include: {
                        product: { select: { title: true, slug: true } },
                        customer: { include: { user: { select: { name: true, email: true } } } },
                    },
                    orderBy: { createdAt: 'desc' },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                prisma.review.count({ where }),
            ]);

            res.json({
                reviews,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            });
        } catch (error) {
            next(error);
        }
    }
);

// Approve/update review (admin)
router.patch(
    '/:id',
    authenticate,
    requireStaff,
    validateParams(idParamSchema),
    validateBody(updateReviewSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const review = await prisma.review.update({
                where: { id: req.params.id },
                data: req.body,
            });

            res.json(review);
        } catch (error) {
            next(error);
        }
    }
);

// Delete review (admin)
router.delete(
    '/:id',
    authenticate,
    requireStaff,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await prisma.review.delete({ where: { id: req.params.id } });
            res.json({ message: 'Review deleted' });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
