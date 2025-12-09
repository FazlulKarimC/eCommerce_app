'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Folder, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useCollections } from '@/lib/hooks';
import { cn } from '@/lib/utils';

export default function CollectionsPage() {
    const { data: collections, isLoading } = useCollections();

    return (
        <div className="py-16 bg-muted min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-12">
                    <span className="inline-block bg-black text-secondary font-mono text-sm font-bold px-3 py-1 mb-3">
                        CURATED
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter">ALL COLLECTIONS</h1>
                    <p className="text-muted-foreground mt-4 text-lg max-w-2xl">
                        Explore our curated collections of products designed for your lifestyle
                    </p>
                </div>

                {/* Collections Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="border-4 border-black bg-card shadow-md animate-pulse">
                                <div className="aspect-square bg-muted" />
                                <div className="p-6 space-y-3">
                                    <div className="h-6 bg-muted w-2/3 rounded" />
                                    <div className="h-4 bg-muted w-full rounded" />
                                </div>
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
                            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-black text-white font-bold border-4 border-black shadow-md hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
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
                                    'group relative border-4 border-black shadow-md hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all overflow-hidden',
                                    index === 0 && 'md:col-span-2 lg:col-span-2'
                                )}
                            >
                                <div className={cn(
                                    'relative overflow-hidden',
                                    index === 0 ? 'aspect-[16/9]' : 'aspect-square'
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
                                    <div className={`absolute inset-0 ${index === 0 ? 'bg-secondary' : index % 3 === 1 ? 'bg-primary' : 'bg-black'
                                        } opacity-80 mix-blend-multiply`} />

                                    {/* Featured Badge */}
                                    {collection.featured && (
                                        <div className="absolute top-4 left-4 bg-secondary text-black font-mono text-xs font-bold px-3 py-1 border-2 border-black -rotate-3">
                                            FEATURED
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className={`absolute inset-0 p-6 flex flex-col justify-between ${index === 0 ? 'text-black' : 'text-white'
                                        }`}>
                                        <div className="self-end">
                                            <div className="w-12 h-12 border-4 border-current flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                                                <ArrowUpRight className="h-6 w-6" />
                                            </div>
                                        </div>
                                        <div>
                                            {collection._count?.products !== undefined && (
                                                <p className="font-mono text-sm font-bold mb-1">
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
            </div>
        </div>
    );
}
