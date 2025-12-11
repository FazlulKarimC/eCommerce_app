'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/cart';
import { formatPrice, cn } from '@/lib/utils';

export default function CartPage() {
  const { cart, isLoading, updateItemQuantity, removeItem } = useCartStore();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="w-20 h-20 mx-auto text-(--brutal-gray-400) mb-6" />
        <h1 className="text-4xl font-black">Your Cart is Empty</h1>
        <p className="text-(--brutal-gray-600) mt-2 text-lg">
          Add some items to get started
        </p>
        <Link href="/products" className="brutal-btn brutal-btn-dark mt-8 inline-flex">
          Start Shopping
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container">
        <h1 className="text-4xl md:text-5xl font-black mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="brutal-card p-6 flex gap-6"
              >
                {/* Image */}
                <Link
                  href={`/products/${item.product.slug}`}
                  className="w-28 h-28 shrink-0 border-2 border-(--brutal-black) overflow-hidden relative"
                >
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-(--brutal-gray-100)">
                      <ShoppingBag className="w-10 h-10 text-(--brutal-gray-400)" />
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-bold text-lg hover:text-(--brutal-red) transition-colors"
                      >
                        {item.product.title}
                      </Link>
                      {item.variant.title !== 'Default' && (
                        <p className="text-(--brutal-gray-600) mt-1">
                          {item.variant.options.map((o) => o.value).join(' / ')}
                        </p>
                      )}
                      {item.variant.sku && (
                        <p className="text-sm text-(--brutal-gray-500)">
                          SKU: {item.variant.sku}
                        </p>
                      )}
                    </div>
                    <p className="font-bold text-lg whitespace-nowrap">
                      {formatPrice(item.lineTotal)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity */}
                    <div className="flex items-center border-2 border-(--brutal-black)">
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-(--brutal-gray-100)"
                        disabled={isLoading}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-(--brutal-gray-100)"
                        disabled={isLoading || item.quantity >= item.variant.inventoryQty}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-2 text-(--brutal-red) font-bold hover:underline"
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="brutal-card p-6 sticky top-24">
              <h2 className="text-xl font-black mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-(--brutal-gray-600)">
                    Subtotal ({cart.itemCount} items)
                  </span>
                  <span className="font-bold">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--brutal-gray-600)">Shipping</span>
                  <span className="text-(--brutal-gray-500)">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--brutal-gray-600)">Tax</span>
                  <span className="text-(--brutal-gray-500)">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t-2 border-(--brutal-gray-200) mt-6 pt-6">
                <div className="flex justify-between text-xl">
                  <span className="font-bold">Estimated Total</span>
                  <span className="font-black">{formatPrice(cart.subtotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="brutal-btn brutal-btn-primary w-full mt-6"
              >
                Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/products"
                className="brutal-btn w-full mt-4"
              >
                Continue Shopping
              </Link>

              <p className="text-sm text-center text-(--brutal-gray-600) mt-6">
                Free shipping on orders over $75
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
