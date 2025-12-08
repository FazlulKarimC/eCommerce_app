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
                    className="inline-flex items-center gap-2 text-[var(--brutal-gray-600)] hover:text-[var(--brutal-black)] mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Discounts
                </Link>
                <h1 className="text-3xl font-black">Create Discount</h1>
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
                        Discount Details
                    </h2>

                    <div>
                        <label className="block font-bold text-sm mb-2">Discount Code *</label>
                        <input
                            {...register('code')}
                            className="brutal-input font-mono uppercase"
                            placeholder="SAVE20"
                        />
                        {errors.code && (
                            <p className="text-[var(--brutal-red)] text-sm mt-1">{errors.code.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold text-sm mb-2">Discount Type *</label>
                            <select {...register('type')} className="brutal-input">
                                <option value="PERCENTAGE">Percentage</option>
                                <option value="FIXED_AMOUNT">Fixed Amount</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-bold text-sm mb-2">
                                Value * {discountType === 'PERCENTAGE' ? '(%)' : '($)'}
                            </label>
                            <input
                                {...register('value', { valueAsNumber: true })}
                                type="number"
                                step={discountType === 'PERCENTAGE' ? '1' : '0.01'}
                                className="brutal-input"
                                placeholder={discountType === 'PERCENTAGE' ? '10' : '5.00'}
                            />
                            {errors.value && (
                                <p className="text-[var(--brutal-red)] text-sm mt-1">{errors.value.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold text-sm mb-2">Minimum Purchase ($)</label>
                        <input
                            {...register('minPurchase', { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            className="brutal-input"
                            placeholder="0.00"
                        />
                        <p className="text-sm text-[var(--brutal-gray-600)] mt-1">
                            Leave empty for no minimum
                        </p>
                    </div>
                </div>

                {/* Limits */}
                <div className="brutal-card p-6 space-y-4">
                    <h2 className="font-black text-lg border-b-2 border-[var(--brutal-gray-200)] pb-2 mb-4">
                        Usage Limits
                    </h2>

                    <div>
                        <label className="block font-bold text-sm mb-2">Maximum Uses</label>
                        <input
                            {...register('maxUses', { valueAsNumber: true })}
                            type="number"
                            className="brutal-input"
                            placeholder="Unlimited"
                        />
                        <p className="text-sm text-[var(--brutal-gray-600)] mt-1">
                            Leave empty for unlimited uses
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold text-sm mb-2">Start Date</label>
                            <input
                                {...register('startDate')}
                                type="datetime-local"
                                className="brutal-input"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-sm mb-2">End Date</label>
                            <input
                                {...register('endDate')}
                                type="datetime-local"
                                className="brutal-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="brutal-card p-6">
                    <div className="flex items-center gap-3">
                        <input
                            {...register('isActive')}
                            type="checkbox"
                            id="isActive"
                            className="w-5 h-5 border-2 border-[var(--brutal-black)]"
                        />
                        <label htmlFor="isActive" className="font-bold">
                            Active (customers can use this code)
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={createDiscount.isPending}
                        className="brutal-btn brutal-btn-primary flex-1"
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
                    </button>
                    <Link href="/admin/discounts" className="brutal-btn">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
