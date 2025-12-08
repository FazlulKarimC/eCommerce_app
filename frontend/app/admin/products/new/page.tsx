'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import api from '@/lib/api';

const productSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    shortDescription: z.string().optional(),
    status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
    featured: z.boolean(),
    price: z.number().min(0, 'Price must be positive'),
    compareAtPrice: z.number().min(0).optional().nullable(),
    sku: z.string().optional(),
    inventoryQty: z.number().int().min(0),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function NewProductPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            status: 'DRAFT',
            featured: false,
            price: 0,
            inventoryQty: 0,
        },
    });

    const createProduct = useMutation({
        mutationFn: async (data: ProductFormData) => {
            const payload = {
                title: data.title,
                description: data.description,
                shortDescription: data.shortDescription || null,
                status: data.status,
                featured: data.featured,
                variants: [
                    {
                        title: 'Default',
                        price: data.price,
                        compareAtPrice: data.compareAtPrice,
                        sku: data.sku,
                        inventoryQty: data.inventoryQty,
                    },
                ],
            };
            const res = await api.post('/products', payload);
            return res.data;
        },
        onSuccess: (data) => {
            router.push(`/admin/products/${data.id}`);
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to create product');
        },
    });

    const onSubmit = (data: ProductFormData) => {
        setError(null);
        createProduct.mutate(data);
    };

    return (
        <div className="max-w-3xl">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/products"
                    className="inline-flex items-center gap-2 text-[var(--brutal-gray-600)] hover:text-[var(--brutal-black)] mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Products
                </Link>
                <h1 className="text-3xl font-black">New Product</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <div className="bg-[var(--brutal-red)] text-white p-4 border-2 border-[var(--brutal-black)]">
                        {error}
                    </div>
                )}

                {/* Basic Info */}
                <div className="brutal-card p-6 space-y-4">
                    <h2 className="font-black text-lg border-b-2 border-[var(--brutal-gray-200)] pb-2 mb-4">
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
                            <p className="text-[var(--brutal-red)] text-sm mt-1">{errors.title.message}</p>
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
                            <p className="text-[var(--brutal-red)] text-sm mt-1">{errors.description.message}</p>
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

                {/* Pricing */}
                <div className="brutal-card p-6 space-y-4">
                    <h2 className="font-black text-lg border-b-2 border-[var(--brutal-gray-200)] pb-2 mb-4">
                        Pricing & Inventory
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold text-sm mb-2">Price *</label>
                            <input
                                {...register('price', { valueAsNumber: true })}
                                type="number"
                                step="0.01"
                                className="brutal-input"
                                placeholder="0.00"
                            />
                            {errors.price && (
                                <p className="text-[var(--brutal-red)] text-sm mt-1">{errors.price.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block font-bold text-sm mb-2">Compare at Price</label>
                            <input
                                {...register('compareAtPrice', { valueAsNumber: true })}
                                type="number"
                                step="0.01"
                                className="brutal-input"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-sm mb-2">SKU</label>
                            <input
                                {...register('sku')}
                                className="brutal-input"
                                placeholder="SKU-001"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-sm mb-2">Inventory Quantity *</label>
                            <input
                                {...register('inventoryQty', { valueAsNumber: true })}
                                type="number"
                                className="brutal-input"
                                placeholder="0"
                            />
                            {errors.inventoryQty && (
                                <p className="text-[var(--brutal-red)] text-sm mt-1">{errors.inventoryQty.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="brutal-card p-6 space-y-4">
                    <h2 className="font-black text-lg border-b-2 border-[var(--brutal-gray-200)] pb-2 mb-4">
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
                                className="w-5 h-5 border-2 border-[var(--brutal-black)]"
                            />
                            <label htmlFor="featured" className="font-bold">
                                Featured Product
                            </label>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={createProduct.isPending}
                        className="brutal-btn brutal-btn-primary flex-1"
                    >
                        {createProduct.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Create Product
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
