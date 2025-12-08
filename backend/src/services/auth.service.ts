import { prisma } from '../config/database';
import { hashPassword, verifyPassword } from '../utils/password';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    getExpirationDate
} from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { UserRole } from '@prisma/client';
import crypto from 'crypto';

export interface AuthResult {
    user: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
    };
    accessToken: string;
    refreshToken: string;
}

export class AuthService {
    /**
     * Register a new user
     */
    async register(input: RegisterInput, role: UserRole = UserRole.CUSTOMER): Promise<AuthResult> {
        const existingUser = await prisma.user.findUnique({
            where: { email: input.email.toLowerCase() },
        });

        if (existingUser) {
            throw new Error('Email already registered');
        }

        const passwordHash = await hashPassword(input.password);

        const user = await prisma.user.create({
            data: {
                email: input.email.toLowerCase(),
                passwordHash,
                name: input.name,
                role,
                customer: role === UserRole.CUSTOMER ? {
                    create: {}
                } : undefined,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });

        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        const refreshToken = generateRefreshToken({
            userId: user.id,
        });

        // Store session
        await prisma.session.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: getExpirationDate('30d'),
            },
        });

        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    /**
     * Login user
     */
    async login(input: LoginInput): Promise<AuthResult> {
        const user = await prisma.user.findUnique({
            where: {
                email: input.email.toLowerCase(),
                deletedAt: null,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                passwordHash: true,
            },
        });

        if (!user || !user.passwordHash) {
            throw new Error('Invalid email or password');
        }

        const isValidPassword = await verifyPassword(input.password, user.passwordHash);

        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        const refreshToken = generateRefreshToken({
            userId: user.id,
        });

        // Store session
        await prisma.session.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: getExpirationDate('30d'),
            },
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    }

    /**
     * Refresh access token
     */
    async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
        const payload = verifyRefreshToken(token);

        if (!payload) {
            throw new Error('Invalid refresh token');
        }

        // Verify session exists
        const session = await prisma.session.findFirst({
            where: {
                token,
                userId: payload.userId,
                expiresAt: { gt: new Date() },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        deletedAt: true,
                    },
                },
            },
        });

        if (!session || session.user.deletedAt) {
            throw new Error('Session expired or invalid');
        }

        // Generate new tokens
        const accessToken = generateAccessToken({
            userId: session.user.id,
            email: session.user.email,
            role: session.user.role,
        });

        const newRefreshToken = generateRefreshToken({
            userId: session.user.id,
        });

        // Rotate refresh token
        await prisma.session.update({
            where: { id: session.id },
            data: {
                token: newRefreshToken,
                expiresAt: getExpirationDate('30d'),
            },
        });

        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }

    /**
     * Logout user
     */
    async logout(refreshToken: string): Promise<void> {
        await prisma.session.deleteMany({
            where: { token: refreshToken },
        });
    }

    /**
     * Logout from all devices
     */
    async logoutAll(userId: string): Promise<void> {
        await prisma.session.deleteMany({
            where: { userId },
        });
    }

    /**
     * Request password reset
     */
    async forgotPassword(email: string): Promise<void> {
        const user = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase(),
                deletedAt: null,
            },
        });

        if (!user) {
            // Don't reveal if user exists
            return;
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await prisma.passwordReset.create({
            data: {
                userId: user.id,
                token,
                expiresAt,
            },
        });

        // Mock email - just log to console
        console.log(`[MOCK EMAIL] Password reset link for ${email}: /reset-password?token=${token}`);
    }

    /**
     * Reset password
     */
    async resetPassword(token: string, newPassword: string): Promise<void> {
        const resetRequest = await prisma.passwordReset.findFirst({
            where: {
                token,
                used: false,
                expiresAt: { gt: new Date() },
            },
            include: {
                user: true,
            },
        });

        if (!resetRequest) {
            throw new Error('Invalid or expired reset token');
        }

        const passwordHash = await hashPassword(newPassword);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetRequest.userId },
                data: { passwordHash },
            }),
            prisma.passwordReset.update({
                where: { id: resetRequest.id },
                data: { used: true },
            }),
            // Invalidate all sessions
            prisma.session.deleteMany({
                where: { userId: resetRequest.userId },
            }),
        ]);
    }

    /**
     * Get current user profile
     */
    async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatarUrl: true,
                emailVerified: true,
                createdAt: true,
                customer: {
                    select: {
                        id: true,
                        phone: true,
                        addresses: true,
                    },
                },
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    /**
     * Update user profile
     */
    async updateProfile(userId: string, data: { name?: string; phone?: string }) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                customer: data.phone ? {
                    upsert: {
                        create: { phone: data.phone },
                        update: { phone: data.phone },
                    },
                } : undefined,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                customer: {
                    select: {
                        phone: true,
                    },
                },
            },
        });

        return user;
    }

    /**
     * Change password
     */
    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { passwordHash: true },
        });

        if (!user || !user.passwordHash) {
            throw new Error('User not found');
        }

        const isValid = await verifyPassword(currentPassword, user.passwordHash);
        if (!isValid) {
            throw new Error('Current password is incorrect');
        }

        const passwordHash = await hashPassword(newPassword);
        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
    }
}

export const authService = new AuthService();
