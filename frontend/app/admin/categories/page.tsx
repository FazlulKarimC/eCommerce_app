'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Tag,
} from 'lucide-react';
import api from '@/lib/api';
import { Card, CardContent, Button, Input } from '@/components/ui';

export default function AdminCategoriesPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const limit = 10;

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'categories', { search, page, limit }],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.set('page', String(page));
            params.set('limit', String(limit));
            if (search) params.set('search', search);
            const res = await api.get(`/categories?${params}`);
            return res.data;
        },
    });

    const deleteCategory = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/categories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
            setErrorMessage(null);
        },
        onError: (err: any) => {
            const message = err.response?.data?.message || err.message || 'Failed to delete category';
            setErrorMessage(message);
            console.error('[Delete Category]:', err);
            setTimeout(() => setErrorMessage(null), 5000);
        },
    });

    const categories = data?.categories || data || [];
    const pagination = data?.pagination || { page: 1, totalPages: 1, total: categories.length };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete category "${name}"?`)) {
            deleteCategory.mutate(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Error Message */}
            {errorMessage && (
                <div className="bg-red-500 text-white p-4 border-4 border-black rounded-xl">
                    {errorMessage}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black">Categories</h1>
                    <p className="text-gray-600">
                        {pagination.total || categories.length} categories
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/categories/new">
                        <Plus className="w-4 h-4" />
                        Create Category
                    </Link>
                </Button>
            </div>

            {/* Search */}
            <Card shadow="md">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search categories..."
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

            {/* Categories Table */}
            <Card shadow="md">
                {isLoading ? (
                    <CardContent className="p-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                    </CardContent>
                ) : categories.length === 0 ? (
                    <CardContent className="p-12 text-center">
                        <Tag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="font-black">No categories found</h3>
                        <p className="text-gray-600 mt-1">
                            {search ? 'Try adjusting your search' : 'Create your first category'}
                        </p>
                    </CardContent>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b-4 border-black">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Slug
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase">
                                        Products
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-black uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-4 divide-black">
                                {categories.map((category: any) => (
                                    <tr key={category.id} className="hover:bg-yellow-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {category.image && (
                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="w-10 h-10 rounded-lg border-2 border-black object-cover"
                                                    />
                                                )}
                                                <span className="font-bold">{category.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {category.slug}
                                        </td>
                                        <td className="px-6 py-4 font-bold">
                                            {category.products?.length || category._count?.products || 0}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/categories/${category.id}`}>
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <button
                                                    onClick={() => handleDelete(category.id, category.name)}
                                                    disabled={deleteCategory.isPending}
                                                    className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
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
