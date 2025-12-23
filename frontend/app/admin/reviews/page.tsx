'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Search,
    Loader2,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Check,
    X,
    Trash2,
    Star,
    Filter,
} from 'lucide-react';
import api from '@/lib/api';
import { Card, CardContent, Button, Badge, Input } from '@/components/ui';

export default function AdminReviewsPage() {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
    const [page, setPage] = useState(1);
    const limit = 20;

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'reviews', { filter, page, limit }],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.set('page', String(page));
            params.set('limit', String(limit));
            if (filter === 'pending') params.set('approved', 'false');
            if (filter === 'approved') params.set('approved', 'true');
            const res = await api.get(`/reviews?${params}`);
            return res.data;
        },
    });

    const updateReview = useMutation({
        mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
            const res = await api.patch(`/reviews/${id}`, { approved });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
        },
    });

    const deleteReview = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/reviews/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
        },
    });

    const reviews = data?.reviews || [];
    const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

    const handleApprove = (id: string) => {
        updateReview.mutate({ id, approved: true });
    };

    const handleReject = (id: string) => {
        updateReview.mutate({ id, approved: false });
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this review?')) {
            deleteReview.mutate(id);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black">Review Moderation</h1>
                    <p className="text-gray-600">{pagination.total} reviews</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                <Button
                    variant={filter === 'all' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => { setFilter('all'); setPage(1); }}
                >
                    All
                </Button>
                <Button
                    variant={filter === 'pending' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => { setFilter('pending'); setPage(1); }}
                >
                    Pending
                </Button>
                <Button
                    variant={filter === 'approved' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => { setFilter('approved'); setPage(1); }}
                >
                    Approved
                </Button>
            </div>

            {/* Reviews List */}
            <Card shadow="md">
                {isLoading ? (
                    <CardContent className="p-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                    </CardContent>
                ) : reviews.length === 0 ? (
                    <CardContent className="p-12 text-center">
                        <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="font-black">No reviews found</h3>
                        <p className="text-gray-600 mt-1">
                            {filter === 'pending' ? 'No pending reviews' : 'No reviews yet'}
                        </p>
                    </CardContent>
                ) : (
                    <div className="divide-y-4 divide-black">
                        {reviews.map((review: any) => (
                            <div key={review.id} className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {renderStars(review.rating)}
                                            <Badge variant={review.approved ? 'success' : 'warning'}>
                                                {review.approved ? 'Approved' : 'Pending'}
                                            </Badge>
                                        </div>
                                        {review.title && (
                                            <h3 className="font-bold text-lg">{review.title}</h3>
                                        )}
                                        <p className="text-gray-600 mt-1">{review.content}</p>
                                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                            <span>
                                                By: <strong>{review.customer?.user?.name || 'Anonymous'}</strong>
                                            </span>
                                            <span>•</span>
                                            <Link
                                                href={`/products/${review.product?.slug}`}
                                                className="hover:text-red-500"
                                            >
                                                {review.product?.title}
                                            </Link>
                                            <span>•</span>
                                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {!review.approved && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleApprove(review.id)}
                                                disabled={updateReview.isPending}
                                                className="text-green-600 hover:bg-green-500 hover:text-white"
                                            >
                                                <Check className="w-4 h-4" />
                                            </Button>
                                        )}
                                        {review.approved && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleReject(review.id)}
                                                disabled={updateReview.isPending}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(review.id)}
                                            disabled={deleteReview.isPending}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
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
