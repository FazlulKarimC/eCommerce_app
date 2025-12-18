'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FolderTree, ArrowRight, ArrowUpRight, ChevronRight } from 'lucide-react';
import { useCategories } from '@/lib/hooks';
import { cn } from '@/lib/utils';

// Get background color based on index for visual variety
const getColorByIndex = (index: number) => {
    if (index === 0) return 'bg-[#EF4444]';
    if (index % 3 === 1) return 'bg-[#FACC15]';
    return 'bg-black';
};

// Get text color based on background
const getTextColorByIndex = (index: number) => {
    if (index % 3 === 1) return 'text-black'; // Yellow background
    return 'text-white'; // Red or Black background
};

export default function CategoriesPage() {
    const { data: categories, isLoading } = useCategories();
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <main className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="inline-block bg-black text-[#FACC15] font-mono text-sm font-bold px-4 py-2 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_#000] -rotate-2">
                                CURATED
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">ALL CATEGORIES</h1>
                        <div className="w-32 h-2 bg-[#EF4444] rounded-full mt-4" />
                        <p className="text-muted-foreground mt-6 text-lg max-w-2xl">
                            Explore our curated categories of products designed for your lifestyle
                        </p>
                    </div>

                    {/* Categories Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className={cn(
                                    "border-4 border-black bg-white rounded-2xl shadow-[4px_4px_0px_0px_#000] animate-pulse",
                                    i === 0 && "md:col-span-2 lg:col-span-2"
                                )}>
                                    <div className={cn(
                                        "bg-muted rounded-t-xl",
                                        i === 0 ? "aspect-video" : "aspect-square"
                                    )} />
                                </div>
                            ))}
                        </div>
                    ) : !categories || categories.length === 0 ? (
                        <div className="text-center py-20">
                            <FolderTree className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
                            <h2 className="text-2xl font-black">No Categories Yet</h2>
                            <p className="text-muted-foreground mt-2">
                                Check back soon for product categories
                            </p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-black text-white font-bold rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                            >
                                Browse All Products
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                            {categories.map((category, index) => {
                                const hasImage = !!category.image;
                                const bgColor = getColorByIndex(index);
                                const textColor = getTextColorByIndex(index);

                                return (
                                    <Link
                                        key={category.id}
                                        href={`/categories/${category.slug}`}
                                        className={cn(
                                            'group relative border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300 overflow-hidden',
                                            index === 0 && 'md:col-span-2 lg:col-span-2'
                                        )}
                                        onMouseEnter={() => setHoveredCategory(category.id)}
                                        onMouseLeave={() => setHoveredCategory(null)}
                                    >
                                        <div className="relative h-full min-h-[280px] md:min-h-[320px]">
                                            {hasImage ? (
                                                <>
                                                    <Image
                                                        src={category.image!}
                                                        alt={category.name}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    {/* Color Overlay for images */}
                                                    <div className={cn(
                                                        "absolute inset-0 opacity-75 mix-blend-multiply",
                                                        bgColor
                                                    )} />
                                                </>
                                            ) : (
                                                // Vibrant fallback background with icon
                                                <div className={cn(
                                                    "w-full h-full flex items-center justify-center",
                                                    bgColor
                                                )}>
                                                    <FolderTree className={cn(
                                                        "w-24 h-24 opacity-30",
                                                        textColor
                                                    )} />
                                                </div>
                                            )}

                                            {/* Featured Badge */}
                                            {(category as any).featured && (
                                                <div className="absolute top-4 left-4 bg-[#FACC15] text-black font-mono text-xs font-bold px-3 py-1.5 border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] -rotate-3 z-10">
                                                    FEATURED
                                                </div>
                                            )}

                                            {/* Content Overlay */}
                                            <div className={cn(
                                                "absolute inset-0 p-6 flex flex-col justify-between",
                                                textColor
                                            )}>
                                                <div className="self-end">
                                                    <div className="w-12 h-12 border-4 border-current rounded-xl flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                                                        <ArrowUpRight className="h-6 w-6" />
                                                    </div>
                                                </div>
                                                <div>
                                                    {category._count?.products !== undefined && (
                                                        <p className="font-mono text-sm font-bold mb-1 opacity-90">
                                                            {category._count.products} Items
                                                        </p>
                                                    )}
                                                    <h2 className={cn(
                                                        'font-black tracking-tighter',
                                                        index === 0 ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'
                                                    )}>
                                                        {category.name.toUpperCase()}
                                                    </h2>
                                                    {category.description && (
                                                        <p className="mt-2 line-clamp-2 opacity-80">
                                                            {category.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Subcategories Hover Overlay */}
                                            {category.children && category.children.length > 0 && (
                                                <div className={cn(
                                                    "absolute bottom-0 left-0 right-0 p-4 bg-white border-t-4 border-black transform transition-transform duration-300 z-20",
                                                    hoveredCategory === category.id ? "translate-y-0" : "translate-y-full"
                                                )}>
                                                    <p className="font-black text-sm mb-3 text-black uppercase tracking-wide">Subcategories</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {category.children.slice(0, 4).map((child: any, childIndex: number) => (
                                                            <span
                                                                key={child.id}
                                                                className={cn(
                                                                    "inline-flex items-center gap-1 text-sm font-mono font-bold bg-[#FACC15] text-black px-3 py-1.5 border-2 border-black rounded-md shadow-[2px_2px_0px_0px_#000]",
                                                                    childIndex % 2 === 0 ? "-rotate-1" : "rotate-1"
                                                                )}
                                                            >
                                                                <ChevronRight className="w-3 h-3" />
                                                                {child.name}
                                                            </span>
                                                        ))}
                                                        {category.children.length > 4 && (
                                                            <span className="text-sm font-bold text-black bg-white border-2 border-black px-3 py-1.5 rounded-md shadow-[2px_2px_0px_0px_#000]">
                                                                +{category.children.length - 4} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Bottom CTA */}
                    <div className="mt-16 text-center">
                        <div className="inline-block bg-[#FACC15] border-4 border-black rounded-2xl p-8 shadow-[4px_4px_0px_0px_#000]">
                            <h3 className="text-2xl font-black mb-2">CAN'T FIND WHAT YOU'RE LOOKING FOR?</h3>
                            <p className="text-muted-foreground mb-6">Browse our entire catalog of products</p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                            >
                                SHOP ALL PRODUCTS
                                <ArrowUpRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
