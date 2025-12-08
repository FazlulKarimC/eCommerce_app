'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Folder, ArrowRight } from 'lucide-react';
import { useCollections } from '@/lib/hooks';
import { cn } from '@/lib/utils';

export default function CollectionsPage() {
    const { data: collections, isLoading } = useCollections();

    return (
        <div className="py-8">
            <div className="container">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-black">Collections</h1>
                    <p className="text-[var(--brutal-gray-600)] mt-4 text-lg max-w-2xl mx-auto">
                        Explore our curated collections of products designed for your lifestyle
                    </p>
                </div>

                {/* Collections Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="brutal-card animate-pulse">
                                <div className="aspect-[4/3] bg-[var(--brutal-gray-200)]" />
                                <div className="p-6 space-y-3">
                                    <div className="h-6 bg-[var(--brutal-gray-200)] w-2/3" />
                                    <div className="h-4 bg-[var(--brutal-gray-200)] w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !collections || collections.length === 0 ? (
                    <div className="text-center py-20">
                        <Folder className="w-20 h-20 mx-auto text-[var(--brutal-gray-300)] mb-6" />
                        <h2 className="text-2xl font-black">No Collections Yet</h2>
                        <p className="text-[var(--brutal-gray-600)] mt-2">
                            Check back soon for curated collections
                        </p>
                        <Link href="/products" className="brutal-btn brutal-btn-dark mt-8 inline-flex">
                            Browse All Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {collections.map((collection, index) => (
                            <Link
                                key={collection.id}
                                href={`/collections/${collection.slug}`}
                                className={cn(
                                    'brutal-card group overflow-hidden transition-transform hover:-translate-y-1',
                                    index === 0 && 'md:col-span-2 lg:col-span-2'
                                )}
                            >
                                {/* Image */}
                                <div className={cn(
                                    'relative bg-[var(--brutal-gray-100)] overflow-hidden',
                                    index === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'
                                )}>
                                    {collection.image ? (
                                        <Image
                                            src={collection.image}
                                            alt={collection.title}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Folder className="w-16 h-16 text-[var(--brutal-gray-300)]" />
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Featured Badge */}
                                    {collection.featured && (
                                        <span className="absolute top-4 left-4 brutal-badge brutal-badge-yellow">
                                            Featured
                                        </span>
                                    )}

                                    {/* Product Count */}
                                    {collection._count?.products !== undefined && (
                                        <span className="absolute top-4 right-4 brutal-badge">
                                            {collection._count.products} products
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className={cn(
                                            'font-black group-hover:text-[var(--brutal-red)] transition-colors',
                                            index === 0 ? 'text-2xl' : 'text-xl'
                                        )}>
                                            {collection.title}
                                        </h2>
                                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </div>
                                    {collection.description && (
                                        <p className="text-[var(--brutal-gray-600)] mt-2 line-clamp-2">
                                            {collection.description}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
