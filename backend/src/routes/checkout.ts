import { Router, Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';
import { cartService } from '../services/cart.service';
import { validateBody } from '../middleware/validate';
import { optionalAuth } from '../middleware/auth';
import { checkoutSchema, applyDiscountSchema } from '../validators';

const router = Router();

// Apply discount code (check validity)
router.post(
    '/discount',
    validateBody(applyDiscountSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get subtotal from cart
            const sessionId = req.headers['x-session-id'] as string;
            const customerId = req.user?.userId;

            const cart = await cartService.getOrCreateCart(customerId, sessionId);

            if (cart.subtotal === 0) {
                res.status(400).json({ error: 'Cart is empty' });
                return;
            }

            const result = await orderService.applyDiscount(req.body.code, cart.subtotal);

            res.json({
                valid: true,
                code: req.body.code.toUpperCase(),
                type: result.type,
                discount: result.discount,
                subtotal: cart.subtotal,
                newSubtotal: cart.subtotal - result.discount,
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            next(error);
        }
    }
);

// Process checkout
router.post(
    '/',
    optionalAuth,
    validateBody(checkoutSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sessionId = req.headers['x-session-id'] as string;
            const customerId = req.user?.userId;

            // Get cart
            const cart = await cartService.getOrCreateCart(customerId, sessionId);

            if (cart.items.length === 0) {
                res.status(400).json({ error: 'Cart is empty' });
                return;
            }

            // Process checkout
            const order = await orderService.checkout(cart.id, req.body, customerId);

            res.status(201).json({
                message: 'Order placed successfully',
                order,
            });
        } catch (error) {
            if (error instanceof Error) {
                // Handle known errors
                if (
                    error.message.includes('Cart is empty') ||
                    error.message.includes('Insufficient inventory') ||
                    error.message.includes('Payment failed') ||
                    error.message.includes('Card declined') ||
                    error.message.includes('discount')
                ) {
                    res.status(400).json({ error: error.message });
                    return;
                }
            }
            next(error);
        }
    }
);

// Get checkout preview (calculate totals without placing order)
router.post(
    '/preview',
    optionalAuth,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sessionId = req.headers['x-session-id'] as string;
            const customerId = req.user?.userId;

            const cart = await cartService.getOrCreateCart(customerId, sessionId);

            if (cart.items.length === 0) {
                res.status(400).json({ error: 'Cart is empty' });
                return;
            }

            let discount = 0;
            let discountType = null;

            if (req.body.discountCode) {
                try {
                    const discountResult = await orderService.applyDiscount(req.body.discountCode, cart.subtotal);
                    discount = discountResult.discount;
                    discountType = discountResult.type;
                } catch {
                    // Ignore invalid discount codes in preview
                }
            }

            // Get store settings
            const { prisma } = await import('../config/database');
            const settings = await prisma.storeSettings.findUnique({
                where: { id: 'default' },
            });

            const shippingCost = settings?.shippingRate ? parseFloat(settings.shippingRate.toString()) : 0;
            const freeShippingThreshold = settings?.freeShippingThreshold
                ? parseFloat(settings.freeShippingThreshold.toString())
                : null;

            const finalShipping = (freeShippingThreshold && cart.subtotal >= freeShippingThreshold) ? 0 : shippingCost;

            const taxRate = settings?.defaultTaxRate ? parseFloat(settings.defaultTaxRate.toString()) : 0;
            const tax = (cart.subtotal - discount) * (taxRate / 100);
            const total = cart.subtotal - discount + finalShipping + tax;

            res.json({
                items: cart.items,
                itemCount: cart.itemCount,
                subtotal: cart.subtotal,
                discount,
                discountType,
                shipping: finalShipping,
                freeShippingThreshold,
                tax,
                taxRate,
                total,
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
