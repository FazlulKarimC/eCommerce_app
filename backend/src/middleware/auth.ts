import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload & { sessionId?: string };
        }
    }
}

/**
 * Authentication middleware - validates JWT token
 * Sets req.user if token is valid
 */
export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const payload = verifyAccessToken(token);

        if (!payload) {
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }

        // Verify user still exists and is not deleted
        const user = await prisma.user.findFirst({
            where: {
                id: payload.userId,
                deletedAt: null,
            },
            select: {
                id: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        req.user = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };

        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
}

/**
 * Optional authentication - sets user if token present, but doesn't require it
 */
export async function optionalAuth(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.split(' ')[1];
        const payload = verifyAccessToken(token);

        if (payload) {
            const user = await prisma.user.findFirst({
                where: {
                    id: payload.userId,
                    deletedAt: null,
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                },
            });

            if (user) {
                req.user = {
                    userId: user.id,
                    email: user.email,
                    role: user.role,
                };
            }
        }

        next();
    } catch {
        // Ignore errors and proceed without auth
        next();
    }
}
