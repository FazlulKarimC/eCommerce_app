'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, X, ChevronDown } from 'lucide-react';
import { useProducts, useCategories } from '@/lib/hooks';
import { ProductCard } from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';

const sortOptions = [
    { label: 'Newest', value: 'createdAt-desc' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Name: A-Z', value: 'title-asc' },
];

function ProductsPageContent() {
    const searchParams = useSearchParams();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
        searchParams?.get('category') || undefined
    );
    const [sortBy, setSortBy] = useState('createdAt-desc');
    const [page, setPage] = useState(1);

    const [sortField, sortOrder] = sortBy.split('-') as ['title' | 'price' | 'createdAt', 'asc' | 'desc'];

    const { data, isLoading } = useProducts({
        page,
        limit: 12,
        category: selectedCategory,
        sort: sortField,
        order: sortOrder,
    });

    const { data: categories } = useCategories();

    const products = data?.products || [];
    const pagination = data?.pagination;

    return (
        <div className="py-8">
            <div className="container">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-black">All Products</h1>
                    <p className="text-[var(--brutal-gray-600)] mt-2">
                        {pagination?.total || 0} products
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="brutal-btn md:hidden"
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>

                    <div className="hidden md:flex items-center gap-2">
                        {selectedCategory && (
                            <button
                                onClick={() => setSelectedCategory(undefined)}
                                className="brutal-badge flex items-center gap-1"
                            >
                                {categories?.find((c) => c.slug === selectedCategory)?.name}
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
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

                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <aside
                        className={cn(
                            'fixed inset-y-0 left-0 w-80 bg-[var(--brutal-white)] border-r-4 border-[var(--brutal-black)] z-40 p-6 transition-transform md:relative md:inset-auto md:w-64 md:translate-x-0 md:p-0 md:border-0 md:block',
                            isFilterOpen ? 'translate-x-0' : '-translate-x-full'
                        )}
                    >
                        <div className="flex items-center justify-between mb-6 md:hidden">
                            <h2 className="text-xl font-black">Filters</h2>
                            <button onClick={() => setIsFilterOpen(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Categories */}
                        <div className="mb-8">
                            <h3 className="font-bold uppercase tracking-wider mb-4">Categories</h3>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => {
                                            setSelectedCategory(undefined);
                                            setIsFilterOpen(false);
                                        }}
                                        className={cn(
                                            'text-left hover:text-[var(--brutal-red)] transition-colors',
                                            !selectedCategory && 'text-[var(--brutal-red)] font-bold'
                                        )}
                                    >
                                        All Products
                                    </button>
                                </li>
                                {categories?.map((category) => (
                                    <li key={category.id}>
                                        <button
                                            onClick={() => {
                                                setSelectedCategory(category.slug);
                                                setIsFilterOpen(false);
                                            }}
                                            className={cn(
                                                'text-left hover:text-[var(--brutal-red)] transition-colors',
                                                selectedCategory === category.slug && 'text-[var(--brutal-red)] font-bold'
                                            )}
                                        >
                                            {category.name}
                                            {category._count?.products && (
                                                <span className="text-[var(--brutal-gray-500)] ml-1">
                                                    ({category._count.products})
                                                </span>
                                            )}
                                        </button>

                                        {/* Subcategories */}
                                        {category.children && category.children.length > 0 && (
                                            <ul className="ml-4 mt-2 space-y-1">
                                                {category.children.map((sub) => (
                                                    <li key={sub.id}>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedCategory(sub.slug);
                                                                setIsFilterOpen(false);
                                                            }}
                                                            className={cn(
                                                                'text-sm text-left hover:text-[var(--brutal-red)] transition-colors',
                                                                selectedCategory === sub.slug && 'text-[var(--brutal-red)] font-bold'
                                                            )}
                                                        >
                                                            {sub.name}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Backdrop for mobile */}
                    {isFilterOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-30 md:hidden"
                            onClick={() => setIsFilterOpen(false)}
                        />
                    )}

                    {/* Products Grid */}
                    <div className="flex-1">
                        {isLoading ? (
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
                                <p className="text-xl font-bold">No products found</p>
                                <p className="text-[var(--brutal-gray-600)] mt-2">
                                    Try adjusting your filters
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
            </div>
        </div>
    );
}

// Wrapper with Suspense for useSearchParams
export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="container py-8">
                <div className="animate-pulse">
                    <div className="h-12 w-64 bg-[var(--brutal-gray-200)] mb-8" />
                    <div className="product-grid">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="brutal-card">
                                <div className="aspect-square bg-[var(--brutal-gray-200)]" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-[var(--brutal-gray-200)] w-3/4" />
                                    <div className="h-4 bg-[var(--brutal-gray-200)] w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        }>
            <ProductsPageContent />
        </Suspense>
    );
}
