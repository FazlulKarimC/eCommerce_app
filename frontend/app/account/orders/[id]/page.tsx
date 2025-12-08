'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, Truck, CheckCircle, MapPin, CreditCard, Clock } from 'lucide-react';
import { useOrder } from '@/lib/hooks';
import { formatPrice, cn } from '@/lib/utils';

const statusSteps = [
    { key: 'PENDING', label: 'Order Placed', icon: Clock },
    { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle },
    { key: 'PROCESSING', label: 'Processing', icon: Package },
    { key: 'SHIPPED', label: 'Shipped', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
];

const statusIndex: Record<string, number> = {
    PENDING: 0,
    CONFIRMED: 1,
    PROCESSING: 2,
    SHIPPED: 3,
    DELIVERED: 4,
    CANCELLED: -1,
    REFUNDED: -1,
};

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = params?.id as string;

    const { data: order, isLoading, error } = useOrder(orderId);

    if (isLoading) {
        return (
            <div className="brutal-card p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 w-48 bg-[var(--brutal-gray-200)]" />
                    <div className="h-24 bg-[var(--brutal-gray-200)]" />
                    <div className="h-64 bg-[var(--brutal-gray-200)]" />
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="brutal-card p-8 text-center">
                <Package className="w-16 h-16 mx-auto text-[var(--brutal-gray-300)] mb-4" />
                <h2 className="text-xl font-black">Order Not Found</h2>
                <p className="text-[var(--brutal-gray-600)] mt-2">
                    We couldn't find this order
                </p>
                <Link href="/account/orders" className="brutal-btn brutal-btn-dark mt-6 inline-flex">
                    View All Orders
                </Link>
            </div>
        );
    }

    const currentStatus = statusIndex[order.status] ?? -1;
    const isCancelled = order.status === 'CANCELLED' || order.status === 'REFUNDED';

    return (
        <div className="space-y-6">
            {/* Back Link */}
            <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm font-bold hover:text-[var(--brutal-red)]">
                <ArrowLeft className="w-4 h-4" />
                Back to Orders
            </Link>

            {/* Order Header */}
            <div className="brutal-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black">Order #{order.orderNumber}</h1>
                        <p className="text-[var(--brutal-gray-600)] mt-1">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                    <span className={cn(
                        'brutal-badge text-sm',
                        isCancelled ? 'brutal-badge-red' : 'brutal-badge-green'
                    )}>
                        {order.status}
                    </span>
                </div>
            </div>

            {/* Status Timeline */}
            {!isCancelled && (
                <div className="brutal-card p-6">
                    <h2 className="font-black mb-6">Order Progress</h2>
                    <div className="flex items-center justify-between relative">
                        {/* Progress Bar */}
                        <div className="absolute top-5 left-0 right-0 h-1 bg-[var(--brutal-gray-200)]">
                            <div
                                className="h-full bg-[var(--brutal-green)] transition-all"
                                style={{ width: `${(currentStatus / (statusSteps.length - 1)) * 100}%` }}
                            />
                        </div>

                        {statusSteps.map((step, index) => {
                            const Icon = step.icon;
                            const isComplete = index <= currentStatus;
                            const isCurrent = index === currentStatus;

                            return (
                                <div key={step.key} className="relative z-10 flex flex-col items-center">
                                    <div className={cn(
                                        'w-10 h-10 rounded-full border-2 flex items-center justify-center',
                                        isComplete
                                            ? 'bg-[var(--brutal-green)] border-[var(--brutal-green)] text-white'
                                            : 'bg-white border-[var(--brutal-gray-300)] text-[var(--brutal-gray-400)]'
                                    )}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className={cn(
                                        'text-xs mt-2 text-center',
                                        isCurrent ? 'font-bold' : 'text-[var(--brutal-gray-600)]'
                                    )}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Order Items */}
            <div className="brutal-card">
                <div className="p-6 border-b-2 border-[var(--brutal-gray-200)]">
                    <h2 className="font-black">Items ({order.items.length})</h2>
                </div>
                <div className="divide-y-2 divide-[var(--brutal-gray-200)]">
                    {order.items.map((item) => (
                        <div key={item.id} className="p-6 flex gap-4">
                            <div className="w-20 h-20 bg-[var(--brutal-gray-100)] border-2 border-[var(--brutal-black)] flex-shrink-0 relative overflow-hidden">
                                {item.imageUrl ? (
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.productTitle}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-8 h-8 text-[var(--brutal-gray-300)]" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold">{item.productTitle}</p>
                                {item.variantTitle && item.variantTitle !== 'Default' && (
                                    <p className="text-sm text-[var(--brutal-gray-600)]">{item.variantTitle}</p>
                                )}
                                <p className="text-sm text-[var(--brutal-gray-600)]">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Summary & Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <div className="brutal-card p-6">
                    <h3 className="font-black flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5" />
                        Shipping Address
                    </h3>
                    {order.shippingAddress ? (
                        <div className="text-[var(--brutal-gray-700)]">
                            <p className="font-bold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                            <p>{order.shippingAddress.line1}</p>
                            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                            <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    ) : (
                        <p className="text-[var(--brutal-gray-500)]">No shipping address</p>
                    )}
                </div>

                {/* Order Summary */}
                <div className="brutal-card p-6">
                    <h3 className="font-black flex items-center gap-2 mb-4">
                        <CreditCard className="w-5 h-5" />
                        Order Summary
                    </h3>
                    <div className="space-y-2">
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
                        <div className="flex justify-between font-black text-lg pt-2 border-t">
                            <span>Total</span>
                            <span>{formatPrice(order.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
