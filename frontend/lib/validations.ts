import { z } from 'zod';

export const customerInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
});

export const paymentInfoSchema = z.object({
  cardNumber: z.string().regex(/^\d{1}$/, 'Card number must be 1 digit'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Please enter MM/YY format').refine((date) => {
    const [month, year] = date.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    return expiry > new Date();
  }, 'Expiry date must be in the future'),
  cvv: z.string().regex(/^\d{3}$/, 'CVV must be 3 digits'),
});

export const productSelectionSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  selectedColor: z.string().min(1, 'Please select a color'),
  selectedSize: z.string().min(1, 'Please select a size'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(10, 'Maximum quantity is 10'),
});

export const checkoutFormSchema = customerInfoSchema.merge(paymentInfoSchema);

export type CustomerInfoForm = z.infer<typeof customerInfoSchema>;
export type PaymentInfoForm = z.infer<typeof paymentInfoSchema>;
export type ProductSelectionForm = z.infer<typeof productSelectionSchema>;
export type CheckoutForm = z.infer<typeof checkoutFormSchema>;