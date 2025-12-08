import { Router, Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { validateBody } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    updateProfileSchema,
    changePasswordSchema,
} from '../validators/auth.validator';

const router = Router();

// Register
router.post(
    '/register',
    validateBody(registerSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await authService.register(req.body);
            res.status(201).json({
                message: 'Registration successful',
                ...result,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Login
router.post(
    '/login',
    validateBody(loginSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await authService.login(req.body);
            res.json({
                message: 'Login successful',
                ...result,
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'Invalid email or password') {
                res.status(401).json({ error: error.message });
                return;
            }
            next(error);
        }
    }
);

// Refresh token
router.post(
    '/refresh',
    validateBody(refreshTokenSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await authService.refreshToken(req.body.refreshToken);
            res.json(result);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ error: error.message });
                return;
            }
            next(error);
        }
    }
);

// Logout
router.post(
    '/logout',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshToken } = req.body;
            if (refreshToken) {
                await authService.logout(refreshToken);
            }
            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            next(error);
        }
    }
);

// Forgot password
router.post(
    '/forgot-password',
    validateBody(forgotPasswordSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await authService.forgotPassword(req.body.email);
            res.json({
                message: 'If an account with that email exists, a password reset link has been sent.'
            });
        } catch (error) {
            next(error);
        }
    }
);

// Reset password
router.post(
    '/reset-password',
    validateBody(resetPasswordSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await authService.resetPassword(req.body.token, req.body.password);
            res.json({ message: 'Password reset successful' });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            next(error);
        }
    }
);

// Get current user profile (protected)
router.get(
    '/me',
    authenticate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const profile = await authService.getProfile(req.user!.userId);
            res.json(profile);
        } catch (error) {
            next(error);
        }
    }
);

// Update profile (protected)
router.patch(
    '/me',
    authenticate,
    validateBody(updateProfileSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const profile = await authService.updateProfile(req.user!.userId, req.body);
            res.json(profile);
        } catch (error) {
            next(error);
        }
    }
);

// Change password (protected)
router.post(
    '/change-password',
    authenticate,
    validateBody(changePasswordSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await authService.changePassword(
                req.user!.userId,
                req.body.currentPassword,
                req.body.newPassword
            );
            res.json({ message: 'Password changed successfully' });
        } catch (error) {
            if (error instanceof Error && error.message === 'Current password is incorrect') {
                res.status(400).json({ error: error.message });
                return;
            }
            next(error);
        }
    }
);

// Logout from all devices (protected)
router.post(
    '/logout-all',
    authenticate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await authService.logoutAll(req.user!.userId);
            res.json({ message: 'Logged out from all devices' });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
