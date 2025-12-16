import crypto from 'crypto';

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by appending a cryptographically secure random suffix
 */
export function generateUniqueSlug(text: string): string {
    const baseSlug = generateSlug(text);
    // Use crypto.randomBytes for secure random suffix
    const suffix = crypto.randomBytes(4).toString('hex');
    return `${baseSlug}-${suffix}`;
}

/**
 * Generate order number in format ORD-YYYY-TIMESTAMP-RANDOM
 * Uses crypto.randomBytes for cryptographically secure random component
 */
export function generateOrderNumber(): string {
    const year = new Date().getFullYear();
    // Use timestamp (base36) + secure random for uniqueness
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(3).toString('hex'); // 6 hex chars
    return `ORD-${year}-${timestamp}-${random}`;
}

/**
 * Generate a cryptographically secure random alphanumeric code (for discount codes, etc.)
 * Uses crypto.randomInt for unbiased character selection
 */
export function generateCode(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        // crypto.randomInt provides cryptographically secure random integers
        result += chars.charAt(crypto.randomInt(0, chars.length));
    }
    return result;
}

/**
 * Format price for display with NaN validation
 */
export function formatPrice(amount: number | string, currency: string = 'USD'): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    // Validate the parsed number - return $0.00 for invalid values
    if (!Number.isFinite(numAmount)) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(0);
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(numAmount);
}

/**
 * Calculate percentage discount
 */
export function calculateDiscount(original: number, discounted: number): number {
    if (original <= 0) return 0;
    return Math.round(((original - discounted) / original) * 100);
}

