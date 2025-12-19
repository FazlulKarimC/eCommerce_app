import { Router } from 'express';
import authRouter from './auth';
import productsRouter from './products';
import collectionsRouter from './collections';
import categoriesRouter from './categories';
import cartRouter from './cart';
import checkoutRouter from './checkout';
import ordersRouter from './orders';
import customersRouter from './customers';
import reviewsRouter from './reviews';
import wishlistRouter from './wishlist';
import discountsRouter from './discounts';
import contactRouter from './contact';
import newsletterRouter from './newsletter';

const router = Router();

// API Routes
// router.use('/auth', authRouter); // Legacy auth routes replaced by Better Auth
router.use('/products', productsRouter);
router.use('/collections', collectionsRouter);
router.use('/categories', categoriesRouter);
router.use('/cart', cartRouter);
router.use('/checkout', checkoutRouter);
router.use('/orders', ordersRouter);
router.use('/customers', customersRouter);
router.use('/reviews', reviewsRouter);
router.use('/wishlist', wishlistRouter);
router.use('/discounts', discountsRouter);
router.use('/contact', contactRouter);
router.use('/newsletter', newsletterRouter);

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
