'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { formatPrice, calculateDiscount, cn } from '@/lib/utils';
import { useCartStore } from '@/lib/cart';
import type { ProductListItem } from '@/lib/types';

interface ProductCardProps {
    product: ProductListItem;
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const { addItem, isLoading } = useCartStore();

    const firstVariant = product.variants[0];
    const firstImage = product.images[0];

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
            className={cn('brutal-card group block', className)}
        >
            {/* Image */}
            <div className="relative aspect-square bg-[var(--brutal-gray-100)] overflow-hidden">
                {firstImage ? (
                    <Image
                        src={firstImage.url}
                        alt={firstImage.alt || product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-16 h-16 text-[var(--brutal-gray-300)]" />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {isOnSale && (
                        <span className="brutal-badge brutal-badge-red">
                            -{discountPercent}%
                        </span>
                    )}
                    {product.featured && (
                        <span className="brutal-badge brutal-badge-yellow">
                            Featured
                        </span>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleAddToCart}
                        disabled={isLoading || !firstVariant || firstVariant.inventoryQty === 0}
                        className="w-10 h-10 bg-[var(--brutal-white)] border-2 border-[var(--brutal-black)] flex items-center justify-center hover:bg-[var(--brutal-yellow)] transition-colors disabled:opacity-50"
                        aria-label="Add to cart"
                    >
                        <ShoppingBag className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // TODO: Add to wishlist
                        }}
                        className="w-10 h-10 bg-[var(--brutal-white)] border-2 border-[var(--brutal-black)] flex items-center justify-center hover:bg-[var(--brutal-red)] hover:text-white transition-colors"
                        aria-label="Add to wishlist"
                    >
                        <Heart className="w-5 h-5" />
                    </button>
                </div>

                {/* Out of Stock Overlay */}
                {firstVariant && firstVariant.inventoryQty === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="brutal-badge bg-[var(--brutal-black)] text-white">
                            Sold Out
                        </span>
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="p-4">
                <h3 className="font-bold text-lg group-hover:text-[var(--brutal-red)] transition-colors line-clamp-1">
                    {product.title}
                </h3>

                <div className="flex items-center gap-2 mt-2">
                    <span className={cn('price text-lg', isOnSale && 'price-sale')}>
                        {formatPrice(price)}
                    </span>
                    {isOnSale && (
                        <span className="price price-compare text-sm">
                            {formatPrice(compareAtPrice!)}
                        </span>
                    )}
                </div>

                {/* Rating placeholder */}
                {product._count?.reviews && product._count.reviews > 0 && (
                    <p className="text-sm text-[var(--brutal-gray-600)] mt-1">
                        {product._count.reviews} reviews
                    </p>
                )}
            </div>
        </Link>
    );
}
