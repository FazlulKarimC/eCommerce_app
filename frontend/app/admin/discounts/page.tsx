'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Plus,
    Search,
    Tag,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import api from '@/lib/api';
import { formatPrice, cn } from '@/lib/utils';

export default function AdminDiscountsPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'discounts', { search, page, limit }],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.set('page', String(page));
            params.set('limit', String(limit));
            if (search) params.set('search', search);
            const res = await api.get(`/discounts?${params}`);
            return res.data;
        },
    });

    const deleteDiscount = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/discounts/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'discounts'] });
        },
    });

    const discounts = data?.discounts || [];
    const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

    const handleDelete = async (id: string, code: string) => {
        if (confirm(`Are you sure you want to delete discount "${code}"?`)) {
            deleteDiscount.mutate(id);
        }
    };

    const formatDiscountValue = (discount: any) => {
        if (discount.type === 'PERCENTAGE') {
            return `${discount.value}%`;
        }
        return formatPrice(discount.value);
    };

    const isExpired = (endDate: string | null) => {
        if (!endDate) return false;
        return new Date(endDate) < new Date();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black">Discounts</h1>
                    <p className="text-[var(--brutal-gray-600)]">
                        {pagination.total} discount codes total
                    </p>
                </div>
                <Link href="/admin/discounts/new" className="brutal-btn brutal-btn-primary">
                    <Plus className="w-4 h-4" />
                    Create Discount
                </Link>
            </div>

            {/* Search */}
            <div className="brutal-card p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--brutal-gray-400)]" />
                    <input
                        type="text"
                        placeholder="Search by code..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="brutal-input pl-10"
                    />
                </div>
            </div>

            {/* Discounts Table */}
            <div className="brutal-card overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--brutal-gray-400)]" />
                    </div>
                ) : discounts.length === 0 ? (
                    <div className="p-12 text-center">
                        <Tag className="w-12 h-12 mx-auto text-[var(--brutal-gray-300)] mb-4" />
                        <h3 className="font-black">No discounts found</h3>
                        <p className="text-[var(--brutal-gray-600)] mt-1">
                            {search ? 'Try adjusting your search' : 'Create your first discount code'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[var(--brutal-gray-100)] border-b-2 border-[var(--brutal-black)]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Code
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Type
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Value
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Uses
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-black uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--brutal-gray-200)]">
                                {discounts.map((discount: any) => {
                                    const expired = isExpired(discount.endDate);
                                    const active = discount.isActive && !expired;

                                    return (
                                        <tr key={discount.id} className="hover:bg-[var(--brutal-gray-50)]">
                                            <td className="px-6 py-4">
                                                <span className="font-mono font-bold bg-[var(--brutal-gray-100)] px-2 py-1 border">
                                                    {discount.code}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {discount.type === 'PERCENTAGE' ? 'Percentage' : 'Fixed Amount'}
                                            </td>
                                            <td className="px-6 py-4 font-bold">
                                                {formatDiscountValue(discount)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {discount.usedCount || 0}
                                                {discount.maxUses && ` / ${discount.maxUses}`}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {active ? (
                                                        <>
                                                            <CheckCircle className="w-4 h-4 text-[var(--brutal-green)]" />
                                                            <span className="text-sm font-bold text-[var(--brutal-green)]">
                                                                Active
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-4 h-4 text-[var(--brutal-gray-400)]" />
                                                            <span className="text-sm font-bold text-[var(--brutal-gray-400)]">
                                                                {expired ? 'Expired' : 'Inactive'}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/discounts/${discount.id}`}
                                                        className="p-2 hover:bg-[var(--brutal-gray-100)] rounded"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(discount.id, discount.code)}
                                                        disabled={deleteDiscount.isPending}
                                                        className="p-2 hover:bg-[var(--brutal-red)] hover:text-white rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
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
