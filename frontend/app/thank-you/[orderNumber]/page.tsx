'use client';

import { use } from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { useOrderByNumber } from '@/lib/hooks';
import { formatPrice } from '@/lib/utils';

export default function ThankYouPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = use(params);
  const { data: order, isLoading, error } = useOrderByNumber(orderNumber);

  if (isLoading) {
    return (
      <div className="container py-20 text-center">
        <div className="animate-pulse">
          <div className="h-20 w-20 bg-[var(--brutal-gray-200)] rounded-full mx-auto mb-6" />
          <div className="h-8 w-64 bg-[var(--brutal-gray-200)] mx-auto mb-4" />
          <div className="h-6 w-48 bg-[var(--brutal-gray-200)] mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-black">Order Not Found</h1>
        <p className="text-[var(--brutal-gray-600)] mt-2">
          We couldn't find order #{orderNumber}
        </p>
        <Link href="/" className="brutal-btn brutal-btn-dark mt-8 inline-flex">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container max-w-2xl text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-[var(--brutal-green)] border-4 border-[var(--brutal-black)] rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-4">
          Thank You for Your Order!
        </h1>

        <p className="text-xl text-[var(--brutal-gray-700)] mb-2">
          Your order has been confirmed
        </p>

        <p className="text-lg mb-8">
          Order Number: <span className="font-black">{order.orderNumber}</span>
        </p>

        {/* Order Summary */}
        <div className="brutal-card p-6 text-left mb-8">
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Summary
          </h2>

          <div className="space-y-3 mb-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.productTitle} × {item.quantity}
                </span>
                <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-[var(--brutal-gray-200)] pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[var(--brutal-green)]">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between text-xl pt-2 border-t">
              <span className="font-black">Total</span>
              <span className="font-black">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Email Confirmation */}
        <p className="text-[var(--brutal-gray-600)] mb-8">
          A confirmation email has been sent to <span className="font-bold">{order.email}</span>
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="brutal-btn brutal-btn-primary">
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/orders" className="brutal-btn">
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
