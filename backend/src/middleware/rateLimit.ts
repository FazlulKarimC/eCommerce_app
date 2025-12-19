import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * 300 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

/**
 * Auth endpoints rate limiter (stricter)
 * 15 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15,
    message: { error: 'Too many authentication attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Contact form rate limiter
 * 9 requests per hour per IP
 */
export const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 9,
    message: { error: 'Too many messages sent. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
