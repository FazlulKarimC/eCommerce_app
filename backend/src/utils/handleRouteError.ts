import { Response, NextFunction } from 'express';

/**
 * Error patterns and their corresponding HTTP status codes
 */
const ERROR_PATTERNS: Record<string, number> = {
    'not found': 404,
    'already exists': 409,
    'insufficient': 400,
    'invalid': 400,
    'unauthorized': 401,
    'forbidden': 403,
    'expired': 401,
    'cart is empty': 400,
    'payment failed': 400,
    'card declined': 400,
};

/**
 * Handle common route errors with pattern matching
 * Use this in catch blocks to automatically map errors to HTTP status codes
 * 
 * @example
 * ```typescript
 * } catch (error) {
 *     handleRouteError(error, res, next);
 * }
 * ```
 */
export function handleRouteError(
    error: unknown,
    res: Response,
    next: NextFunction
): void {
    if (error instanceof Error) {
        const message = error.message.toLowerCase();

        for (const [pattern, status] of Object.entries(ERROR_PATTERNS)) {
            if (message.includes(pattern)) {
                res.status(status).json({ error: error.message });
                return;
            }
        }
    }

    // If no pattern matches, pass to global error handler
    next(error);
}
