'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Loader2,
    ChevronLeft,
    ChevronRight,
    FolderOpen,
} from 'lucide-react';
import api from '@/lib/api';
import { Card, CardContent, Button, Badge, Input } from '@/components/ui';

export default function AdminCollectionsPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'collections', { search, page, limit }],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.set('page', String(page));
            params.set('limit', String(limit));
            if (search) params.set('search', search);
            const res = await api.get(`/collections?${params}`);
            return res.data;
        },
    });

    const deleteCollection = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/collections/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'collections'] });
        },
    });

    const collections = data?.collections || data || [];
    const pagination = data?.pagination || { page: 1, totalPages: 1, total: collections.length };

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Are you sure you want to delete collection "${title}"?`)) {
            deleteCollection.mutate(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black">Collections</h1>
                    <p className="text-gray-600">
                        {pagination.total || collections.length} collections
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/collections/new">
                        <Plus className="w-4 h-4" />
                        Create Collection
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
                            placeholder="Search collections..."
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

            {/* Collections Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            ) : collections.length === 0 ? (
                <Card shadow="md">
                    <CardContent className="p-12 text-center">
                        <FolderOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="font-black">No collections found</h3>
                        <p className="text-gray-600 mt-1">
                            {search ? 'Try adjusting your search' : 'Create your first collection'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((collection: any) => (
                        <Card key={collection.id} shadow="md" hover="liftSm">
                            <div className="relative aspect-video bg-gray-100 border-b-4 border-black overflow-hidden">
                                {collection.image ? (
                                    <img
                                        src={collection.image}
                                        alt={collection.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <FolderOpen className="w-12 h-12 text-gray-300" />
                                    </div>
                                )}
                                {collection.featured && (
                                    <Badge variant="featured" className="absolute top-2 right-2">
                                        Featured
                                    </Badge>
                                )}
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-black text-lg">{collection.title}</h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {collection.description || 'No description'}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    {collection.products?.length || collection._count?.products || 0} products
                                </p>
                                <div className="flex gap-2 mt-4">
                                    <Button variant="outline" size="sm" asChild className="flex-1">
                                        <Link href={`/admin/collections/${collection.id}`}>
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(collection.id, collection.title)}
                                        disabled={deleteCollection.isPending}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
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
        </div>
    );
}
