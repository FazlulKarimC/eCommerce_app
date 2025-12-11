'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, Loader2 } from 'lucide-react';
import { useWishlist, useRemoveFromWishlist } from '@/lib/hooks';
import { useCartStore } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, SkeletonCard } from '@/components/ui';

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
            <Card shadow="md">
                <CardHeader>
                    <CardTitle className="text-2xl">My Wishlist</CardTitle>
                    <p className="text-gray-600 mt-1">
                        {wishlist?.length || 0} items saved for later
                    </p>
                </CardHeader>

                {isLoading ? (
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    </CardContent>
                ) : !wishlist || wishlist.length === 0 ? (
                    <CardContent className="p-12 text-center">
                        <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-black">Your Wishlist is Empty</h3>
                        <p className="text-gray-600 mt-2">
                            Save items you love to your wishlist
                        </p>
                        <Button asChild className="mt-6">
                            <Link href="/products">Browse Products</Link>
                        </Button>
                    </CardContent>
                ) : (
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {wishlist.map((item) => {
                                const product = item.product;
                                const price = product.price || 0;
                                const compareAtPrice = product.compareAtPrice;
                                const isOnSale = compareAtPrice && compareAtPrice > price;

                                return (
                                    <Card key={item.id} shadow="sm" hover="liftSm" className="overflow-hidden group">
                                        {/* Image */}
                                        <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-gray-100">
                                            {product.image ? (
                                                <Image
                                                    src={product.image}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="w-12 h-12 text-gray-300" />
                                                </div>
                                            )}

                                            {/* Sale Badge */}
                                            {isOnSale && (
                                                <Badge variant="sale" className="absolute top-2 left-2">
                                                    Sale
                                                </Badge>
                                            )}

                                            {/* Remove Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleRemove(product.id);
                                                }}
                                                disabled={removing === product.id}
                                                className="absolute top-2 right-2 w-8 h-8 bg-white border-4 border-black rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-[2px_2px_0px_#000]"
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
                                        <CardContent className="p-4">
                                            <Link href={`/products/${product.slug}`}>
                                                <h3 className="font-bold line-clamp-1 hover:text-red-500 transition-colors">
                                                    {product.title}
                                                </h3>
                                            </Link>

                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={isOnSale ? 'font-black text-red-500' : 'font-black'}>
                                                    {formatPrice(price)}
                                                </span>
                                                {isOnSale && (
                                                    <span className="text-gray-400 line-through text-sm">
                                                        {formatPrice(compareAtPrice)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* View Product Button */}
                                            <Button asChild variant="secondary" className="w-full mt-4" size="sm">
                                                <Link href={`/products/${product.slug}`}>
                                                    {!product.inStock ? (
                                                        'Out of Stock'
                                                    ) : (
                                                        <>
                                                            <ShoppingBag className="w-4 h-4" />
                                                            View Product
                                                        </>
                                                    )}
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
