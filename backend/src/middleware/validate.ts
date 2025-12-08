import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

// Extend Express Request to include validated data
declare global {
    namespace Express {
        interface Request {
            validatedQuery?: any;
            validatedParams?: any;
        }
    }
}

interface ValidationSchemas {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}

/**
 * Validation middleware using Zod schemas
 * Validates request body, query, and params
 * For Express 5 compatibility, validated query/params are stored in req.validatedQuery/req.validatedParams
 * but we also merge the transformed values back into query access
 */
export function validate(schemas: ValidationSchemas) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (schemas.body) {
                req.body = await schemas.body.parseAsync(req.body);
            }
            if (schemas.query) {
                const validatedQuery = await schemas.query.parseAsync(req.query);
                req.validatedQuery = validatedQuery;
                // Also merge back for easy access (Express 5 compatible way)
                Object.assign(req.query, validatedQuery);
            }
            if (schemas.params) {
                const validatedParams = await schemas.params.parseAsync(req.params);
                req.validatedParams = validatedParams;
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code,
                }));

                res.status(400).json({
                    error: 'Validation failed',
                    details: formattedErrors,
                });
                return;
            }
            next(error);
        }
    };
}

/**
 * Validate only request body
 */
export function validateBody(schema: ZodSchema) {
    return validate({ body: schema });
}

/**
 * Validate only query params
 */
export function validateQuery(schema: ZodSchema) {
    return validate({ query: schema });
}

/**
 * Validate only URL params
 */
export function validateParams(schema: ZodSchema) {
    return validate({ params: schema });
}
