'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, X, ChevronDown } from 'lucide-react';
import { useProducts, useCategories } from '@/lib/hooks';
import { ProductCard } from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
        <div className="py-16 bg-background min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <span className="inline-block bg-primary text-primary-foreground font-mono text-sm font-bold px-3 py-1 mb-3 -rotate-1 border-2 border-black">
                        SHOP
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">ALL PRODUCTS</h1>
                    <p className="text-muted-foreground mt-2">
                        {pagination?.total || 0} products
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
                    <Button
                        variant="outline"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="md:hidden border-4 border-black font-bold"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>

                    <div className="hidden md:flex items-center gap-2">
                        {selectedCategory && (
                            <button
                                onClick={() => setSelectedCategory(undefined)}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground font-mono text-xs font-bold border-2 border-black"
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
                            className="pr-10 min-w-[200px] h-12 px-4 font-bold border-4 border-black bg-background appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
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
                            'fixed inset-y-0 left-0 w-80 bg-background border-r-4 border-black z-40 p-6 transition-transform md:relative md:inset-auto md:w-64 md:translate-x-0 md:p-0 md:border-0 md:block',
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
                            <h3 className="font-black uppercase tracking-wider mb-4 text-sm">Categories</h3>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => {
                                            setSelectedCategory(undefined);
                                            setIsFilterOpen(false);
                                        }}
                                        className={cn(
                                            'text-left hover:text-primary transition-colors font-medium',
                                            !selectedCategory && 'text-primary font-bold'
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
                                                'text-left hover:text-primary transition-colors font-medium',
                                                selectedCategory === category.slug && 'text-primary font-bold'
                                            )}
                                        >
                                            {category.name}
                                            {category._count?.products && (
                                                <span className="text-muted-foreground ml-1">
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
                                                                'text-sm text-left hover:text-primary transition-colors',
                                                                selectedCategory === sub.slug && 'text-primary font-bold'
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
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="border-4 border-black bg-muted shadow-md animate-pulse">
                                        <div className="aspect-[3/4] bg-muted" />
                                        <div className="p-4 space-y-2">
                                            <div className="h-4 bg-muted-foreground/20 w-3/4 rounded" />
                                            <div className="h-4 bg-muted-foreground/20 w-1/2 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-xl font-bold">No products found</p>
                                <p className="text-muted-foreground mt-2">
                                    Try adjusting your filters
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                                                    'w-10 h-10 border-4 border-black font-bold transition-all rounded-lg',
                                                    page === i + 1
                                                        ? 'bg-black text-white'
                                                        : 'bg-background hover:bg-muted'
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
            <div className="container mx-auto px-4 py-16">
                <div className="animate-pulse">
                    <div className="h-12 w-64 bg-muted mb-8 rounded" />
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="border-4 border-black">
                                <div className="aspect-[3/4] bg-muted" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-muted w-3/4 rounded" />
                                    <div className="h-4 bg-muted w-1/2 rounded" />
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
