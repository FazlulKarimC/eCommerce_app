/*
// Legacy Auth Service - Deprecated by Better Auth Migration
// This file is kept for reference but disabled to prevent build errors.

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
    // ... all methods commented out ...
}

export const authService = new AuthService();
*/

// Export dummy to satisfy any lingering imports (though ideally usage should be removed)
export const authService = {
    register: async () => { throw new Error('Deprecated'); },
    login: async () => { throw new Error('Deprecated'); },
    refreshToken: async () => { throw new Error('Deprecated'); },
    logout: async () => { throw new Error('Deprecated'); },
    logoutAll: async () => { throw new Error('Deprecated'); },
    forgotPassword: async () => { throw new Error('Deprecated'); },
    resetPassword: async () => { throw new Error('Deprecated'); },
    getProfile: async () => { throw new Error('Deprecated'); },
    updateProfile: async () => { throw new Error('Deprecated'); },
    changePassword: async () => { throw new Error('Deprecated'); },
};
