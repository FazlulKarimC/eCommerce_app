'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    ArrowLeft,
    Loader2,
    Package,
    MapPin,
    User,
    Mail,
    Phone,
    Clock,
    CheckCircle,
} from 'lucide-react';
import api from '@/lib/api';
import { formatPrice, cn } from '@/lib/utils';

const statusOptions = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
];

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
};

export default function AdminOrderDetailPage() {
    const params = useParams();
    const orderId = params?.id as string;
    const queryClient = useQueryClient();
    const [newStatus, setNewStatus] = useState<string | null>(null);

    const { data: order, isLoading } = useQuery({
        queryKey: ['admin', 'order', orderId],
        queryFn: async () => {
            const res = await api.get(`/orders/${orderId}`);
            return res.data;
        },
        enabled: !!orderId,
    });

    const updateStatus = useMutation({
        mutationFn: async (status: string) => {
            const res = await api.patch(`/orders/${orderId}/status`, { status });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'order', orderId] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
            setNewStatus(null);
        },
    });

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value;
        if (status && status !== order?.status) {
            if (confirm(`Update order status to ${status}?`)) {
                updateStatus.mutate(status);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--brutal-gray-400)]" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-black">Order not found</h2>
                <Link href="/admin/orders" className="brutal-btn mt-4 inline-flex">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/admin/orders"
                    className="inline-flex items-center gap-2 text-[var(--brutal-gray-600)] hover:text-[var(--brutal-black)] mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Orders
                </Link>
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black">Order #{order.orderNumber}</h1>
                        <p className="text-[var(--brutal-gray-600)] flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            value={order.status}
                            onChange={handleStatusChange}
                            disabled={updateStatus.isPending}
                            className="brutal-input w-auto"
                        >
                            {statusOptions.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        {updateStatus.isPending && (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="brutal-card">
                        <div className="p-6 border-b-2 border-[var(--brutal-gray-200)]">
                            <h2 className="font-black text-lg">Items ({order.items?.length || 0})</h2>
                        </div>
                        <div className="divide-y divide-[var(--brutal-gray-200)]">
                            {order.items?.map((item: any) => (
                                <div key={item.id} className="p-6 flex gap-4">
                                    <div className="w-16 h-16 bg-[var(--brutal-gray-100)] border-2 border-[var(--brutal-black)] flex-shrink-0 relative overflow-hidden">
                                        {item.imageUrl ? (
                                            <Image
                                                src={item.imageUrl}
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
                                        {item.variantTitle && (
                                            <p className="text-sm text-[var(--brutal-gray-600)]">
                                                {item.variantTitle}
                                            </p>
                                        )}
                                        <p className="text-sm text-[var(--brutal-gray-600)]">
                                            SKU: {item.sku || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{formatPrice(item.price)}</p>
                                        <p className="text-sm text-[var(--brutal-gray-600)]">
                                            × {item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="brutal-card p-6">
                        <h2 className="font-black text-lg mb-4">Order Summary</h2>
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

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="brutal-card p-6">
                        <h3 className="font-black mb-4">Status</h3>
                        <span className={cn(
                            'px-3 py-2 text-sm font-bold rounded inline-block',
                            statusColors[order.status]
                        )}>
                            {order.status}
                        </span>
                        {order.status === 'DELIVERED' && (
                            <p className="text-sm text-[var(--brutal-gray-600)] mt-2 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-[var(--brutal-green)]" />
                                Order complete
                            </p>
                        )}
                    </div>

                    {/* Customer Info */}
                    <div className="brutal-card p-6">
                        <h3 className="font-black mb-4">Customer</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <Mail className="w-4 h-4 mt-0.5 text-[var(--brutal-gray-500)]" />
                                <span>{order.email}</span>
                            </div>
                            {order.phone && (
                                <div className="flex items-start gap-2">
                                    <Phone className="w-4 h-4 mt-0.5 text-[var(--brutal-gray-500)]" />
                                    <span>{order.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                        <div className="brutal-card p-6">
                            <h3 className="font-black mb-4">Shipping Address</h3>
                            <div className="flex items-start gap-2 text-sm">
                                <MapPin className="w-4 h-4 mt-0.5 text-[var(--brutal-gray-500)]" />
                                <div>
                                    <p className="font-bold">
                                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                    </p>
                                    <p>{order.shippingAddress.line1}</p>
                                    {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                                    <p>
                                        {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                        {order.shippingAddress.postalCode}
                                    </p>
                                    <p>{order.shippingAddress.country}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {order.customerNotes && (
                        <div className="brutal-card p-6">
                            <h3 className="font-black mb-4">Customer Notes</h3>
                            <p className="text-sm text-[var(--brutal-gray-600)]">
                                {order.customerNotes}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
