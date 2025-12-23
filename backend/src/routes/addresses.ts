import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

// Validation schemas
const addressSchema = z.object({
    label: z.string().optional(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    company: z.string().optional(),
    line1: z.string().min(1, 'Address line 1 is required'),
    line2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().default('US'),
    phone: z.string().optional(),
    isDefault: z.boolean().default(false),
});

// Helper to get customer ID from user
async function getCustomerId(userId: string): Promise<string | null> {
    const customer = await prisma.customer.findUnique({
        where: { userId },
        select: { id: true },
    });
    return customer?.id || null;
}

// List all addresses for the authenticated user
router.get(
    '/',
    authenticate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customerId = await getCustomerId(req.user!.userId);
            if (!customerId) {
                res.status(404).json({ error: 'Customer profile not found' });
                return;
            }

            const addresses = await prisma.address.findMany({
                where: { customerId },
                orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
            });

            res.json(addresses);
        } catch (error) {
            next(error);
        }
    }
);

// Get single address
router.get(
    '/:id',
    authenticate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customerId = await getCustomerId(req.user!.userId);
            if (!customerId) {
                res.status(404).json({ error: 'Customer profile not found' });
                return;
            }

            const address = await prisma.address.findFirst({
                where: { id: req.params.id, customerId },
            });

            if (!address) {
                res.status(404).json({ error: 'Address not found' });
                return;
            }

            res.json(address);
        } catch (error) {
            next(error);
        }
    }
);

// Create new address
router.post(
    '/',
    authenticate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customerId = await getCustomerId(req.user!.userId);
            if (!customerId) {
                res.status(404).json({ error: 'Customer profile not found' });
                return;
            }

            const data = addressSchema.parse(req.body);

            // If this is set as default, unset other defaults
            if (data.isDefault) {
                await prisma.address.updateMany({
                    where: { customerId, isDefault: true },
                    data: { isDefault: false },
                });
            }

            // If this is the first address, make it default
            const addressCount = await prisma.address.count({ where: { customerId } });
            if (addressCount === 0) {
                data.isDefault = true;
            }

            const address = await prisma.address.create({
                data: {
                    ...data,
                    customerId,
                },
            });

            res.status(201).json(address);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ error: error.errors[0].message });
                return;
            }
            next(error);
        }
    }
);

// Update address
router.put(
    '/:id',
    authenticate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customerId = await getCustomerId(req.user!.userId);
            if (!customerId) {
                res.status(404).json({ error: 'Customer profile not found' });
                return;
            }

            // Check ownership
            const existing = await prisma.address.findFirst({
                where: { id: req.params.id, customerId },
            });

            if (!existing) {
                res.status(404).json({ error: 'Address not found' });
                return;
            }

            const data = addressSchema.parse(req.body);

            // If this is set as default, unset other defaults
            if (data.isDefault && !existing.isDefault) {
                await prisma.address.updateMany({
                    where: { customerId, isDefault: true },
                    data: { isDefault: false },
                });
            }

            const address = await prisma.address.update({
                where: { id: req.params.id },
                data,
            });

            res.json(address);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ error: error.errors[0].message });
                return;
            }
            next(error);
        }
    }
);

// Delete address
router.delete(
    '/:id',
    authenticate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customerId = await getCustomerId(req.user!.userId);
            if (!customerId) {
                res.status(404).json({ error: 'Customer profile not found' });
                return;
            }

            // Check ownership
            const existing = await prisma.address.findFirst({
                where: { id: req.params.id, customerId },
            });

            if (!existing) {
                res.status(404).json({ error: 'Address not found' });
                return;
            }

            await prisma.address.delete({
                where: { id: req.params.id },
            });

            // If deleted address was default, make another one default
            if (existing.isDefault) {
                const firstAddress = await prisma.address.findFirst({
                    where: { customerId },
                    orderBy: { createdAt: 'asc' },
                });
                if (firstAddress) {
                    await prisma.address.update({
                        where: { id: firstAddress.id },
                        data: { isDefault: true },
                    });
                }
            }

            res.json({ message: 'Address deleted' });
        } catch (error) {
            next(error);
        }
    }
);

// Set address as default
router.post(
    '/:id/default',
    authenticate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customerId = await getCustomerId(req.user!.userId);
            if (!customerId) {
                res.status(404).json({ error: 'Customer profile not found' });
                return;
            }

            // Check ownership
            const existing = await prisma.address.findFirst({
                where: { id: req.params.id, customerId },
            });

            if (!existing) {
                res.status(404).json({ error: 'Address not found' });
                return;
            }

            // Unset all other defaults
            await prisma.address.updateMany({
                where: { customerId, isDefault: true },
                data: { isDefault: false },
            });

            // Set this one as default
            const address = await prisma.address.update({
                where: { id: req.params.id },
                data: { isDefault: true },
            });

            res.json(address);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
