import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { cartService } from '../services/cart.service';
import { validateBody, validateParams } from '../middleware/validate';
import { optionalAuth } from '../middleware/auth';
import { addToCartSchema, updateCartItemSchema, idParamSchema } from '../validators/common.validator';

const router = Router();

// Helper to get cart identifier
function getCartIdentifier(req: Request): { customerId?: string; sessionId?: string } {
    // If authenticated, use customer ID
    if (req.user) {
        return { customerId: req.user.userId };
    }

    // Otherwise use session ID from header or cookie
    let sessionId = req.headers['x-session-id'] as string || req.cookies?.sessionId;

    if (!sessionId) {
        // Generate new session ID using cryptographically secure random UUID
        sessionId = `sess_${crypto.randomUUID()}`;
    }

    return { sessionId };
}

// Get cart
router.get(
    '/',
    optionalAuth,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { customerId, sessionId } = getCartIdentifier(req);
            const cart = await cartService.getOrCreateCart(customerId, sessionId);

            // Include session ID in response for guest users
            res.json({
                ...cart,
                sessionId: sessionId || undefined,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Add item to cart
router.post(
    '/items',
    optionalAuth,
    validateBody(addToCartSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { customerId, sessionId } = getCartIdentifier(req);
            const { id: cartId } = await cartService.getOrCreateCart(customerId, sessionId);
            const cart = await cartService.addItem(cartId, req.body);

            res.json({
                ...cart,
                sessionId: sessionId || undefined,
            });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('not found') || error.message.includes('Insufficient')) {
                    res.status(400).json({ error: error.message });
                    return;
                }
            }
            next(error);
        }
    }
);

// Update item quantity
router.patch(
    '/items/:id',
    optionalAuth,
    validateParams(idParamSchema),
    validateBody(updateCartItemSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { customerId, sessionId } = getCartIdentifier(req);
            const { id: cartId } = await cartService.getOrCreateCart(customerId, sessionId);
            const cart = await cartService.updateItemQuantity(cartId, req.params.id, req.body.quantity);

            res.json({
                ...cart,
                sessionId: sessionId || undefined,
            });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Cart item not found') {
                    res.status(404).json({ error: error.message });
                    return;
                }
                if (error.message === 'Insufficient inventory') {
                    res.status(400).json({ error: error.message });
                    return;
                }
            }
            next(error);
        }
    }
);

// Remove item from cart
router.delete(
    '/items/:id',
    optionalAuth,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { customerId, sessionId } = getCartIdentifier(req);
            const { id: cartId } = await cartService.getOrCreateCart(customerId, sessionId);
            const cart = await cartService.removeItem(cartId, req.params.id);

            res.json({
                ...cart,
                sessionId: sessionId || undefined,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Clear cart
router.delete(
    '/',
    optionalAuth,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { customerId, sessionId } = getCartIdentifier(req);
            const { id: cartId } = await cartService.getOrCreateCart(customerId, sessionId);
            const cart = await cartService.clearCart(cartId);

            res.json({
                ...cart,
                sessionId: sessionId || undefined,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Merge guest cart to customer cart (called after login)
router.post(
    '/merge',
    optionalAuth,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Authentication required' });
                return;
            }

            const sessionId = req.body.sessionId || req.headers['x-session-id'];

            if (!sessionId) {
                // No guest cart to merge, just return customer cart
                const cart = await cartService.getOrCreateCart(req.user.userId);
                res.json(cart);
                return;
            }

            const cart = await cartService.mergeCart(sessionId, req.user.userId);
            res.json(cart);
        } catch (error) {
            // Log the error for debugging
            console.error('[CART MERGE ERROR]', error);

            // Handle specific errors
            if (error instanceof Error) {
                if (error.message.includes('not found')) {
                    // Cart not found - return fresh customer cart instead
                    try {
                        const cart = await cartService.getOrCreateCart(req.user!.userId);
                        res.json(cart);
                        return;
                    } catch (fallbackError) {
                        next(fallbackError);
                        return;
                    }
                }
            }
            next(error);
        }
    }
);

export default router;
