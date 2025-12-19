import { Router, Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';
import { emailService } from '../services/email.service';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { authenticate, optionalAuth } from '../middleware/auth';
import { requireStaff } from '../middleware/requireRole';
import {
  idParamSchema,
  orderQuerySchema,
} from '../validators/common.validator';
import {
  updateOrderStatusSchema,
  addFulfillmentSchema,
  cancelOrderSchema,
} from '../validators/order.validator';
import { z } from 'zod';

const router = Router();

// ==================== CUSTOMER ROUTES ====================

// Get order by order number (public - for thank you page)
// Returns minimal info for unauthenticated users, full details for owner/staff
router.get(
  '/number/:orderNumber',
  optionalAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await orderService.findByOrderNumber(req.params.orderNumber);

      // Check if user is owner or staff
      // order.customerId is the Customer table ID, not the User ID
      // We need to check if the order's customer belongs to this user
      const isOwner = req.user && order.customer?.userId === req.user.userId;
      const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'STAFF';

      if (!isOwner && !isStaff) {
        // Return minimal info for unauthenticated/unauthorized access
        // Prevents exposing PII to anyone who guesses order numbers
        res.json({
          orderNumber: order.orderNumber,
          status: order.status,
          createdAt: order.createdAt,
        });
        return;
      }

      res.json(order);
    } catch (error) {
      if (error instanceof Error && error.message === 'Order not found') {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      next(error);
    }
  }
);

// Get my orders (authenticated customer)
router.get(
  '/my-orders',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await orderService.getCustomerOrders(req.user!.userId, page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Get single order (authenticated - must be own order or admin)
router.get(
  '/:id',
  authenticate,
  validateParams(idParamSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await orderService.findById(req.params.id);

      // Check if user owns this order or is admin/staff
      // order.customer?.userId is the User ID, order.customerId is Customer ID
      const isOwner = order.customer?.userId === req.user!.userId;
      const isStaff = req.user!.role === 'ADMIN' || req.user!.role === 'STAFF';

      if (!isOwner && !isStaff) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      res.json(order);
    } catch (error) {
      if (error instanceof Error && error.message === 'Order not found') {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      next(error);
    }
  }
);

// ==================== ADMIN ROUTES ====================

// Get dashboard stats (admin/staff) - server-side aggregation
router.get(
  '/stats',
  authenticate,
  requireStaff,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Use Prisma aggregate for efficient server-side calculation
      const [revenueResult, orderCount] = await Promise.all([
        orderService.getRevenueStats(),
        orderService.getOrderCount(),
      ]);

      res.json({
        totalRevenue: revenueResult.totalRevenue,
        totalOrders: orderCount,
        currency: 'USD',
      });
    } catch (error) {
      next(error);
    }
  }
);

// List all orders (admin/staff)
router.get(
  '/',
  authenticate,
  requireStaff,
  validateQuery(orderQuerySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await orderService.findMany(req.query as any);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Update order status (admin/staff)
router.patch(
  '/:id/status',
  authenticate,
  requireStaff,
  validateParams(idParamSchema),
  validateBody(updateOrderStatusSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await orderService.updateStatus(
        req.params.id,
        req.body.status,
        req.body.notes
      );
      res.json(order);
    } catch (error) {
      if (error instanceof Error && error.message === 'Order not found') {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      next(error);
    }
  }
);

// Add fulfillment/shipping info (admin/staff)
router.post(
  '/:id/fulfillment',
  authenticate,
  requireStaff,
  validateParams(idParamSchema),
  validateBody(addFulfillmentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await orderService.addFulfillment(req.params.id, req.body);

      // Send shipping notification email
      const customerName = order.shippingAddress
        ? order.shippingAddress.firstName
        : order.email.split('@')[0];

      emailService.sendShippingNotification({
        orderNumber: order.orderNumber,
        email: order.email,
        customerName,
        carrier: req.body.carrier,
        trackingNumber: req.body.trackingNumber,
        trackingUrl: req.body.trackingUrl,
        estimatedDelivery: req.body.estimatedDelivery,
      }).catch((err) => {
        console.error('[EMAIL] Failed to send shipping notification:', err);
      });

      res.json(order);
    } catch (error) {
      next(error);
    }
  }
);

// Cancel order (admin/staff)
router.post(
  '/:id/cancel',
  authenticate,
  requireStaff,
  validateParams(idParamSchema),
  validateBody(cancelOrderSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await orderService.updateStatus(
        req.params.id,
        'CANCELLED',
        req.body.reason
      );
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
