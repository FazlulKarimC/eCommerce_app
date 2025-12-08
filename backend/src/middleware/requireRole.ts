import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';

/**
 * Require specific role(s) to access route
 * Must be used after authenticate middleware
 */
export function requireRole(...allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const userRole = req.user.role as UserRole;

        if (!allowedRoles.includes(userRole)) {
            res.status(403).json({
                error: 'Access denied',
                message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`
            });
            return;
        }

        next();
    };
}

/**
 * Require admin role
 */
export const requireAdmin = requireRole(UserRole.ADMIN);

/**
 * Require admin or staff role
 */
export const requireStaff = requireRole(UserRole.ADMIN, UserRole.STAFF);

/**
 * Require customer role (or admin/staff)
 */
export const requireCustomer = requireRole(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER);
