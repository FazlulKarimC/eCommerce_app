import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

export interface RefreshTokenPayload {
    userId: string;
    tokenVersion?: number;
}

export function generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as any);
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as any);
}

export function verifyAccessToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    } catch {
        return null;
    }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
    } catch {
        return null;
    }
}

export function getExpirationDate(duration: string): Date {
    const match = duration.match(/^(\d+)([dhms])$/);
    if (!match) {
        throw new Error(
            `Invalid JWT expiration format: "${duration}". ` +
            `Expected format: <number><unit> where unit is 's' (seconds), 'm' (minutes), 'h' (hours), or 'd' (days). ` +
            `Examples: "15m", "1h", "7d". Check your JWT_EXPIRES_IN environment variable.`
        );
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
        's': 1000,
        'm': 60 * 1000,
        'h': 60 * 60 * 1000,
        'd': 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * (multipliers[unit] || multipliers['d']));
}
