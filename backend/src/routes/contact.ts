import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { sendContactMessage } from '../services/email.service';
import { contactLimiter } from '../middleware/rateLimit';

const router = Router();

// Validation schema for contact form
const contactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email address'),
    subject: z.enum(['order', 'product', 'shipping', 'returns', 'feedback', 'other']),
    message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

/**
 * POST /api/contact
 * Submit a contact form message
 */
router.post('/', contactLimiter, async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate request body
        const result = contactSchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }

        const { name, email, subject, message } = result.data;

        // Send email via Resend
        const emailSent = await sendContactMessage({ name, email, subject, message });

        if (!emailSent) {
            // Log the message even if email fails (for debugging)
            console.log('[CONTACT] Message received but email not sent:', { name, email, subject });
            console.log('[CONTACT] Message:', message);
        }

        // Always return success to user (don't expose email delivery status)
        res.status(200).json({
            success: true,
            message: 'Thank you for your message! We\'ll get back to you soon.',
        });
    } catch (error) {
        console.error('[CONTACT] Error processing contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit message. Please try again later.',
        });
    }
});

export default router;
