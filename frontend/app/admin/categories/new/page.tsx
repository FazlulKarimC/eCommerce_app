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

const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().optional(),
    image: z.string().url().optional().or(z.literal('')),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function NewCategoryPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
    });

    const name = watch('name');

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const createCategory = useMutation({
        mutationFn: async (data: CategoryFormData) => {
            const res = await api.post('/categories', data);
            return res.data;
        },
        onSuccess: () => {
            router.push('/admin/categories');
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to create category');
        },
    });

    const onSubmit = (data: CategoryFormData) => {
        setError(null);
        createCategory.mutate(data);
    };

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <Link
                    href="/admin/categories"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Categories
                </Link>
                <h1 className="text-3xl font-black">Create Category</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <div className="bg-red-500 text-white p-4 border-4 border-black rounded-xl">
                        {error}
                    </div>
                )}

                <Card shadow="md">
                    <CardHeader>
                        <CardTitle>Category Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block font-bold text-sm mb-2">Name *</label>
                            <Input
                                {...register('name')}
                                placeholder="Electronics"
                                onBlur={() => {
                                    if (name && !watch('slug')) {
                                        setValue('slug', generateSlug(name));
                                    }
                                }}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block font-bold text-sm mb-2">Slug *</label>
                            <Input {...register('slug')} placeholder="electronics" />
                            {errors.slug && (
                                <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block font-bold text-sm mb-2">Description</label>
                            <Textarea {...register('description')} rows={3} />
                        </div>

                        <div>
                            <label className="block font-bold text-sm mb-2">Image URL</label>
                            <Input {...register('image')} placeholder="https://example.com/image.jpg" />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button type="submit" disabled={createCategory.isPending} className="flex-1">
                        {createCategory.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Create Category
                            </>
                        )}
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/admin/categories">Cancel</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}
