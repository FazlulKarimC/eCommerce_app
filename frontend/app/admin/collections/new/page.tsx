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

const collectionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().optional(),
    image: z.string().url().optional().or(z.literal('')),
    featured: z.boolean().default(false),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
});

type CollectionFormData = z.infer<typeof collectionSchema>;

export default function NewCollectionPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CollectionFormData>({
        resolver: zodResolver(collectionSchema),
        defaultValues: {
            featured: false,
        },
    });

    const title = watch('title');

    // Auto-generate slug from title
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const createCollection = useMutation({
        mutationFn: async (data: CollectionFormData) => {
            const res = await api.post('/collections', data);
            return res.data;
        },
        onSuccess: () => {
            router.push('/admin/collections');
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to create collection');
        },
    });

    const onSubmit = (data: CollectionFormData) => {
        setError(null);
        createCollection.mutate(data);
    };

    return (
        <div className="max-w-2xl">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/collections"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Collections
                </Link>
                <h1 className="text-3xl font-black">Create Collection</h1>
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
                        <CardTitle>Collection Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block font-bold text-sm mb-2">Title *</label>
                            <Input
                                {...register('title')}
                                placeholder="Summer Collection"
                                onBlur={() => {
                                    if (title && !watch('slug')) {
                                        setValue('slug', generateSlug(title));
                                    }
                                }}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block font-bold text-sm mb-2">Slug *</label>
                            <Input
                                {...register('slug')}
                                placeholder="summer-collection"
                            />
                            {errors.slug && (
                                <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block font-bold text-sm mb-2">Description</label>
                            <Textarea
                                {...register('description')}
                                rows={3}
                                placeholder="Describe this collection..."
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-sm mb-2">Image URL</label>
                            <Input
                                {...register('image')}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                {...register('featured')}
                                type="checkbox"
                                id="featured"
                                className="w-6 h-6 border-4 border-black rounded accent-yellow-400"
                            />
                            <label htmlFor="featured" className="font-bold">
                                Featured Collection
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {/* SEO */}
                <Card shadow="md">
                    <CardHeader>
                        <CardTitle>SEO</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block font-bold text-sm mb-2">Meta Title</label>
                            <Input
                                {...register('seoTitle')}
                                placeholder="SEO title for search engines"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-sm mb-2">Meta Description</label>
                            <Textarea
                                {...register('seoDescription')}
                                rows={2}
                                placeholder="SEO description for search engines"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={createCollection.isPending}
                        className="flex-1"
                    >
                        {createCollection.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Create Collection
                            </>
                        )}
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/admin/collections">Cancel</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}
