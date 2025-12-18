'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Folder, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useCollections } from '@/lib/hooks';
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

export default function CollectionsPage() {
    const { data: collections, isLoading } = useCollections();

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
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">ALL COLLECTIONS</h1>
                        <div className="w-32 h-2 bg-[#EF4444] rounded-full mt-4" />
                        <p className="text-muted-foreground mt-6 text-lg max-w-2xl">
                            Explore our curated collections of products designed for your lifestyle
                        </p>
                    </div>

                    {/* Collections Grid */}
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
                    ) : !collections || collections.length === 0 ? (
                        <div className="text-center py-20">
                            <Folder className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
                            <h2 className="text-2xl font-black">No Collections Yet</h2>
                            <p className="text-muted-foreground mt-2">
                                Check back soon for curated collections
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
                            {collections.map((collection, index) => {
                                const hasImage = !!collection.image;
                                const bgColor = getColorByIndex(index);
                                const textColor = getTextColorByIndex(index);

                                return (
                                    <Link
                                        key={collection.id}
                                        href={`/collections/${collection.slug}`}
                                        className={cn(
                                            'group relative border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300 overflow-hidden',
                                            index === 0 && 'md:col-span-2 lg:col-span-2'
                                        )}
                                    >
                                        <div className="relative h-full min-h-[280px] md:min-h-[320px]">
                                            {hasImage ? (
                                                <>
                                                    <Image
                                                        src={collection.image!}
                                                        alt={collection.title}
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
                                                    <Folder className={cn(
                                                        "w-24 h-24 opacity-30",
                                                        textColor
                                                    )} />
                                                </div>
                                            )}

                                            {/* Featured Badge */}
                                            {collection.featured && (
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
                                                    {collection._count?.products !== undefined && (
                                                        <p className="font-mono text-sm font-bold mb-1 opacity-90">
                                                            {collection._count.products} Items
                                                        </p>
                                                    )}
                                                    <h2 className={cn(
                                                        'font-black tracking-tighter',
                                                        index === 0 ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'
                                                    )}>
                                                        {collection.title.toUpperCase()}
                                                    </h2>
                                                    {collection.description && (
                                                        <p className="mt-2 line-clamp-2 opacity-80">
                                                            {collection.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
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
