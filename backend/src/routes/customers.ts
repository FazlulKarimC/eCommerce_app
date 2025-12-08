import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { requireStaff } from '../middleware/requireRole';
import { validateParams, validateBody } from '../middleware/validate';
import { idParamSchema, addressSchema, paginationSchema } from '../validators/common.validator';

const router = Router();

// ==================== ADMIN ROUTES ====================

// List all customers
router.get(
  '/',
  authenticate,
  requireStaff,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;

      const where = search
        ? {
          user: {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
            ],
          },
        }
        : {};

      const [customers, total] = await Promise.all([
        prisma.customer.findMany({
          where,
          include: {
            user: { select: { id: true, name: true, email: true, createdAt: true } },
            _count: { select: { orders: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.customer.count({ where }),
      ]);

      res.json({
        customers,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get customer details
router.get(
  '/:id',
  authenticate,
  requireStaff,
  validateParams(idParamSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customer = await prisma.customer.findUnique({
        where: { id: req.params.id },
        include: {
          user: { select: { id: true, name: true, email: true, createdAt: true } },
          addresses: true,
          orders: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
              items: true,
            },
          },
          _count: { select: { orders: true, reviews: true } },
        },
      });

      if (!customer) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }

      // Calculate total spent
      const totalSpent = await prisma.order.aggregate({
        where: { customerId: customer.id, status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
        _sum: { total: true },
      });

      res.json({
        ...customer,
        totalSpent: totalSpent._sum.total || 0,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update customer notes
router.patch(
  '/:id',
  authenticate,
  requireStaff,
  validateParams(idParamSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customer = await prisma.customer.update({
        where: { id: req.params.id },
        data: {
          notes: req.body.notes,
          phone: req.body.phone,
        },
      });

      res.json(customer);
    } catch (error) {
      next(error);
    }
  }
);

// ==================== CUSTOMER SELF-SERVICE ROUTES ====================

// Get my addresses
router.get(
  '/me/addresses',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customer = await prisma.customer.findUnique({
        where: { userId: req.user!.userId },
        include: { addresses: { orderBy: { isDefault: 'desc' } } },
      });

      res.json(customer?.addresses || []);
    } catch (error) {
      next(error);
    }
  }
);

// Add address
router.post(
  '/me/addresses',
  authenticate,
  validateBody(addressSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let customer = await prisma.customer.findUnique({
        where: { userId: req.user!.userId },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: { userId: req.user!.userId },
        });
      }

      // If setting as default, unset other defaults
      if (req.body.isDefault) {
        await prisma.address.updateMany({
          where: { customerId: customer.id },
          data: { isDefault: false },
        });
      }

      const address = await prisma.address.create({
        data: {
          customerId: customer.id,
          ...req.body,
        },
      });

      res.status(201).json(address);
    } catch (error) {
      next(error);
    }
  }
);

// Update address
router.patch(
  '/me/addresses/:id',
  authenticate,
  validateParams(idParamSchema),
  validateBody(addressSchema.partial()),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customer = await prisma.customer.findUnique({
        where: { userId: req.user!.userId },
      });

      if (!customer) {
        res.status(404).json({ error: 'Address not found' });
        return;
      }

      // Verify address belongs to customer
      const address = await prisma.address.findFirst({
        where: { id: req.params.id, customerId: customer.id },
      });

      if (!address) {
        res.status(404).json({ error: 'Address not found' });
        return;
      }

      // If setting as default, unset other defaults
      if (req.body.isDefault) {
        await prisma.address.updateMany({
          where: { customerId: customer.id, id: { not: req.params.id } },
          data: { isDefault: false },
        });
      }

      const updated = await prisma.address.update({
        where: { id: req.params.id },
        data: req.body,
      });

      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
);

// Delete address
router.delete(
  '/me/addresses/:id',
  authenticate,
  validateParams(idParamSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customer = await prisma.customer.findUnique({
        where: { userId: req.user!.userId },
      });

      if (!customer) {
        res.status(404).json({ error: 'Address not found' });
        return;
      }

      await prisma.address.deleteMany({
        where: { id: req.params.id, customerId: customer.id },
      });

      res.json({ message: 'Address deleted' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
