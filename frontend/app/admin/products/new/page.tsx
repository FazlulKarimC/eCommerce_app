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
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea } from '@/components/ui';

const productSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    shortDescription: z.string().optional(),
    status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
    featured: z.boolean(),
    price: z.number().min(0.01, 'Price must be positive'),
    compareAtPrice: z.number().min(0).nullable(),
    sku: z.string().optional(),
    inventoryQty: z.number().int().min(0),
}).refine(
    (data) => {
        if (data.compareAtPrice != null) {
            return data.compareAtPrice > data.price;
        }
        return true;
    },
    {
        message: 'Compare at price must be greater than price',
        path: ['compareAtPrice'],
    }
);

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
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Products
                </Link>
                <h1 className="text-3xl font-black">New Product</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <div className="bg-red-500 text-white p-4 border-4 border-black rounded-xl">
                        {error}
                    </div>
                )}

                {/* Basic Info */}
                <Card shadow="md">
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block font-bold text-sm mb-2">Title *</label>
                            <Input
                                {...register('title')}
                                placeholder="Product title"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block font-bold text-sm mb-2">Description *</label>
                            <Textarea
                                {...register('description')}
                                className="min-h-[150px]"
                                placeholder="Product description"
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block font-bold text-sm mb-2">Short Description</label>
                            <Input
                                {...register('shortDescription')}
                                placeholder="Brief description for cards"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing */}
                <Card shadow="md">
                    <CardHeader>
                        <CardTitle>Pricing & Inventory</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-sm mb-2">Price *</label>
                                <Input
                                    {...register('price', {
                                        setValueAs: (v) => {
                                            if (v === '' || v === null) return null;
                                            const n = parseFloat(v);
                                            return Number.isNaN(n) ? null : n;
                                        },
                                    })}
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block font-bold text-sm mb-2">Compare at Price</label>
                                <Input
                                    {...register('compareAtPrice', {
                                        setValueAs: (v) => {
                                            if (v === '' || v === null) return null;
                                            const n = parseFloat(v);
                                            return Number.isNaN(n) ? null : n;
                                        },
                                    })}
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-sm mb-2">SKU</label>
                                <Input
                                    {...register('sku')}
                                    placeholder="SKU-001"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-sm mb-2">Inventory Quantity *</label>
                                <Input
                                    {...register('inventoryQty', {
                                        setValueAs: (v) => {
                                            if (v === '' || v === null) return null;
                                            const n = parseInt(v, 10);
                                            return Number.isNaN(n) ? null : n;
                                        },
                                    })}
                                    type="number"
                                    placeholder="0"
                                />
                                {errors.inventoryQty && (
                                    <p className="text-red-500 text-sm mt-1">{errors.inventoryQty.message}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status */}
                <Card shadow="md">
                    <CardHeader>
                        <CardTitle>Status & Visibility</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-sm mb-2">Status</label>
                                <select
                                    {...register('status')}
                                    className="w-full h-12 px-4 bg-white border-4 border-black rounded-xl font-medium focus:outline-none shadow-[4px_4px_0px_#000]"
                                >
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
                                    className="w-6 h-6 border-4 border-black rounded accent-yellow-400"
                                />
                                <label htmlFor="featured" className="font-bold">
                                    Featured Product
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={createProduct.isPending}
                        className="flex-1"
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
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/admin/products">Cancel</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}
