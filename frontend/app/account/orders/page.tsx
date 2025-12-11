'use client';

import Link from 'next/link';
import { Package, ChevronRight, Search } from 'lucide-react';
import { useMyOrders } from '@/lib/hooks';
import { formatPrice, cn } from '@/lib/utils';
import { useState } from 'react';

const statusColors: Record<string, string> = {
    PENDING: 'brutal-badge-yellow',
    CONFIRMED: 'brutal-badge-blue',
    PROCESSING: 'brutal-badge-blue',
    SHIPPED: 'brutal-badge-blue',
    DELIVERED: 'brutal-badge-green',
    CANCELLED: 'brutal-badge-red',
    REFUNDED: 'brutal-badge-red',
};

export default function OrdersPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useMyOrders({ page, limit: 10 });

    const orders = data?.orders || [];
    const pagination = data?.pagination;

    return (
        <div>
            <div className="brutal-card">
                <div className="p-6 border-b-2 border-(--brutal-gray-200)">
                    <h2 className="text-2xl font-black">Order History</h2>
                    <p className="text-(--brutal-gray-600) mt-1">
                        View and track all your orders
                    </p>
                </div>

                {isLoading ? (
                    <div className="divide-y-2 divide-(--brutal-gray-200)">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="p-6 animate-pulse">
                                <div className="flex justify-between">
                                    <div className="space-y-2">
                                        <div className="h-5 w-32 bg-(--brutal-gray-200)" />
                                        <div className="h-4 w-48 bg-(--brutal-gray-200)" />
                                    </div>
                                    <div className="h-6 w-20 bg-(--brutal-gray-200)" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="p-12 text-center">
                        <Package className="w-16 h-16 mx-auto text-(--brutal-gray-300) mb-4" />
                        <h3 className="text-xl font-black">No orders yet</h3>
                        <p className="text-(--brutal-gray-600) mt-2">
                            When you place an order, it will appear here
                        </p>
                        <Link href="/products" className="brutal-btn brutal-btn-primary mt-6 inline-flex">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="divide-y-2 divide-(--brutal-gray-200)">
                            {orders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/account/orders/${order.id}`}
                                    className="flex items-center justify-between p-6 hover:bg-(--brutal-gray-50) transition-colors group"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <p className="font-black">#{order.orderNumber}</p>
                                            <span className={cn('brutal-badge text-xs', statusColors[order.status])}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-(--brutal-gray-600) mt-1">
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
                                        <ChevronRight className="w-5 h-5 text-(--brutal-gray-400) group-hover:text-(--brutal-black) transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="p-6 border-t-2 border-(--brutal-gray-200)">
                                <div className="flex items-center justify-center gap-2">
                                    {Array.from({ length: pagination.totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            className={cn(
                                                'w-10 h-10 border-2 border-(--brutal-black) font-bold',
                                                page === i + 1
                                                    ? 'bg-(--brutal-black) text-white'
                                                    : 'hover:bg-(--brutal-gray-100)'
                                            )}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
