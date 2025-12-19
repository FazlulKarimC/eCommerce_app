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

export const env = {
    // Server
    PORT: parseInt(process.env.PORT || '3001', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Database - Required, no fallback
    DATABASE_URL: getRequiredEnv('DATABASE_URL'),

    // Frontend
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

    // Features
    MOCK_EMAIL: process.env.MOCK_EMAIL === 'true',

    // Helpers
    isDevelopment: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
};

export default env;
