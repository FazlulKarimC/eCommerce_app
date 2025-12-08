'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    Minus,
    Plus,
    ShoppingBag,
    Truck,
    RefreshCw,
    Shield
} from 'lucide-react';
import { useProduct, useProductReviews } from '@/lib/hooks';
import { useCartStore } from '@/lib/cart';
import { formatPrice, cn } from '@/lib/utils';
import type { ProductVariant } from '@/lib/types';

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const { data: product, isLoading, error } = useProduct(slug);
    const { data: reviewsData } = useProductReviews(product?.id || '');
    const { addItem, isLoading: isAddingToCart } = useCartStore();

    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

        // Find variant that matches selected options
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
        }
    }, [selectedOptions, product]);

    const handleAddToCart = async () => {
        if (!selectedVariant) return;

        try {
            await addItem(selectedVariant.id, quantity);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="container py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="brutal-card aspect-square animate-pulse bg-[var(--brutal-gray-200)]" />
                    <div className="space-y-4">
                        <div className="h-8 bg-[var(--brutal-gray-200)] w-3/4 animate-pulse" />
                        <div className="h-6 bg-[var(--brutal-gray-200)] w-1/4 animate-pulse" />
                        <div className="h-24 bg-[var(--brutal-gray-200)] animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-4xl font-black">Product Not Found</h1>
                <p className="text-[var(--brutal-gray-600)] mt-2">
                    The product you're looking for doesn't exist.
                </p>
                <Link href="/products" className="brutal-btn brutal-btn-dark mt-6 inline-flex">
                    Back to Products
                </Link>
            </div>
        );
    }

    const price = selectedVariant?.price ? parseFloat(String(selectedVariant.price)) : 0;
    const compareAtPrice = selectedVariant?.compareAtPrice
        ? parseFloat(String(selectedVariant.compareAtPrice))
        : null;
    const isOnSale = compareAtPrice && compareAtPrice > price;
    const inStock = selectedVariant ? selectedVariant.inventoryQty > 0 : false;

    return (
        <div className="py-8">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <ol className="flex items-center gap-2 text-sm">
                        <li>
                            <Link href="/" className="hover:text-[var(--brutal-red)]">Home</Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link href="/products" className="hover:text-[var(--brutal-red)]">Products</Link>
                        </li>
                        <li>/</li>
                        <li className="text-[var(--brutal-gray-600)]">{product.title}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="brutal-card relative aspect-square overflow-hidden">
                            {product.images.length > 0 ? (
                                <>
                                    <Image
                                        src={product.images[currentImageIndex].url}
                                        alt={product.images[currentImageIndex].alt || product.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />

                                    {/* Navigation arrows */}
                                    {product.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setCurrentImageIndex((i) =>
                                                    i === 0 ? product.images.length - 1 : i - 1
                                                )}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-[var(--brutal-black)] flex items-center justify-center hover:bg-[var(--brutal-gray-100)]"
                                                aria-label="Previous image"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => setCurrentImageIndex((i) =>
                                                    i === product.images.length - 1 ? 0 : i + 1
                                                )}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-[var(--brutal-black)] flex items-center justify-center hover:bg-[var(--brutal-gray-100)]"
                                                aria-label="Next image"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[var(--brutal-gray-100)]">
                                    <ShoppingBag className="w-24 h-24 text-[var(--brutal-gray-300)]" />
                                </div>
                            )}

                            {/* Sale Badge */}
                            {isOnSale && (
                                <span className="absolute top-4 left-4 brutal-badge brutal-badge-red">
                                    Sale
                                </span>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                {product.images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={cn(
                                            'w-20 h-20 flex-shrink-0 border-2 overflow-hidden',
                                            currentImageIndex === index
                                                ? 'border-[var(--brutal-black)]'
                                                : 'border-[var(--brutal-gray-300)] hover:border-[var(--brutal-black)]'
                                        )}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={image.alt || `${product.title} thumbnail ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        {/* Title & Price */}
                        <h1 className="text-3xl md:text-4xl font-black">{product.title}</h1>

                        <div className="flex items-center gap-3 mt-4">
                            <span className={cn('price text-2xl', isOnSale && 'price-sale')}>
                                {formatPrice(price)}
                            </span>
                            {isOnSale && (
                                <span className="price price-compare text-lg">
                                    {formatPrice(compareAtPrice!)}
                                </span>
                            )}
                        </div>

                        {/* Reviews Summary */}
                        {reviewsData?.stats && reviewsData.stats.totalReviews > 0 && (
                            <div className="flex items-center gap-2 mt-4">
                                <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span
                                            key={i}
                                            className={cn(
                                                'text-xl',
                                                i < Math.round(reviewsData.stats.averageRating)
                                                    ? 'text-[var(--brutal-yellow)]'
                                                    : 'text-[var(--brutal-gray-300)]'
                                            )}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="text-[var(--brutal-gray-600)]">
                                    ({reviewsData.stats.totalReviews} reviews)
                                </span>
                            </div>
                        )}

                        <p className="text-[var(--brutal-gray-700)] mt-6 text-lg leading-relaxed">
                            {product.shortDescription || product.description.slice(0, 200)}
                        </p>

                        {/* Options */}
                        {product.options.map((option) => (
                            <div key={option.id} className="mt-6">
                                <label className="font-bold uppercase tracking-wider text-sm">
                                    {option.name}
                                </label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {option.values.map((value) => (
                                        <button
                                            key={value.id}
                                            onClick={() => setSelectedOptions((prev) => ({
                                                ...prev,
                                                [option.name]: value.value,
                                            }))}
                                            className={cn(
                                                'px-4 py-2 border-2 font-medium transition-colors',
                                                selectedOptions[option.name] === value.value
                                                    ? 'border-[var(--brutal-black)] bg-[var(--brutal-black)] text-white'
                                                    : 'border-[var(--brutal-gray-300)] hover:border-[var(--brutal-black)]'
                                            )}
                                        >
                                            {value.value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Quantity */}
                        <div className="mt-6">
                            <label className="font-bold uppercase tracking-wider text-sm">
                                Quantity
                            </label>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center border-2 border-[var(--brutal-black)]">
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="p-3 hover:bg-[var(--brutal-gray-100)]"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-bold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity((q) =>
                                            selectedVariant ? Math.min(selectedVariant.inventoryQty, q + 1) : q + 1
                                        )}
                                        className="p-3 hover:bg-[var(--brutal-gray-100)]"
                                        aria-label="Increase quantity"
                                        disabled={!!selectedVariant && quantity >= selectedVariant.inventoryQty}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                {selectedVariant && selectedVariant.inventoryQty <= 10 && (
                                    <span className="text-sm text-[var(--brutal-red)]">
                                        Only {selectedVariant.inventoryQty} left
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={handleAddToCart}
                                disabled={!inStock || isAddingToCart}
                                className="brutal-btn brutal-btn-primary flex-1"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {!inStock ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Cart'}
                            </button>
                            <button
                                className="brutal-btn"
                                aria-label="Add to wishlist"
                            >
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t-2 border-[var(--brutal-gray-200)]">
                            <div className="flex items-center gap-3">
                                <Truck className="w-6 h-6 text-[var(--brutal-gray-600)]" />
                                <span className="text-sm">Free shipping over $75</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <RefreshCw className="w-6 h-6 text-[var(--brutal-gray-600)]" />
                                <span className="text-sm">30-day returns</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Shield className="w-6 h-6 text-[var(--brutal-gray-600)]" />
                                <span className="text-sm">Secure payment</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-8 pt-8 border-t-2 border-[var(--brutal-gray-200)]">
                            <h2 className="font-bold uppercase tracking-wider mb-4">Description</h2>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-[var(--brutal-gray-700)] whitespace-pre-wrap">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
