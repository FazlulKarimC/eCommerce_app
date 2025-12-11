'use client';

import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import { useMyOrders } from '@/lib/hooks';
import { formatPrice, cn } from '@/lib/utils';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Skeleton } from '@/components/ui';

const statusVariants: Record<string, 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'> = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
};

export default function OrdersPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useMyOrders({ page, limit: 10 });

    const orders = data?.orders || [];
    const pagination = data?.pagination;

    return (
        <div>
            <Card shadow="md">
                <CardHeader>
                    <CardTitle className="text-2xl">Order History</CardTitle>
                    <p className="text-gray-600 mt-1">
                        View and track all your orders
                    </p>
                </CardHeader>

                {isLoading ? (
                    <div className="divide-y-4 divide-black">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="p-6">
                                <div className="flex justify-between">
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                    <Skeleton className="h-6 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <CardContent className="p-12 text-center">
                        <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-black">No orders yet</h3>
                        <p className="text-gray-600 mt-2">
                            When you place an order, it will appear here
                        </p>
                        <Button asChild className="mt-6">
                            <Link href="/products">Start Shopping</Link>
                        </Button>
                    </CardContent>
                ) : (
                    <>
                        <div className="divide-y-4 divide-black">
                            {orders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/account/orders/${order.id}`}
                                    className="flex items-center justify-between p-6 hover:bg-yellow-50 transition-colors group"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <p className="font-black">#{order.orderNumber}</p>
                                            <Badge variant={statusVariants[order.status] || 'pending'} size="sm">
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                            {' · '}
                                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <p className="font-black text-lg">{formatPrice(order.total)}</p>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <CardContent className="border-t-4 border-black">
                                <div className="flex items-center justify-center gap-2">
                                    {Array.from({ length: pagination.totalPages }).map((_, i) => (
                                        <Button
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            variant={page === i + 1 ? 'secondary' : 'outline'}
                                            size="icon-sm"
                                        >
                                            {i + 1}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        )}
                    </>
                )}
            </Card>
        </div>
    );
}
