'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, Loader2 } from 'lucide-react';
import { useWishlist, useRemoveFromWishlist } from '@/lib/hooks';
import { useCartStore } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';

export default function WishlistPage() {
    const { data: wishlist, isLoading } = useWishlist();
    const removeFromWishlist = useRemoveFromWishlist();
    const { addItem } = useCartStore();
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const [removing, setRemoving] = useState<string | null>(null);

    const handleAddToCart = async (variantId: string, productId: string) => {
        setAddingToCart(productId);
        try {
            await addItem(variantId, 1);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
        setAddingToCart(null);
    };

    const handleRemove = async (productId: string) => {
        setRemoving(productId);
        try {
            await removeFromWishlist.mutateAsync(productId);
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
        }
        setRemoving(null);
    };

    return (
        <div>
            <div className="brutal-card">
                <div className="p-6 border-b-2 border-[var(--brutal-gray-200)]">
                    <h2 className="text-2xl font-black">My Wishlist</h2>
                    <p className="text-[var(--brutal-gray-600)] mt-1">
                        {wishlist?.length || 0} items saved for later
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="brutal-card animate-pulse">
                                <div className="aspect-square bg-[var(--brutal-gray-200)]" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-[var(--brutal-gray-200)] w-3/4" />
                                    <div className="h-4 bg-[var(--brutal-gray-200)] w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !wishlist || wishlist.length === 0 ? (
                    <div className="p-12 text-center">
                        <Heart className="w-16 h-16 mx-auto text-[var(--brutal-gray-300)] mb-4" />
                        <h3 className="text-xl font-black">Your Wishlist is Empty</h3>
                        <p className="text-[var(--brutal-gray-600)] mt-2">
                            Save items you love to your wishlist
                        </p>
                        <Link href="/products" className="brutal-btn brutal-btn-primary mt-6 inline-flex">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                        {wishlist.map((item) => {
                            const product = item.product;
                            const price = product.price || 0;
                            const compareAtPrice = product.compareAtPrice;
                            const isOnSale = compareAtPrice && compareAtPrice > price;

                            return (
                                <div key={item.id} className="brutal-card overflow-hidden group">
                                    {/* Image */}
                                    <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-[var(--brutal-gray-100)]">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-12 h-12 text-[var(--brutal-gray-300)]" />
                                            </div>
                                        )}

                                        {/* Sale Badge */}
                                        {isOnSale && (
                                            <span className="absolute top-2 left-2 brutal-badge brutal-badge-red text-xs">
                                                Sale
                                            </span>
                                        )}

                                        {/* Remove Button */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemove(product.id);
                                            }}
                                            disabled={removing === product.id}
                                            className="absolute top-2 right-2 w-8 h-8 bg-white border-2 border-[var(--brutal-black)] flex items-center justify-center hover:bg-[var(--brutal-red)] hover:text-white transition-colors"
                                            title="Remove from wishlist"
                                        >
                                            {removing === product.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </Link>

                                    {/* Content */}
                                    <div className="p-4">
                                        <Link href={`/products/${product.slug}`}>
                                            <h3 className="font-bold line-clamp-1 hover:text-[var(--brutal-red)] transition-colors">
                                                {product.title}
                                            </h3>
                                        </Link>

                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={isOnSale ? 'price price-sale' : 'price'}>
                                                {formatPrice(price)}
                                            </span>
                                            {isOnSale && (
                                                <span className="price price-compare text-sm">
                                                    {formatPrice(compareAtPrice)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Add to Cart / View Product */}
                                        <Link
                                            href={`/products/${product.slug}`}
                                            className="brutal-btn brutal-btn-dark w-full mt-4 text-sm"
                                        >
                                            {!product.inStock ? (
                                                'Out of Stock'
                                            ) : (
                                                <>
                                                    <ShoppingBag className="w-4 h-4" />
                                                    View Product
                                                </>
                                            )}
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
