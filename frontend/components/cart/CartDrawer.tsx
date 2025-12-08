'use client';

import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function CartDrawer() {
    const { cart, isOpen, isLoading, setIsOpen, updateItemQuantity, removeItem } = useCartStore();

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--brutal-white)] z-50 flex flex-col border-l-[var(--border-width-thick)] border-[var(--brutal-black)] shadow-[var(--shadow-xl)]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b-4 border-[var(--brutal-black)]">
                    <h2 className="text-xl font-black uppercase">Your Cart</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-[var(--brutal-gray-100)] transition-colors"
                        aria-label="Close cart"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {!cart || cart.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingBag className="w-16 h-16 text-[var(--brutal-gray-400)] mb-4" />
                            <p className="text-lg font-bold">Your cart is empty</p>
                            <p className="text-[var(--brutal-gray-500)] mt-1">
                                Add some items to get started
                            </p>
                            <Link
                                href="/products"
                                onClick={() => setIsOpen(false)}
                                className="brutal-btn brutal-btn-dark mt-6"
                            >
                                Shop Now
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="brutal-card p-4 flex gap-4"
                                >
                                    {/* Image */}
                                    <div className="w-20 h-20 bg-[var(--brutal-gray-100)] border-2 border-[var(--brutal-black)] flex-shrink-0 relative overflow-hidden">
                                        {item.product.image ? (
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-8 h-8 text-[var(--brutal-gray-400)]" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/products/${item.product.slug}`}
                                            onClick={() => setIsOpen(false)}
                                            className="font-bold text-sm hover:text-[var(--brutal-red)] transition-colors line-clamp-1"
                                        >
                                            {item.product.title}
                                        </Link>
                                        <p className="text-xs text-[var(--brutal-gray-600)] mt-0.5">
                                            {item.variant.title !== 'Default' && item.variant.title}
                                        </p>
                                        <p className="font-bold mt-1">
                                            {formatPrice(item.variant.price)}
                                        </p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex items-center border-2 border-[var(--brutal-black)]">
                                                <button
                                                    onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 hover:bg-[var(--brutal-gray-100)]"
                                                    disabled={isLoading}
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 hover:bg-[var(--brutal-gray-100)]"
                                                    disabled={isLoading || item.quantity >= item.variant.inventoryQty}
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-xs text-[var(--brutal-red)] font-bold hover:underline ml-auto"
                                                disabled={isLoading}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart && cart.items.length > 0 && (
                    <div className="border-t-4 border-[var(--brutal-black)] p-4 space-y-4">
                        <div className="flex items-center justify-between text-lg">
                            <span className="font-bold">Subtotal</span>
                            <span className="font-black">{formatPrice(cart.subtotal)}</span>
                        </div>
                        <p className="text-sm text-[var(--brutal-gray-600)]">
                            Shipping and taxes calculated at checkout
                        </p>
                        <Link
                            href="/checkout"
                            onClick={() => setIsOpen(false)}
                            className="brutal-btn brutal-btn-primary w-full"
                        >
                            Checkout
                        </Link>
                        <Link
                            href="/cart"
                            onClick={() => setIsOpen(false)}
                            className="brutal-btn w-full"
                        >
                            View Cart
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
