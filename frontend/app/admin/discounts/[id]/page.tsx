'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Save, Trash2, Power, Clock, ShoppingCart } from 'lucide-react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input } from '@/components/ui';

const discountSchema = z.object({
    code: z.string().min(1, 'Code is required').max(50),
    type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
    value: z.number().min(0, 'Value must be positive'),
    minOrderAmount: z.number().min(0).optional().nullable(),
    maxUses: z.number().int().min(1).optional().nullable(),
    startsAt: z.string().optional().nullable(),
    endsAt: z.string().optional().nullable(),
    active: z.boolean(),
});

type DiscountFormData = z.infer<typeof discountSchema>;

export default function EditDiscountPage() {
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();
    const discountId = params?.id as string;
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { data: discount, isLoading } = useQuery({
        queryKey: ['admin', 'discount', discountId],
        queryFn: async () => {
            const res = await api.get(`/discounts/${discountId}`);
            return res.data;
        },
        enabled: !!discountId,
    });

    // Format date for datetime-local input using local timezone
    const formatDateForInput = (dateString: string | null | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        return `${y}-${m}-${d}T${h}:${min}`;
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<DiscountFormData>({
        resolver: zodResolver(discountSchema),
        values: discount
            ? {
                code: discount.code,
                type: discount.type,
                value: discount.value,
                minOrderAmount: discount.minOrderAmount,
                maxUses: discount.maxUses,
                startsAt: formatDateForInput(discount.startsAt),
                endsAt: formatDateForInput(discount.endsAt),
                active: discount.active,
            }
            : undefined,
    });

    const discountType = watch('type');

    const updateDiscount = useMutation({
        mutationFn: async (data: DiscountFormData) => {
            const res = await api.patch(`/discounts/${discountId}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'discounts'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'discount', discountId] });
            setSuccess('Discount updated successfully!');
            setError(null);
            setTimeout(() => setSuccess(null), 3000);
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to update discount');
            setSuccess(null);
        },
    });

    const toggleActive = useMutation({
        mutationFn: async () => {
            const res = await api.post(`/discounts/${discountId}/toggle`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'discounts'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'discount', discountId] });
            setSuccess(`Discount ${discount?.active ? 'deactivated' : 'activated'} successfully!`);
            setTimeout(() => setSuccess(null), 3000);
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to toggle discount status');
        },
    });

    const deleteDiscount = useMutation({
        mutationFn: async () => {
            await api.delete(`/discounts/${discountId}`);
        },
        onSuccess: () => {
            router.push('/admin/discounts');
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to delete discount');
        },
    });

    const onSubmit = (data: DiscountFormData) => {
        setError(null);
        setSuccess(null);
        updateDiscount.mutate(data);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this discount?')) {
            deleteDiscount.mutate();
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!discount) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-black">Discount not found</h2>
                <Button variant="outline" asChild className="mt-4">
                    <Link href="/admin/discounts">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Discounts
                    </Link>
                </Button>
            </div>
        );
    }

    const isActive = discount.active &&
        new Date() >= new Date(discount.startsAt || 0) &&
        (!discount.endsAt || new Date() <= new Date(discount.endsAt));

    return (
        <div className="max-w-3xl">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/discounts"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Discounts
                </Link>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-black">Edit Discount</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="font-mono text-lg bg-gray-100 px-3 py-1 rounded border-2 border-black">
                                {discount.code}
                            </span>
                            <Badge variant={isActive ? 'success' : 'error'}>
                                {isActive ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => toggleActive.mutate()}
                            disabled={toggleActive.isPending}
                        >
                            <Power className="w-4 h-4" />
                            {discount.active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteDiscount.isPending}
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Card shadow="sm">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-blue-500 text-white rounded-lg">
                            <ShoppingCart className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-black">{discount._count?.orders || 0}</p>
                            <p className="text-sm text-gray-600">Times Used</p>
                        </div>
                    </CardContent>
                </Card>
                <Card shadow="sm">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-green-500 text-white rounded-lg">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-black">
                                {discount.maxUses ? `${discount.maxUses - (discount._count?.orders || 0)}` : '∞'}
                            </p>
                            <p className="text-sm text-gray-600">Uses Remaining</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <div className="bg-red-500 text-white p-4 border-4 border-black rounded-xl">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-500 text-white p-4 border-4 border-black rounded-xl">
                        {success}
                    </div>
                )}

                {/* Basic Info */}
                <Card shadow="md">
                    <CardHeader>
                        <CardTitle>Discount Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block font-bold text-sm mb-2">Discount Code *</label>
                            <Input
                                {...register('code')}
                                className="font-mono uppercase"
                                placeholder="SAVE20"
                            />
                            {errors.code && (
                                <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-sm mb-2">Discount Type *</label>
                                <select
                                    {...register('type')}
                                    className="w-full h-12 px-4 bg-white border-4 border-black rounded-xl font-medium focus:outline-none shadow-[4px_4px_0px_#000]"
                                >
                                    <option value="PERCENTAGE">Percentage</option>
                                    <option value="FIXED_AMOUNT">Fixed Amount</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-sm mb-2">
                                    Value * {discountType === 'PERCENTAGE' ? '(%)' : '($)'}
                                </label>
                                <Input
                                    {...register('value', { valueAsNumber: true })}
                                    type="number"
                                    step={discountType === 'PERCENTAGE' ? '1' : '0.01'}
                                    placeholder={discountType === 'PERCENTAGE' ? '10' : '5.00'}
                                />
                                {errors.value && (
                                    <p className="text-red-500 text-sm mt-1">{errors.value.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block font-bold text-sm mb-2">Minimum Order Amount ($)</label>
                            <Input
                                {...register('minOrderAmount', {
                                    setValueAs: (v) => v === '' || v === null ? null : Number(v)
                                })}
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                            />
                            <p className="text-sm text-gray-600 mt-1">
                                Leave empty for no minimum
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Limits */}
                <Card shadow="md">
                    <CardHeader>
                        <CardTitle>Usage Limits</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block font-bold text-sm mb-2">Maximum Uses</label>
                            <Input
                                {...register('maxUses', {
                                    setValueAs: (v) => v === '' || v === null ? null : parseInt(v, 10)
                                })}
                                type="number"
                                placeholder="Unlimited"
                            />
                            <p className="text-sm text-gray-600 mt-1">
                                Leave empty for unlimited uses
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-sm mb-2">Start Date</label>
                                <Input
                                    {...register('startsAt')}
                                    type="datetime-local"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-sm mb-2">End Date</label>
                                <Input
                                    {...register('endsAt')}
                                    type="datetime-local"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status */}
                <Card shadow="md">
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <input
                                {...register('active')}
                                type="checkbox"
                                id="active"
                                className="w-6 h-6 border-4 border-black rounded accent-yellow-400"
                            />
                            <label htmlFor="active" className="font-bold">
                                Active (customers can use this code)
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Orders Using This Discount */}
                {discount.orders && discount.orders.length > 0 && (
                    <Card shadow="md">
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                        </CardHeader>
                        <div className="divide-y-4 divide-black">
                            {discount.orders.map((order: any) => (
                                <div key={order.id} className="p-4 flex items-center justify-between">
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="font-bold hover:text-red-500"
                                    >
                                        #{order.orderNumber}
                                    </Link>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="font-bold">{formatPrice(order.total)}</span>
                                        <span className="text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={updateDiscount.isPending}
                        className="flex-1"
                    >
                        {updateDiscount.isPending ? (
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
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/admin/discounts">Cancel</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}
