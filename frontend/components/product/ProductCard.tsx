'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { formatPrice, calculateDiscount, cn } from '@/lib/utils';
import { useCartStore } from '@/lib/cart';
import type { ProductListItem } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
    product: ProductListItem;
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const { addItem, isLoading } = useCartStore();

    // Safe array access - guard against empty arrays
    const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
    const firstImage = product.images && product.images.length > 0 ? product.images[0] : null;

    const price = firstVariant?.price ? parseFloat(String(firstVariant.price)) : 0;
    const compareAtPrice = firstVariant?.compareAtPrice
        ? parseFloat(String(firstVariant.compareAtPrice))
        : null;
    const isOnSale = compareAtPrice && compareAtPrice > price;
    const discountPercent = isOnSale ? calculateDiscount(compareAtPrice!, price) : 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (firstVariant) {
            try {
                await addItem(firstVariant.id, 1);
            } catch (error) {
                console.error('Failed to add to cart:', error);
            }
        }
    };

    return (
        <Link
            href={`/products/${product.slug}`}
            className={cn("block", className)}
        >
            <div className="group bg-white border-4 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#000] transition-all duration-300">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {firstImage ? (
                        <Image
                            src={firstImage.url}
                            alt={firstImage.alt || product.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-16 h-16 text-gray-300" />
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        {product.featured && (
                            <span className="inline-block bg-[#FFEB3B] text-black font-mono text-xs font-bold px-3 py-1 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] -rotate-3">
                                NEW
                            </span>
                        )}
                        {isOnSale && (
                            <span className="inline-block bg-[#FF3B30] text-white font-mono text-xs font-bold px-3 py-1 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] rotate-2">
                                SALE
                            </span>
                        )}
                    </div>

                    {/* Quick Add Button */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                            size="icon"
                            onClick={handleAddToCart}
                            disabled={isLoading || !firstVariant || firstVariant.inventoryQty === 0}
                            className="bg-black text-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#FFEB3B] hover:bg-[#FFEB3B] hover:text-black hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] transition-all"
                            aria-label="Add to cart"
                        >
                            <ShoppingBag className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Out of Stock Overlay */}
                    {firstVariant && firstVariant.inventoryQty === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-black text-white font-mono text-xs font-bold px-4 py-2 border-2 border-white rounded-lg">
                                SOLD OUT
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-bold text-lg group-hover:text-[#FF3B30] transition-colors line-clamp-1">
                        {product.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="font-black text-xl">{formatPrice(price)}</span>
                        {isOnSale && (
                            <>
                                <span className="text-gray-400 line-through text-sm">
                                    {formatPrice(compareAtPrice!)}
                                </span>
                                <span className="bg-[#FF3B30] text-white font-mono text-xs font-bold px-2 py-0.5 rounded">
                                    -{discountPercent}%
                                </span>
                            </>
                        )}
                    </div>

                    {/* Reviews count */}
                    {product._count?.reviews && product._count.reviews > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                            {product._count.reviews} reviews
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
