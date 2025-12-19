import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { subscribeToNewsletter } from '../services/email.service';
import { apiLimiter } from '../middleware/rateLimit';

const router = Router();

// Validation schema for newsletter subscription
const subscribeSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

/**
 * POST /api/newsletter/subscribe
 * Subscribe to newsletter
 */
router.post('/subscribe', apiLimiter, async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate request body
        const result = subscribeSchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: result.error.errors[0]?.message || 'Invalid email address',
            });
            return;
        }

        const { email } = result.data;

        // Subscribe via Resend
        const response = await subscribeToNewsletter(email);

        res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
        console.error('[NEWSLETTER] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe. Please try again later.',
        });
    }
});

export default router;
