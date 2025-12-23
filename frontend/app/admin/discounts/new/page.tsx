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
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui';

const discountSchema = z.object({
    code: z.string().min(1, 'Code is required').max(50),
    type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
    value: z.number().min(0, 'Value must be positive'),
    minPurchase: z.number().min(0).optional().nullable(),
    maxUses: z.number().int().min(1).optional().nullable(),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    isActive: z.boolean(),
});

type DiscountFormData = z.infer<typeof discountSchema>;

export default function NewDiscountPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<DiscountFormData>({
        resolver: zodResolver(discountSchema),
        defaultValues: {
            type: 'PERCENTAGE',
            value: 10,
            isActive: true,
        },
    });

    const discountType = watch('type');

    const createDiscount = useMutation({
        mutationFn: async (data: DiscountFormData) => {
            const res = await api.post('/discounts', data);
            return res.data;
        },
        onSuccess: () => {
            router.push('/admin/discounts');
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to create discount');
        },
    });

    const onSubmit = (data: DiscountFormData) => {
        setError(null);
        createDiscount.mutate(data);
    };

    return (
        <div className="max-w-2xl">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/discounts"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Discounts
                </Link>
                <h1 className="text-3xl font-black">Create Discount</h1>
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
                            <label className="block font-bold text-sm mb-2">Minimum Purchase ($)</label>
                            <Input
                                {...register('minPurchase', { valueAsNumber: true })}
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
                                {...register('maxUses', { valueAsNumber: true })}
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
                                    {...register('startDate')}
                                    type="datetime-local"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-sm mb-2">End Date</label>
                                <Input
                                    {...register('endDate')}
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
                                {...register('isActive')}
                                type="checkbox"
                                id="isActive"
                                className="w-6 h-6 border-4 border-black rounded accent-yellow-400"
                            />
                            <label htmlFor="isActive" className="font-bold">
                                Active (customers can use this code)
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={createDiscount.isPending}
                        className="flex-1"
                    >
                        {createDiscount.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Create Discount
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
