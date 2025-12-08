'use client';

import { useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Folder, ArrowLeft } from 'lucide-react';
import { useCollection, useProducts } from '@/lib/hooks';
import { ProductCard } from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';

const sortOptions = [
    { label: 'Newest', value: 'createdAt-desc' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Name: A-Z', value: 'title-asc' },
];

function CollectionDetailContent() {
    const params = useParams();
    const slug = params?.slug as string;

    const [sortBy, setSortBy] = useState('createdAt-desc');
    const [page, setPage] = useState(1);

    const [sortField, sortOrder] = sortBy.split('-') as ['title' | 'price' | 'createdAt', 'asc' | 'desc'];

    const { data: collection, isLoading: isLoadingCollection } = useCollection(slug);
    const { data: productsData, isLoading: isLoadingProducts } = useProducts({
        page,
        limit: 12,
        collection: slug,
        sort: sortField,
        order: sortOrder,
    });

    const products = productsData?.products || [];
    const pagination = productsData?.pagination;

    if (isLoadingCollection) {
        return (
            <div className="py-8">
                <div className="container">
                    <div className="animate-pulse">
                        <div className="h-64 bg-[var(--brutal-gray-200)] mb-8" />
                        <div className="h-10 w-64 bg-[var(--brutal-gray-200)] mb-4" />
                        <div className="h-6 w-96 bg-[var(--brutal-gray-200)]" />
                    </div>
                </div>
            </div>
        );
    }

    if (!collection) {
        return (
            <div className="container py-20 text-center">
                <Folder className="w-20 h-20 mx-auto text-[var(--brutal-gray-300)] mb-6" />
                <h1 className="text-4xl font-black">Collection Not Found</h1>
                <p className="text-[var(--brutal-gray-600)] mt-2">
                    The collection you're looking for doesn't exist.
                </p>
                <Link href="/collections" className="brutal-btn brutal-btn-dark mt-8 inline-flex">
                    View All Collections
                </Link>
            </div>
        );
    }

    return (
        <div className="py-8">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="mb-6">
                    <Link href="/collections" className="inline-flex items-center gap-2 text-sm font-bold hover:text-[var(--brutal-red)]">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Collections
                    </Link>
                </nav>

                {/* Collection Header */}
                <div className="brutal-card overflow-hidden mb-8">
                    <div className="relative h-64 md:h-80 bg-[var(--brutal-gray-100)]">
                        {collection.image ? (
                            <Image
                                src={collection.image}
                                alt={collection.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Folder className="w-24 h-24 text-[var(--brutal-gray-300)]" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <h1 className="text-3xl md:text-5xl font-black text-white">
                                {collection.title}
                            </h1>
                            {collection.description && (
                                <p className="text-white/80 mt-2 max-w-2xl text-lg">
                                    {collection.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between gap-4 mb-8">
                    <p className="text-[var(--brutal-gray-600)]">
                        {pagination?.total || 0} products
                    </p>

                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setPage(1);
                            }}
                            className="brutal-input pr-10 min-w-[200px] appearance-none cursor-pointer"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                    </div>
                </div>

                {/* Products Grid */}
                {isLoadingProducts ? (
                    <div className="product-grid">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="brutal-card animate-pulse">
                                <div className="aspect-square bg-[var(--brutal-gray-200)]" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-[var(--brutal-gray-200)] w-3/4" />
                                    <div className="h-4 bg-[var(--brutal-gray-200)] w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl font-bold">No products in this collection</p>
                        <p className="text-[var(--brutal-gray-600)] mt-2">
                            Check back soon for new additions
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="product-grid">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12">
                                {Array.from({ length: pagination.totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={cn(
                                            'w-10 h-10 border-2 border-[var(--brutal-black)] font-bold',
                                            page === i + 1
                                                ? 'bg-[var(--brutal-black)] text-white'
                                                : 'hover:bg-[var(--brutal-gray-100)]'
                                        )}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default function CollectionDetailPage() {
    return (
        <Suspense fallback={
            <div className="container py-8">
                <div className="animate-pulse">
                    <div className="h-64 bg-[var(--brutal-gray-200)] mb-8" />
                    <div className="h-10 w-64 bg-[var(--brutal-gray-200)] mb-4" />
                </div>
            </div>
        }>
            <CollectionDetailContent />
        </Suspense>
    );
}
