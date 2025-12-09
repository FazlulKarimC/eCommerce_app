'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
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
            className={cn(
                'group relative border-4 border-black bg-card shadow-md hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all',
                className
            )}
        >
            {/* Image */}
            <div className="relative aspect-[3/4] bg-muted overflow-hidden">
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
                        <ShoppingBag className="w-16 h-16 text-muted-foreground" />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {isOnSale && (
                        <span className="bg-primary text-primary-foreground font-mono text-xs font-bold px-3 py-1 border-2 border-black -rotate-3">
                            -{discountPercent}%
                        </span>
                    )}
                    {product.featured && (
                        <span className="bg-secondary text-secondary-foreground font-mono text-xs font-bold px-3 py-1 border-2 border-black rotate-2">
                            Featured
                        </span>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="icon"
                        onClick={handleAddToCart}
                        disabled={isLoading || !firstVariant || firstVariant.inventoryQty === 0}
                        className="border-4 border-black shadow-xs hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                        aria-label="Add to cart"
                    >
                        <ShoppingBag className="w-4 h-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // TODO: Add to wishlist
                        }}
                        className="border-4 border-black bg-background shadow-xs hover:bg-primary hover:text-primary-foreground hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                        aria-label="Add to wishlist"
                    >
                        <Heart className="w-4 h-4" />
                    </Button>
                </div>

                {/* Out of Stock Overlay */}
                {firstVariant && firstVariant.inventoryQty === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-black text-white font-mono text-xs font-bold px-4 py-2 border-2 border-white">
                            SOLD OUT
                        </span>
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="p-4">
                <h3 className="font-black text-sm md:text-base group-hover:text-primary transition-colors line-clamp-1">
                    {product.title.toUpperCase()}
                </h3>

                <div className="flex items-center gap-2 mt-2">
                    <span className={cn(
                        'font-mono font-bold text-lg',
                        isOnSale && 'text-primary'
                    )}>
                        {formatPrice(price)}
                    </span>
                    {isOnSale && (
                        <span className="font-mono text-sm text-muted-foreground line-through">
                            {formatPrice(compareAtPrice!)}
                        </span>
                    )}
                </div>

                {/* Rating placeholder */}
                {product._count?.reviews && product._count.reviews > 0 && (
                    <p className="text-sm text-muted-foreground mt-1 font-medium">
                        {product._count.reviews} reviews
                    </p>
                )}
            </div>
        </Link>
    );
}
