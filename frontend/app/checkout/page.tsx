'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, CreditCard, Loader2, ShoppingBag, Tag, X, Check } from 'lucide-react';
import { useCartStore } from '@/lib/cart';
import { useAuthStore } from '@/lib/auth';
import { formatPrice, cn } from '@/lib/utils';
import api from '@/lib/api';

const checkoutSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required').default('US'),
  cardNumber: z.string().length(16, 'Card number must be 16 digits'),
  expiryMonth: z.string().length(2, 'Invalid month'),
  expiryYear: z.string().length(2, 'Invalid year'),
  cvv: z.string().min(3, 'CVV must be 3-4 digits').max(4),
  cardholderName: z.string().min(1, 'Cardholder name is required'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutPreview {
  subtotal: number;
  discount: number;
  discountType: string | null;
  shipping: number;
  freeShippingThreshold: number | null;
  tax: number;
  taxRate: number;
  total: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Discount code state
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<string | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);

  // Checkout preview state
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: '',
      lastName: '',
      country: 'US',
    },
  });

  // Fetch checkout preview on mount and when discount changes
  useEffect(() => {
    const fetchPreview = async () => {
      if (!cart || cart.items.length === 0) return;
      
      setIsLoadingPreview(true);
      try {
        const response = await api.post('/checkout/preview', {
          discountCode: appliedDiscount || undefined,
        });
        setPreview(response.data);
      } catch (err) {
        console.error('Failed to fetch checkout preview:', err);
      } finally {
        setIsLoadingPreview(false);
      }
    };

    fetchPreview();
  }, [cart, appliedDiscount]);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    
    setIsApplyingDiscount(true);
    setDiscountError(null);

    try {
      const response = await api.post('/checkout/discount', {
        code: discountCode.trim(),
      });

      if (response.data.valid) {
        setAppliedDiscount(discountCode.trim().toUpperCase());
        setDiscountCode('');
      }
    } catch (err: any) {
      setDiscountError(err.response?.data?.error || 'Invalid discount code');
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountError(null);
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="w-20 h-20 mx-auto text-(--brutal-gray-400) mb-6" />
        <h1 className="text-4xl font-black">Your Cart is Empty</h1>
        <p className="text-(--brutal-gray-600) mt-2">
          Add some items before checkout
        </p>
        <Link href="/products" className="brutal-btn brutal-btn-dark mt-8 inline-flex">
          Start Shopping
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.post('/checkout', {
        email: data.email,
        phone: data.phone,
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          line1: data.address,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
        },
        paymentInfo: {
          cardNumber: data.cardNumber,
          expiryMonth: data.expiryMonth,
          expiryYear: data.expiryYear,
          cvv: data.cvv,
          cardholderName: data.cardholderName,
        },
        discountCode: appliedDiscount || undefined,
      });

      if (response.data.order) {
        clearCart();
        router.push(`/thank-you/${response.data.order.orderNumber}`);
      } else {
        setError(response.data.error || 'Checkout failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred during checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-bold mb-8 hover:text-(--brutal-red)">
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <h1 className="text-4xl font-black mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {error && (
                <div className="bg-(--brutal-red) text-white p-4 border-2 border-(--brutal-black)">
                  {error}
                </div>
              )}

              {/* Contact Info */}
              <div className="brutal-card p-6">
                <h2 className="text-xl font-black mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="font-bold text-sm block mb-2">Email</label>
                    <input
                      type="email"
                      {...register('email')}
                      className={cn('brutal-input', errors.email && 'border-(--brutal-red)')}
                    />
                    {errors.email && <p className="text-(--brutal-red) text-sm mt-1">{errors.email.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-bold text-sm block mb-2">Phone (optional)</label>
                    <input type="tel" {...register('phone')} className="brutal-input" />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="brutal-card p-6">
                <h2 className="text-xl font-black mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-sm block mb-2">First Name</label>
                    <input {...register('firstName')} className={cn('brutal-input', errors.firstName && 'border-(--brutal-red)')} />
                    {errors.firstName && <p className="text-(--brutal-red) text-sm mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="font-bold text-sm block mb-2">Last Name</label>
                    <input {...register('lastName')} className={cn('brutal-input', errors.lastName && 'border-(--brutal-red)')} />
                    {errors.lastName && <p className="text-(--brutal-red) text-sm mt-1">{errors.lastName.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-bold text-sm block mb-2">Address</label>
                    <input {...register('address')} className={cn('brutal-input', errors.address && 'border-(--brutal-red)')} />
                    {errors.address && <p className="text-(--brutal-red) text-sm mt-1">{errors.address.message}</p>}
                  </div>
                  <div>
                    <label className="font-bold text-sm block mb-2">City</label>
                    <input {...register('city')} className={cn('brutal-input', errors.city && 'border-(--brutal-red)')} />
                  </div>
                  <div>
                    <label className="font-bold text-sm block mb-2">State</label>
                    <input {...register('state')} className={cn('brutal-input', errors.state && 'border-(--brutal-red)')} />
                  </div>
                  <div>
                    <label className="font-bold text-sm block mb-2">Postal Code</label>
                    <input {...register('postalCode')} className={cn('brutal-input', errors.postalCode && 'border-(--brutal-red)')} />
                  </div>
                  <div>
                    <label className="font-bold text-sm block mb-2">Country</label>
                    <input {...register('country')} className="brutal-input" defaultValue="US" />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="brutal-card p-6">
                <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </h2>
                <p className="text-sm text-(--brutal-gray-600) mb-4">
                  Test: Card ending in 1 = success, 2 = declined, others = 80% success
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="font-bold text-sm block mb-2">Cardholder Name</label>
                    <input {...register('cardholderName')} className={cn('brutal-input', errors.cardholderName && 'border-(--brutal-red)')} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-bold text-sm block mb-2">Card Number</label>
                    <input
                      {...register('cardNumber')}
                      maxLength={16}
                      placeholder="1234567890123456"
                      className={cn('brutal-input', errors.cardNumber && 'border-(--brutal-red)')}
                    />
                    {errors.cardNumber && <p className="text-(--brutal-red) text-sm mt-1">{errors.cardNumber.message}</p>}
                  </div>
                  <div>
                    <label className="font-bold text-sm block mb-2">Expiry (MM/YY)</label>
                    <div className="flex gap-2">
                      <input {...register('expiryMonth')} maxLength={2} placeholder="MM" className="brutal-input w-20" />
                      <span className="self-center">/</span>
                      <input {...register('expiryYear')} maxLength={2} placeholder="YY" className="brutal-input w-20" />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-sm block mb-2">CVV</label>
                    <input {...register('cvv')} maxLength={4} placeholder="123" className="brutal-input w-24" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="brutal-btn brutal-btn-primary w-full text-lg py-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Complete Order - {formatPrice(preview?.total || cart.subtotal)}</>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="brutal-card p-6 sticky top-24">
              <h2 className="text-xl font-black mb-6">Order Summary</h2>

              <div className="space-y-4 max-h-60 overflow-y-auto mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-(--brutal-gray-100) border-2 border-(--brutal-black) relative overflow-hidden shrink-0">
                      {item.product.image ? (
                        <Image src={item.product.image} alt={item.product.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-(--brutal-gray-400)" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm line-clamp-1">{item.product.title}</p>
                      <p className="text-sm text-(--brutal-gray-600)">Qty: {item.quantity}</p>
                      <p className="font-bold">{formatPrice(item.lineTotal)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="border-t-2 border-(--brutal-gray-200) pt-4 mb-4">
                <label className="font-bold text-sm block mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Discount Code
                </label>
                {appliedDiscount ? (
                  <div className="flex items-center justify-between bg-(--brutal-green) bg-opacity-20 border-2 border-(--brutal-green) p-3">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-(--brutal-green)" />
                      <span className="font-bold">{appliedDiscount}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveDiscount}
                      className="text-(--brutal-gray-500) hover:text-(--brutal-red)"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="brutal-input flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      disabled={isApplyingDiscount || !discountCode.trim()}
                      className="brutal-btn brutal-btn-dark px-4"
                    >
                      {isApplyingDiscount ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                )}
                {discountError && (
                  <p className="text-(--brutal-red) text-sm mt-2">{discountError}</p>
                )}
              </div>

              {/* Order Totals */}
              <div className="border-t-2 border-(--brutal-gray-200) pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold">{formatPrice(preview?.subtotal || cart.subtotal)}</span>
                </div>

                {preview && preview.discount > 0 && (
                  <div className="flex justify-between text-(--brutal-green)">
                    <span>Discount</span>
                    <span className="font-bold">-{formatPrice(preview.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  {isLoadingPreview ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : preview ? (
                    <span className={preview.shipping === 0 ? 'text-(--brutal-green) font-bold' : ''}>
                      {preview.shipping === 0 ? 'FREE' : formatPrice(preview.shipping)}
                    </span>
                  ) : (
                    <span className="text-(--brutal-gray-500)">Calculated</span>
                  )}
                </div>

                {preview && preview.freeShippingThreshold && preview.shipping > 0 && (
                  <p className="text-xs text-(--brutal-gray-500)">
                    Free shipping on orders over {formatPrice(preview.freeShippingThreshold)}
                  </p>
                )}

                {preview && preview.tax > 0 && (
                  <div className="flex justify-between">
                    <span>Tax ({preview.taxRate}%)</span>
                    <span>{formatPrice(preview.tax)}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg pt-2 border-t-2 border-(--brutal-gray-200)">
                  <span className="font-black">Total</span>
                  {isLoadingPreview ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span className="font-black">{formatPrice(preview?.total || cart.subtotal)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
