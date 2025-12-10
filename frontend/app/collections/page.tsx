'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Folder, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useCollections } from '@/lib/hooks';
import { cn } from '@/lib/utils';

export default function CollectionsPage() {
    const { data: collections, isLoading } = useCollections();

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <main className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="inline-block bg-black text-[#FFEB3B] font-mono text-sm font-bold px-4 py-2 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2">
                                CURATED
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">ALL COLLECTIONS</h1>
                        <div className="w-32 h-2 bg-[#FF3B30] rounded-full mt-4" />
                        <p className="text-muted-foreground mt-6 text-lg max-w-2xl">
                            Explore our curated collections of products designed for your lifestyle
                        </p>
                    </div>

                    {/* Collections Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className={cn(
                                    "border-4 border-black bg-white rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-pulse",
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
                                className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-black text-white font-bold rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                            >
                                Browse All Products
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {collections.map((collection, index) => (
                                <Link
                                    key={collection.id}
                                    href={`/collections/${collection.slug}`}
                                    className={cn(
                                        'group relative border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all duration-300 overflow-hidden bg-white',
                                        index === 0 && 'md:col-span-2 lg:col-span-2'
                                    )}
                                >
                                    <div className={cn(
                                        'relative overflow-hidden',
                                        index === 0 ? 'aspect-video' : 'aspect-square'
                                    )}>
                                        {collection.image ? (
                                            <Image
                                                src={collection.image}
                                                alt={collection.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-muted">
                                                <Folder className="w-16 h-16 text-muted-foreground" />
                                            </div>
                                        )}

                                        {/* Color Overlay */}
                                        <div className={cn(
                                            "absolute inset-0 opacity-75 mix-blend-multiply",
                                            index === 0 ? 'bg-[#FF3B30]' : index % 3 === 1 ? 'bg-[#FFEB3B]' : 'bg-black'
                                        )} />

                                        {/* Featured Badge */}
                                        {collection.featured && (
                                            <div className="absolute top-4 left-4 bg-[#FFEB3B] text-black font-mono text-xs font-bold px-3 py-1.5 border-3 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-3">
                                                FEATURED
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className={cn(
                                            "absolute inset-0 p-6 flex flex-col justify-between",
                                            index === 0 || index % 3 !== 1 ? 'text-white' : 'text-black'
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
                            ))}
                        </div>
                    )}

                    {/* Bottom CTA */}
                    <div className="mt-16 text-center">
                        <div className="inline-block bg-[#FFEB3B] border-4 border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-2xl font-black mb-2">CAN'T FIND WHAT YOU'RE LOOKING FOR?</h3>
                            <p className="text-muted-foreground mb-6">Browse our entire catalog of products</p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
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
