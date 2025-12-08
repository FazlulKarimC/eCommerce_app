import { z } from 'zod';

const shippingAddressSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    company: z.string().optional(),
    line1: z.string().min(1, 'Address is required'),
    line2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().default('US'),
    phone: z.string().optional(),
});

const paymentInfoSchema = z.object({
    cardNumber: z.string()
        .min(13, 'Invalid card number')
        .max(19, 'Invalid card number')
        .regex(/^[0-9\s-]+$/, 'Invalid card number format'),
    expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Invalid expiry month'),
    expiryYear: z.string().regex(/^[0-9]{2,4}$/, 'Invalid expiry year'),
    cvv: z.string().regex(/^[0-9]{3,4}$/, 'Invalid CVV'),
    cardholderName: z.string().min(1, 'Cardholder name is required'),
});

export const checkoutSchema = z.object({
    email: z.string().email('Invalid email'),
    phone: z.string().optional(),
    shippingAddress: shippingAddressSchema,
    billingAddress: shippingAddressSchema.optional(),
    sameAsShipping: z.boolean().default(true),
    paymentInfo: paymentInfoSchema,
    discountCode: z.string().optional(),
    customerNotes: z.string().optional(),
    saveAddress: z.boolean().default(false),
    createAccount: z.boolean().default(false),
    password: z.string().min(8).optional(),
});

export const updateOrderStatusSchema = z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
    notes: z.string().optional(),
});

export const addFulfillmentSchema = z.object({
    carrier: z.string().optional(),
    trackingNumber: z.string().optional(),
    trackingUrl: z.string().url().optional(),
    estimatedDelivery: z.string().datetime().optional(),
});

export const cancelOrderSchema = z.object({
    reason: z.string().min(1, 'Cancellation reason is required'),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type AddFulfillmentInput = z.infer<typeof addFulfillmentSchema>;
