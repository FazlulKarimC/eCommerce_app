'use client';

import { use } from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { useOrderByNumber } from '@/lib/hooks';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, Button, Skeleton } from '@/components/ui';

export default function ThankYouPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = use(params);
  const { data: order, isLoading, error } = useOrderByNumber(orderNumber);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-20">
        <div className="text-center">
          <Skeleton className="h-24 w-24 rounded-full mx-auto mb-6" />
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-8">
            We couldn't find order #{orderNumber}
          </p>
          <Button asChild size="lg">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-500 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-[6px_6px_0px_#000]">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-4">
          Thank You for Your Order!
        </h1>

        <p className="text-xl text-gray-700 mb-2">
          Your order has been confirmed
        </p>

        <p className="text-lg mb-8">
          Order Number: <span className="font-black">{order.orderNumber}</span>
        </p>

        {/* Order Summary */}
        <Card shadow="lg" className="text-left mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
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

            <div className="border-t-4 border-black pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
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
              <div className="flex justify-between text-xl pt-2 border-t-4 border-black">
                <span className="font-black">Total</span>
                <span className="font-black">{formatPrice(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Confirmation */}
        <p className="text-gray-600 mb-8">
          A confirmation email has been sent to <span className="font-bold">{order.email}</span>
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/products">
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/orders">View Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
