'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Package, Truck, CheckCircle, Clock, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { formatPrice, cn } from '@/lib/utils';

interface OrderResult {
    id: string;
    orderNumber: string;
    status: string;
    email: string;
    createdAt: string;
    total: number;
    subtotal: number;
    shippingCost: number;
    tax: number;
    items: Array<{
        id: string;
        productTitle: string;
        variantTitle: string;
        productImage: string | null;
        quantity: number;
        price: number;
    }>;
    shippingAddress?: {
        firstName: string;
        lastName: string;
        line1: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
}

const statusSteps = [
    { key: 'PENDING', label: 'Placed', icon: Clock },
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
};

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [order, setOrder] = useState<OrderResult | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!orderNumber.trim() || !email.trim()) {
            setError('Please enter both order number and email');
            return;
        }

        setIsSearching(true);
        setError(null);
        setOrder(null);

        try {
            const response = await api.get(`/orders/track?orderNumber=${orderNumber}&email=${email}`);
            setOrder(response.data);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError('Order not found. Please check your order number and email.');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setIsSearching(false);
        }
    };

    const currentStatus = order ? (statusIndex[order.status] ?? -1) : -1;
    const isCancelled = order && (order.status === 'CANCELLED' || order.status === 'REFUNDED');

    return (
        <div className="py-12">
            <div className="container max-w-3xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <Package className="w-16 h-16 mx-auto text-[var(--brutal-black)] mb-4" />
                    <h1 className="text-4xl md:text-5xl font-black">Track Your Order</h1>
                    <p className="text-[var(--brutal-gray-600)] mt-2">
                        Enter your order number and email to check the status
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="brutal-card p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="font-bold text-sm block mb-2">Order Number</label>
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                placeholder="e.g., ORD-1234567890"
                                className="brutal-input"
                            />
                        </div>
                        <div>
                            <label className="font-bold text-sm block mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="brutal-input"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-[var(--brutal-red)] text-white p-4 border-2 border-[var(--brutal-black)] mb-4">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSearching}
                        className="brutal-btn brutal-btn-primary w-full"
                    >
                        {isSearching ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Searching...
                            </>
                        ) : (
                            <>
                                <Search className="w-5 h-5" />
                                Track Order
                            </>
                        )}
                    </button>
                </form>

                {/* Order Result */}
                {order && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        {/* Order Header */}
                        <div className="brutal-card p-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-black">Order #{order.orderNumber}</h2>
                                    <p className="text-[var(--brutal-gray-600)] mt-1">
                                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
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
                                <h3 className="font-black mb-6">Order Progress</h3>
                                <div className="flex items-center justify-between relative">
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

                        {/* Items */}
                        <div className="brutal-card">
                            <div className="p-6 border-b-2 border-[var(--brutal-gray-200)]">
                                <h3 className="font-black">Items ({order.items.length})</h3>
                            </div>
                            <div className="divide-y-2 divide-[var(--brutal-gray-200)]">
                                {order.items.map((item) => (
                                    <div key={item.id} className="p-6 flex gap-4">
                                        <div className="w-16 h-16 bg-[var(--brutal-gray-100)] border-2 border-[var(--brutal-black)] flex-shrink-0 relative overflow-hidden">
                                            {item.productImage ? (
                                                <Image
                                                    src={item.productImage}
                                                    alt={item.productTitle}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-[var(--brutal-gray-300)]" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold">{item.productTitle}</p>
                                            <p className="text-sm text-[var(--brutal-gray-600)]">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="brutal-card p-6">
                            <h3 className="font-black mb-4">Order Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
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

                        {/* CTA */}
                        <div className="text-center">
                            <Link href="/products" className="brutal-btn brutal-btn-dark inline-flex">
                                Continue Shopping
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Help Text */}
                {!order && (
                    <div className="text-center text-[var(--brutal-gray-600)]">
                        <p>
                            Can't find your order confirmation email?{' '}
                            <Link href="/account" className="font-bold text-[var(--brutal-red)] hover:underline">
                                Sign in to your account
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
