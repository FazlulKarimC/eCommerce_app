'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ChevronRight,
    Heart,
    Minus,
    Plus,
    Star,
    Truck,
    RotateCcw,
    Shield,
    ChevronDown,
    ShoppingBag,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useProduct, useProductReviews, useProducts, useCheckWishlist, useAddToWishlist, useRemoveFromWishlist } from '@/lib/hooks';
import { useCartStore } from '@/lib/cart';
import { formatPrice, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import type { ProductVariant } from '@/lib/types';

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const { data: product, isLoading, error } = useProduct(slug);
    const { data: reviewsData } = useProductReviews(product?.id || '');
    const { data: relatedData } = useProducts({ limit: 4 });
    const { addItem, isLoading: isAddingToCart } = useCartStore();

    // Wishlist hooks
    const { data: wishlistStatus } = useCheckWishlist(product?.id || '');
    const addToWishlist = useAddToWishlist();
    const removeFromWishlist = useRemoveFromWishlist();

    const isInWishlist = wishlistStatus?.inWishlist ?? false;
    const isWishlistLoading = addToWishlist.isPending || removeFromWishlist.isPending;

    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [openSection, setOpenSection] = useState<string | null>("description");

    // Set default variant when product loads
    useEffect(() => {
        if (product && product.variants.length > 0) {
            setSelectedVariant(product.variants[0]);

            // Set default options
            const defaultOptions: Record<string, string> = {};
            product.options.forEach((option) => {
                if (option.values.length > 0) {
                    defaultOptions[option.name] = option.values[0].value;
                }
            });
            setSelectedOptions(defaultOptions);
        }
    }, [product]);

    // Update selected variant when options change
    useEffect(() => {
        if (!product) return;

        const matchingVariant = product.variants.find((variant) => {
            if (product.options.length === 0) return true;

            const variantOptions = variant.optionValues.map(
                (ov) => `${ov.optionValue.option.name}:${ov.optionValue.value}`
            );

            return Object.entries(selectedOptions).every(([name, value]) =>
                variantOptions.includes(`${name}:${value}`)
            );
        });

        if (matchingVariant) {
            setSelectedVariant(matchingVariant);
            // Clamp quantity to new variant's stock to prevent exceeding available inventory
            setQuantity(prev => Math.min(prev, matchingVariant.inventoryQty || 1));
        }
    }, [selectedOptions, product]);

    const handleAddToCart = async () => {
        if (!selectedVariant) return;

        try {
            await addItem(selectedVariant.id, quantity);
            toast.success('Added to cart!', {
                description: product?.title,
                icon: '🛒',
            });
        } catch (error) {
            console.error('Failed to add to cart:', error);
            toast.error('Failed to add to cart', {
                description: 'Please try again',
            });
        }
    };

    const handleWishlistToggle = async () => {
        if (!product) return;

        try {
            if (isInWishlist) {
                await removeFromWishlist.mutateAsync(product.id);
                toast.success('Removed from wishlist', {
                    description: product.title,
                    icon: '💔',
                });
            } else {
                await addToWishlist.mutateAsync(product.id);
                toast.success('Added to wishlist!', {
                    description: product.title,
                    icon: '❤️',
                });
            }
        } catch (error) {
            console.error('Failed to update wishlist:', error);
            toast.error('Please sign in', {
                description: 'You need to be logged in to save items',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA]">
                <main className="container mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="aspect-square bg-gray-200 border-4 border-black rounded-xl animate-pulse" />
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-200 w-3/4 rounded animate-pulse" />
                            <div className="h-6 bg-gray-200 w-1/4 rounded animate-pulse" />
                            <div className="h-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-[#FAFAFA]">
                <main className="container mx-auto px-4 py-20 text-center">
                    <ShoppingBag className="w-20 h-20 mx-auto text-gray-400 mb-6" />
                    <h1 className="text-4xl font-black">Product Not Found</h1>
                    <p className="text-gray-600 mt-2">
                        The product you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <Link href="/products" className="inline-block mt-8">
                        <Button className="bg-black text-white font-bold border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#FACC15] hover:shadow-[8px_8px_0px_0px_#FACC15] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                            Back to Products
                        </Button>
                    </Link>
                </main>
            </div>
        );
    }

    const price = selectedVariant?.price ? parseFloat(String(selectedVariant.price)) : 0;
    const compareAtPrice = selectedVariant?.compareAtPrice
        ? parseFloat(String(selectedVariant.compareAtPrice))
        : null;
    const isOnSale = compareAtPrice && compareAtPrice > price;
    const discountPercent = isOnSale
        ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
        : 0;
    const inStock = selectedVariant ? selectedVariant.inventoryQty > 0 : false;

    const relatedProducts = relatedData?.products.filter(p => p.id !== product.id).slice(0, 4) || [];

    // Get color mapping for visual display
    const getColorHex = (colorName: string) => {
        const colors: Record<string, string> = {
            white: '#FFFFFF',
            black: '#000000',
            yellow: '#FACC15',
            red: '#EF4444',
            blue: '#2196F3',
            navy: '#1a237e',
            green: '#4CAF50',
            olive: '#556B2F',
            silver: '#C0C0C0',
            gray: '#9E9E9E',
            grey: '#9E9E9E',
            indigo: '#3F51B5',
            purple: '#9C27B0',
            pink: '#E91E63',
            orange: '#FF9800',
            brown: '#795548',
            beige: '#F5F5DC',
        };
        return colors[colorName.toLowerCase()] || '#000000';
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <main className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm mb-8">
                    <Link href="/" className="text-gray-500 hover:text-black transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <Link href="/products" className="text-gray-500 hover:text-black transition-colors">
                        Products
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="font-bold text-black">{product.title}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-12 mb-20">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-white border-4 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_#000]">
                            {product.featured && (
                                <span className="absolute top-4 left-4 z-10 bg-[#FACC15] text-black font-mono text-xs font-bold px-3 py-1 border-2 border-black rounded-lg -rotate-3 shadow-[2px_2px_0px_0px_#000]">
                                    NEW
                                </span>
                            )}
                            {isOnSale && (
                                <span className="absolute top-4 right-4 z-10 bg-[#EF4444] text-white font-mono text-xs font-bold px-3 py-1 border-2 border-black rounded-lg rotate-3 shadow-[2px_2px_0px_0px_#000]">
                                    -{discountPercent}%
                                </span>
                            )}
                            {product.images.length > 0 ? (
                                <Image
                                    src={product.images[currentImageIndex]?.url || '/placeholder.svg'}
                                    alt={product.images[currentImageIndex]?.alt || product.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <ShoppingBag className="w-24 h-24 text-gray-300" />
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex gap-3">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`relative w-20 h-20 border-4 rounded-lg overflow-hidden transition-all ${currentImageIndex === idx
                                            ? "border-black shadow-[4px_4px_0px_0px_#FACC15] -translate-x-0.5 -translate-y-0.5"
                                            : "border-gray-300 hover:border-black"
                                            }`}
                                    >
                                        <Image
                                            src={img.url}
                                            alt={img.alt || `${product.title} view ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase mb-2">{product.title}</h1>
                            <div className="h-1.5 w-24 bg-black rounded-full" />
                        </div>

                        {/* Rating */}
                        {reviewsData?.stats && reviewsData.stats.totalReviews > 0 && (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.round(reviewsData.stats.averageRating)
                                                ? "fill-[#FACC15] text-[#FACC15]"
                                                : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="font-bold">{reviewsData.stats.averageRating.toFixed(1)}</span>
                                <span className="text-gray-500">({reviewsData.stats.totalReviews} reviews)</span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black">{formatPrice(price)}</span>
                            {isOnSale && compareAtPrice && (
                                <>
                                    <span className="text-2xl text-gray-400 line-through">
                                        {formatPrice(compareAtPrice)}
                                    </span>
                                    <span className="bg-[#EF4444] text-white font-mono text-sm font-bold px-3 py-1 border-2 border-black rounded-lg">
                                        SAVE {formatPrice(compareAtPrice - price)}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        {product.shortDescription && (
                            <p className="text-gray-600 leading-relaxed">
                                {product.shortDescription}
                            </p>
                        )}

                        {/* Options (Color, Size, etc.) */}
                        {product.options.map((option) => {
                            const isColorOption = option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('colour');

                            return (
                                <div key={option.id}>
                                    <h3 className="font-mono text-sm font-bold uppercase tracking-wider mb-3">
                                        {option.name}: <span className="text-gray-600">{selectedOptions[option.name]}</span>
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {isColorOption ? (
                                            // Color selector with visual swatches
                                            option.values.map((value) => (
                                                <button
                                                    key={value.id}
                                                    onClick={() => setSelectedOptions((prev) => ({
                                                        ...prev,
                                                        [option.name]: value.value,
                                                    }))}
                                                    className={`w-12 h-12 rounded-full border-4 transition-all ${selectedOptions[option.name] === value.value
                                                        ? "border-black shadow-[3px_3px_0px_0px_#000] -translate-x-0.5 -translate-y-0.5"
                                                        : "border-gray-300 hover:border-black"
                                                        }`}
                                                    style={{ backgroundColor: getColorHex(value.value) }}
                                                    title={value.value}
                                                />
                                            ))
                                        ) : (
                                            // Size/other selector with buttons
                                            option.values.map((value) => (
                                                <button
                                                    key={value.id}
                                                    onClick={() => setSelectedOptions((prev) => ({
                                                        ...prev,
                                                        [option.name]: value.value,
                                                    }))}
                                                    className={`min-w-[48px] px-4 py-2 font-bold border-4 border-black rounded-lg transition-all ${selectedOptions[option.name] === value.value
                                                        ? "bg-black text-white shadow-[4px_4px_0px_0px_#FACC15] -translate-x-0.5 -translate-y-0.5"
                                                        : "bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_#000]"
                                                        }`}
                                                >
                                                    {value.value}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Quantity */}
                        <div>
                            <h3 className="font-mono text-sm font-bold uppercase tracking-wider mb-3">Quantity</h3>
                            <div className="inline-flex items-center border-4 border-black rounded-lg overflow-hidden shadow-[4px_4px_0px_0px_#000]">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="w-12 h-12 flex items-center justify-center bg-white hover:bg-gray-100 transition-colors border-r-4 border-black"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="w-16 h-12 flex items-center justify-center font-bold text-lg bg-white">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity((q) =>
                                        selectedVariant ? Math.min(selectedVariant.inventoryQty, q + 1) : q + 1
                                    )}
                                    disabled={Boolean(selectedVariant && quantity >= selectedVariant.inventoryQty)}
                                    className="w-12 h-12 flex items-center justify-center bg-white hover:bg-gray-100 transition-colors border-l-4 border-black disabled:opacity-50"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            {selectedVariant && selectedVariant.inventoryQty <= 10 && selectedVariant.inventoryQty > 0 && (
                                <p className="text-sm text-[#EF4444] mt-2 font-bold">
                                    Only {selectedVariant.inventoryQty} left in stock!
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                onClick={handleAddToCart}
                                disabled={!inStock || isAddingToCart}
                                className="flex-1 h-14 bg-[#FACC15] text-black font-black text-lg uppercase border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                            >
                                {!inStock ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Cart'}
                            </Button>
                            <Button
                                onClick={handleWishlistToggle}
                                disabled={isWishlistLoading}
                                variant="outline"
                                className={cn(
                                    "h-14 px-6 font-bold border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all",
                                    isInWishlist
                                        ? "bg-[#EF4444] text-white hover:bg-[#EF4444]/90"
                                        : "bg-white hover:bg-[#FACC15]"
                                )}
                            >
                                {isWishlistLoading ? (
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                ) : (
                                    <Heart className={cn("w-5 h-5 mr-2", isInWishlist && "fill-current")} />
                                )}
                                {isInWishlist ? 'Saved' : 'Wishlist'}
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t-4 border-black mt-6">
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto mb-2 bg-[#FACC15] border-4 border-black rounded-lg flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <p className="font-bold text-xs uppercase">Free Shipping</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto mb-2 bg-[#FACC15] border-4 border-black rounded-lg flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                                    <RotateCcw className="w-6 h-6" />
                                </div>
                                <p className="font-bold text-xs uppercase">30-Day Returns</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto mb-2 bg-[#FACC15] border-4 border-black rounded-lg flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <p className="font-bold text-xs uppercase">Secure Payment</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Accordion */}
                <div className="mb-20">
                    <div className="bg-white border-4 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_#000]">
                        {/* Description */}
                        <div className="border-b-4 border-black">
                            <button
                                onClick={() => setOpenSection(openSection === "description" ? null : "description")}
                                className="w-full flex items-center justify-between p-6 font-black text-lg uppercase hover:bg-gray-50 transition-colors"
                            >
                                Description
                                <ChevronDown
                                    className={`w-6 h-6 transition-transform ${openSection === "description" ? "rotate-180" : ""}`}
                                />
                            </button>
                            {openSection === "description" && (
                                <div className="px-6 pb-6">
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {product.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Shipping */}
                        <div>
                            <button
                                onClick={() => setOpenSection(openSection === "shipping" ? null : "shipping")}
                                className="w-full flex items-center justify-between p-6 font-black text-lg uppercase hover:bg-gray-50 transition-colors"
                            >
                                Shipping & Returns
                                <ChevronDown
                                    className={`w-6 h-6 transition-transform ${openSection === "shipping" ? "rotate-180" : ""}`}
                                />
                            </button>
                            {openSection === "shipping" && (
                                <div className="px-6 pb-6">
                                    <p className="text-gray-600 leading-relaxed">
                                        Free standard shipping on all orders over $100. Express shipping available at checkout.
                                        30-day hassle-free returns on all unworn items in original packaging.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <span className="inline-block bg-[#EF4444] text-white font-mono text-sm font-bold px-4 py-2 border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] -rotate-2">
                                MORE
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black uppercase">You May Also Like</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
