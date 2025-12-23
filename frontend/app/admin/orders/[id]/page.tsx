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
    Mail,
    Phone,
    Clock,
    CheckCircle,
} from 'lucide-react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';

const statusOptions = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
];

const statusBadgeVariant: Record<string, 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'> = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
};

export default function AdminOrderDetailPage() {
    const params = useParams();
    const orderId = params?.id as string;
    const queryClient = useQueryClient();
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'order', orderId] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
            setStatusMessage({ type: 'success', text: `Order status updated to ${data.status}` });
            setTimeout(() => setStatusMessage(null), 4000);
        },
        onError: (err: any) => {
            setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update status' });
            setTimeout(() => setStatusMessage(null), 4000);
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

    // Refund mutation
    const refundOrder = useMutation({
        mutationFn: async () => {
            const res = await api.post(`/orders/${orderId}/refund`, {});
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'order', orderId] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
            setStatusMessage({ type: 'success', text: 'Order refunded successfully' });
            setTimeout(() => setStatusMessage(null), 4000);
        },
        onError: (err: any) => {
            setStatusMessage({ type: 'error', text: err.response?.data?.error || 'Refund failed' });
            setTimeout(() => setStatusMessage(null), 4000);
        },
    });

    // Fulfillment state and mutation
    const [showFulfillmentForm, setShowFulfillmentForm] = useState(false);
    const [fulfillmentData, setFulfillmentData] = useState({
        carrier: '',
        trackingNumber: '',
        trackingUrl: '',
    });

    const createFulfillment = useMutation({
        mutationFn: async (data: typeof fulfillmentData) => {
            const res = await api.post(`/orders/${orderId}/fulfillment`, {
                ...data,
                shippedAt: new Date().toISOString(),
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'order', orderId] });
            setShowFulfillmentForm(false);
            setFulfillmentData({ carrier: '', trackingNumber: '', trackingUrl: '' });
            setStatusMessage({ type: 'success', text: 'Fulfillment created and shipping notification sent' });
            setTimeout(() => setStatusMessage(null), 4000);
        },
        onError: (err: any) => {
            setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create fulfillment' });
            setTimeout(() => setStatusMessage(null), 4000);
        },
    });

    const handleRefund = () => {
        if (confirm('Process refund for this order? This action cannot be undone.')) {
            refundOrder.mutate();
        }
    };

    const handleFulfillment = (e: React.FormEvent) => {
        e.preventDefault();
        createFulfillment.mutate(fulfillmentData);
    };


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-black">Order not found</h2>
                <Button variant="outline" asChild className="mt-4">
                    <Link href="/admin/orders">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Orders
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/admin/orders"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Orders
                </Link>
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black">Order #{order.orderNumber}</h1>
                        <p className="text-gray-600 flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            value={order.status}
                            onChange={handleStatusChange}
                            disabled={updateStatus.isPending}
                            className="h-12 px-4 bg-white border-4 border-black rounded-xl font-medium focus:outline-none shadow-[4px_4px_0px_#000]"
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

            {/* Status Message */}
            {statusMessage && (
                <div className={`p-4 border-4 border-black rounded-xl ${statusMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    {statusMessage.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <Card shadow="md">
                        <CardHeader>
                            <CardTitle>Items ({order.items?.length || 0})</CardTitle>
                        </CardHeader>
                        <div className="divide-y-4 divide-black">
                            {order.items?.map((item: any) => (
                                <div key={item.id} className="p-6 flex gap-4">
                                    <div className="w-16 h-16 bg-gray-100 border-2 border-black shrink-0 relative overflow-hidden rounded-lg">
                                        {item.imageUrl ? (
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.productTitle}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-6 h-6 text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold">{item.productTitle}</p>
                                        {item.variantTitle && (
                                            <p className="text-sm text-gray-600">
                                                {item.variantTitle}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-600">
                                            SKU: {item.sku || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{formatPrice(item.price)}</p>
                                        <p className="text-sm text-gray-600">
                                            × {item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Order Summary */}
                    <Card shadow="md">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
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
                                <div className="flex justify-between font-black text-lg pt-2 border-t-4 border-black">
                                    <span>Total</span>
                                    <span>{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Actions Card */}
                    <Card shadow="md">
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Fulfillment Button/Form */}
                            {order.fulfillmentStatus !== 'fulfilled' && order.status !== 'REFUNDED' && order.status !== 'CANCELLED' && (
                                <>
                                    {!showFulfillmentForm ? (
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => setShowFulfillmentForm(true)}
                                        >
                                            <Package className="w-4 h-4" />
                                            Create Fulfillment
                                        </Button>
                                    ) : (
                                        <form onSubmit={handleFulfillment} className="space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Carrier (e.g. FedEx)"
                                                value={fulfillmentData.carrier}
                                                onChange={(e) => setFulfillmentData({ ...fulfillmentData, carrier: e.target.value })}
                                                className="w-full h-10 px-3 bg-white border-2 border-black rounded-lg font-medium text-sm"
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Tracking Number"
                                                value={fulfillmentData.trackingNumber}
                                                onChange={(e) => setFulfillmentData({ ...fulfillmentData, trackingNumber: e.target.value })}
                                                className="w-full h-10 px-3 bg-white border-2 border-black rounded-lg font-medium text-sm"
                                                required
                                            />
                                            <input
                                                type="url"
                                                placeholder="Tracking URL (optional)"
                                                value={fulfillmentData.trackingUrl}
                                                onChange={(e) => setFulfillmentData({ ...fulfillmentData, trackingUrl: e.target.value })}
                                                className="w-full h-10 px-3 bg-white border-2 border-black rounded-lg font-medium text-sm"
                                            />
                                            <div className="flex gap-2">
                                                <Button type="submit" size="sm" disabled={createFulfillment.isPending} className="flex-1">
                                                    {createFulfillment.isPending ? 'Sending...' : 'Ship Order'}
                                                </Button>
                                                <Button type="button" variant="outline" size="sm" onClick={() => setShowFulfillmentForm(false)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </>
                            )}

                            {/* Refund Button */}
                            {order.financialStatus !== 'refunded' && order.status !== 'CANCELLED' && (
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={handleRefund}
                                    disabled={refundOrder.isPending}
                                >
                                    {refundOrder.isPending ? 'Processing...' : 'Process Refund'}
                                </Button>
                            )}

                            {order.financialStatus === 'refunded' && (
                                <Badge variant="cancelled" size="lg" className="w-full justify-center">
                                    REFUNDED
                                </Badge>
                            )}
                        </CardContent>
                    </Card>

                    {/* Status Card */}
                    <Card shadow="md">
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge variant={statusBadgeVariant[order.status] || 'pending'} size="lg">
                                {order.status}
                            </Badge>
                            {order.status === 'DELIVERED' && (
                                <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Order complete
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Customer Info */}
                    <Card shadow="md">
                        <CardHeader>
                            <CardTitle>Customer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-2">
                                    <Mail className="w-4 h-4 mt-0.5 text-gray-500" />
                                    <span>{order.email}</span>
                                </div>
                                {order.phone && (
                                    <div className="flex items-start gap-2">
                                        <Phone className="w-4 h-4 mt-0.5 text-gray-500" />
                                        <span>{order.phone}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                        <Card shadow="md">
                            <CardHeader>
                                <CardTitle>Shipping Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-2 text-sm">
                                    <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
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
                            </CardContent>
                        </Card>
                    )}

                    {/* Notes */}
                    {order.customerNotes && (
                        <Card shadow="md">
                            <CardHeader>
                                <CardTitle>Customer Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    {order.customerNotes}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
