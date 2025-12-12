'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react';
import api from '@/lib/api';

const productSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    shortDescription: z.string().optional().nullable(),
    status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
    featured: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();
    const productId = params?.id as string;
    const [error, setError] = useState<string | null>(null);

    const { data: product, isLoading } = useQuery({
        queryKey: ['admin', 'product', productId],
        queryFn: async () => {
            const res = await api.get(`/products/${productId}`);
            return res.data;
        },
        enabled: !!productId,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        values: product
            ? {
                title: product.title,
                description: product.description,
                shortDescription: product.shortDescription,
                status: product.status,
                featured: product.featured,
            }
            : undefined,
    });

    const updateProduct = useMutation({
        mutationFn: async (data: ProductFormData) => {
            const res = await api.put(`/products/${productId}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'product', productId] });
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to update product');
        },
    });

    const deleteProduct = useMutation({
        mutationFn: async () => {
            await api.delete(`/products/${productId}`);
        },
        onSuccess: () => {
            router.push('/admin/products');
        },
    });

    const onSubmit = (data: ProductFormData) => {
        setError(null);
        updateProduct.mutate(data);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this product?')) {
            deleteProduct.mutate();
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-(--brutal-gray-400)" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-black">Product not found</h2>
                <Link href="/admin/products" className="brutal-btn mt-4 inline-flex">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/products"
                    className="inline-flex items-center gap-2 text-(--brutal-gray-600) hover:text-(--brutal-black) mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Products
                </Link>
                <div className="flex items-start justify-between">
                    <h1 className="text-3xl font-black">Edit Product</h1>
                    <button
                        onClick={handleDelete}
                        disabled={deleteProduct.isPending}
                        className="brutal-btn text-(--brutal-red) hover:bg-(--brutal-red) hover:text-white"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <div className="bg-(--brutal-red) text-white p-4 border-2 border-(--brutal-black)">
                        {error}
                    </div>
                )}

                {updateProduct.isSuccess && (
                    <div className="bg-(--brutal-green) text-white p-4 border-2 border-(--brutal-black)">
                        Product updated successfully!
                    </div>
                )}

                {/* Basic Info */}
                <div className="brutal-card p-6 space-y-4">
                    <h2 className="font-black text-lg border-b-2 border-(--brutal-gray-200) pb-2 mb-4">
                        Basic Information
                    </h2>

                    <div>
                        <label className="block font-bold text-sm mb-2">Title *</label>
                        <input
                            {...register('title')}
                            className="brutal-input"
                            placeholder="Product title"
                        />
                        {errors.title && (
                            <p className="text-(--brutal-red) text-sm mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block font-bold text-sm mb-2">Description *</label>
                        <textarea
                            {...register('description')}
                            className="brutal-input min-h-[150px]"
                            placeholder="Product description"
                        />
                        {errors.description && (
                            <p className="text-(--brutal-red) text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block font-bold text-sm mb-2">Short Description</label>
                        <input
                            {...register('shortDescription')}
                            className="brutal-input"
                            placeholder="Brief description for cards"
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="brutal-card p-6 space-y-4">
                    <h2 className="font-black text-lg border-b-2 border-(--brutal-gray-200) pb-2 mb-4">
                        Status & Visibility
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold text-sm mb-2">Status</label>
                            <select {...register('status')} className="brutal-input">
                                <option value="DRAFT">Draft</option>
                                <option value="ACTIVE">Active</option>
                                <option value="ARCHIVED">Archived</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3 pt-6">
                            <input
                                {...register('featured')}
                                type="checkbox"
                                id="featured"
                                className="w-5 h-5 border-2 border-(--brutal-black)"
                            />
                            <label htmlFor="featured" className="font-bold">
                                Featured Product
                            </label>
                        </div>
                    </div>
                </div>

                {/* Variants Info (Read-only) */}
                {product.variants && product.variants.length > 0 && (
                    <div className="brutal-card p-6">
                        <h2 className="font-black text-lg border-b-2 border-(--brutal-gray-200) pb-2 mb-4">
                            Variants ({product.variants.length})
                        </h2>
                        <div className="space-y-2">
                            {product.variants.map((v: any) => (
                                <div key={v.id} className="flex items-center justify-between p-3 bg-(--brutal-gray-100)">
                                    <span className="font-bold">{v.title}</span>
                                    <div className="flex gap-4 text-sm">
                                        <span>${v.price}</span>
                                        <span>Stock: {v.inventoryQty}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={updateProduct.isPending}
                        className="brutal-btn brutal-btn-primary flex-1"
                    >
                        {updateProduct.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                    <Link href="/admin/products" className="brutal-btn">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
