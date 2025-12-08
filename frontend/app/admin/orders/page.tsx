'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
    Search,
    ShoppingCart,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Eye,
    Clock,
} from 'lucide-react';
import api from '@/lib/api';
import { formatPrice, cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-300',
    PROCESSING: 'bg-blue-100 text-blue-800 border-blue-300',
    SHIPPED: 'bg-purple-100 text-purple-800 border-purple-300',
    DELIVERED: 'bg-green-100 text-green-800 border-green-300',
    CANCELLED: 'bg-red-100 text-red-800 border-red-300',
    REFUNDED: 'bg-gray-100 text-gray-800 border-gray-300',
};

export default function AdminOrdersPage() {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string>('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'orders', { search, status, page, limit }],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.set('page', String(page));
            params.set('limit', String(limit));
            if (search) params.set('search', search);
            if (status) params.set('status', status);
            const res = await api.get(`/orders/admin?${params}`);
            return res.data;
        },
    });

    const orders = data?.orders || [];
    const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black">Orders</h1>
                <p className="text-[var(--brutal-gray-600)]">
                    {pagination.total} orders total
                </p>
            </div>

            {/* Filters */}
            <div className="brutal-card p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--brutal-gray-400)]" />
                        <input
                            type="text"
                            placeholder="Search by order # or email..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="brutal-input pl-10"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                        className="brutal-input w-full sm:w-44"
                    >
                        <option value="">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="brutal-card overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--brutal-gray-400)]" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="p-12 text-center">
                        <ShoppingCart className="w-12 h-12 mx-auto text-[var(--brutal-gray-300)] mb-4" />
                        <h3 className="font-black">No orders found</h3>
                        <p className="text-[var(--brutal-gray-600)] mt-1">
                            {search || status ? 'Try adjusting your filters' : 'Orders will appear here'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[var(--brutal-gray-100)] border-b-2 border-[var(--brutal-black)]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Order
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Customer
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Items
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Total
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-black uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--brutal-gray-200)]">
                                {orders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-[var(--brutal-gray-50)]">
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="font-bold hover:text-[var(--brutal-red)]"
                                            >
                                                #{order.orderNumber}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div>{order.email}</div>
                                            {order.phone && (
                                                <div className="text-[var(--brutal-gray-500)]">{order.phone}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.items?.length || 0} items
                                        </td>
                                        <td className="px-6 py-4 font-bold">
                                            {formatPrice(order.total)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                'px-2 py-1 text-xs font-bold rounded border',
                                                statusColors[order.status] || 'bg-gray-100'
                                            )}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--brutal-gray-600)]">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="p-2 hover:bg-[var(--brutal-gray-100)] rounded"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="p-4 border-t-2 border-[var(--brutal-gray-200)] flex items-center justify-between">
                        <p className="text-sm text-[var(--brutal-gray-600)]">
                            Page {pagination.page} of {pagination.totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page <= 1}
                                className="brutal-btn text-sm disabled:opacity-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page >= pagination.totalPages}
                                className="brutal-btn text-sm disabled:opacity-50"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
