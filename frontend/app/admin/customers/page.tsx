'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
    Search,
    Users,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Mail,
    ShoppingBag,
} from 'lucide-react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function AdminCustomersPage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'customers', { search, page, limit }],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.set('page', String(page));
            params.set('limit', String(limit));
            if (search) params.set('search', search);
            const res = await api.get(`/customers?${params}`);
            return res.data;
        },
    });

    const customers = data?.customers || [];
    const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black">Customers</h1>
                <p className="text-[var(--brutal-gray-600)]">
                    {pagination.total} customers total
                </p>
            </div>

            {/* Search */}
            <div className="brutal-card p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--brutal-gray-400)]" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="brutal-input pl-10"
                    />
                </div>
            </div>

            {/* Customers Table */}
            <div className="brutal-card overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--brutal-gray-400)]" />
                    </div>
                ) : customers.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="w-12 h-12 mx-auto text-[var(--brutal-gray-300)] mb-4" />
                        <h3 className="font-black">No customers found</h3>
                        <p className="text-[var(--brutal-gray-600)] mt-1">
                            {search ? 'Try adjusting your search' : 'Customers will appear here'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[var(--brutal-gray-100)] border-b-2 border-[var(--brutal-black)]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Customer
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Orders
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Total Spent
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Joined
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--brutal-gray-200)]">
                                {customers.map((customer: any) => (
                                    <tr key={customer.id} className="hover:bg-[var(--brutal-gray-50)]">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[var(--brutal-yellow)] text-[var(--brutal-black)] rounded-full flex items-center justify-center font-black">
                                                    {customer.name?.charAt(0) || '?'}
                                                </div>
                                                <span className="font-bold">
                                                    {customer.name || 'No name'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="w-4 h-4 text-[var(--brutal-gray-400)]" />
                                                {customer.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <ShoppingBag className="w-4 h-4 text-[var(--brutal-gray-400)]" />
                                                <span className="font-bold">
                                                    {customer._count?.orders || 0}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold">
                                            {formatPrice(customer.totalSpent || 0)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--brutal-gray-600)]">
                                            {new Date(customer.createdAt).toLocaleDateString()}
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
