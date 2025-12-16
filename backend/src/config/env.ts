import dotenv from 'dotenv';

dotenv.config();

// Helper to get required environment variables with clear error messages
function getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} is required. Please set it in your environment variables.`);
    }
    return value;
}

// Helper to get JWT secrets with production validation
function getJwtSecret(key: string, devDefault: string): string {
    const value = process.env[key];
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction && !value) {
        throw new Error(
            `${key} is required in production. ` +
            `Please set a secure, random secret in your environment variables.`
        );
    }

    return value || devDefault;
}

export const env = {
    // Server
    PORT: parseInt(process.env.PORT || '3001', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Database - Required, no fallback
    DATABASE_URL: getRequiredEnv('DATABASE_URL'),

    // JWT - Required in production, dev defaults for local development
    JWT_SECRET: getJwtSecret('JWT_SECRET', 'dev-jwt-secret-do-not-use-in-production'),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    JWT_REFRESH_SECRET: getJwtSecret('JWT_REFRESH_SECRET', 'dev-refresh-secret-do-not-use-in-production'),
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

    // Frontend
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

    // Features
    MOCK_EMAIL: process.env.MOCK_EMAIL === 'true',

    // Helpers
    isDevelopment: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
};

export default env;
