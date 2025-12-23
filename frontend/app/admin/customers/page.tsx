'use client';

import { useState } from 'react';
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
import { Card, CardContent, Button, Input } from '@/components/ui';

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
                <p className="text-gray-600">
                    {pagination.total} customers total
                </p>
            </div>

            {/* Search */}
            <Card shadow="md">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="pl-12"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Customers Table */}
            <Card shadow="md">
                {isLoading ? (
                    <CardContent className="p-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                    </CardContent>
                ) : customers.length === 0 ? (
                    <CardContent className="p-12 text-center">
                        <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="font-black">No customers found</h3>
                        <p className="text-gray-600 mt-1">
                            {search ? 'Try adjusting your search' : 'Customers will appear here'}
                        </p>
                    </CardContent>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b-4 border-black">
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
                            <tbody className="divide-y-4 divide-black">
                                {customers.map((customer: any) => (
                                    <tr key={customer.id} className="hover:bg-yellow-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-yellow-400 text-black rounded-full flex items-center justify-center font-black border-2 border-black">
                                                    {customer.name?.charAt(0) || '?'}
                                                </div>
                                                <span className="font-bold">
                                                    {customer.name || 'No name'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                {customer.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <ShoppingBag className="w-4 h-4 text-gray-400" />
                                                <span className="font-bold">
                                                    {customer._count?.orders || 0}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold">
                                            {formatPrice(customer.totalSpent || 0)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
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
                    <div className="p-4 border-t-4 border-black flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Page {pagination.page} of {pagination.totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page - 1)}
                                disabled={page <= 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page + 1)}
                                disabled={page >= pagination.totalPages}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
