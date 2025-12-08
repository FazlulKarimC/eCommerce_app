'use client';

import Link from 'next/link';
import { Package, Heart, MapPin, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { useMyOrders, useWishlist } from '@/lib/hooks';
import { formatPrice } from '@/lib/utils';

export default function AccountOverviewPage() {
    const { user } = useAuthStore();
    const { data: ordersData } = useMyOrders({ limit: 3 });
    const { data: wishlistData } = useWishlist();

    const recentOrders = ordersData?.orders || [];
    const wishlistCount = wishlistData?.length || 0;
    const totalOrders = ordersData?.pagination?.total || 0;

    return (
        <div className="space-y-8">
            {/* Welcome Card */}
            <div className="brutal-card p-6 bg-[var(--brutal-yellow)]">
                <h2 className="text-2xl font-black">Welcome back, {user?.name}!</h2>
                <p className="mt-1">
                    Manage your orders, addresses, and wishlist from your account dashboard.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/account/orders" className="brutal-card p-6 hover:bg-[var(--brutal-gray-50)] transition-colors group">
                    <div className="flex items-center justify-between">
                        <Package className="w-8 h-8 text-[var(--brutal-gray-500)]" />
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-3xl font-black mt-4">{totalOrders}</p>
                    <p className="text-[var(--brutal-gray-600)]">Total Orders</p>
                </Link>

                <Link href="/account/wishlist" className="brutal-card p-6 hover:bg-[var(--brutal-gray-50)] transition-colors group">
                    <div className="flex items-center justify-between">
                        <Heart className="w-8 h-8 text-[var(--brutal-gray-500)]" />
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-3xl font-black mt-4">{wishlistCount}</p>
                    <p className="text-[var(--brutal-gray-600)]">Wishlist Items</p>
                </Link>

                <Link href="/account/addresses" className="brutal-card p-6 hover:bg-[var(--brutal-gray-50)] transition-colors group">
                    <div className="flex items-center justify-between">
                        <MapPin className="w-8 h-8 text-[var(--brutal-gray-500)]" />
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-3xl font-black mt-4">-</p>
                    <p className="text-[var(--brutal-gray-600)]">Saved Addresses</p>
                </Link>
            </div>

            {/* Recent Orders */}
            <div className="brutal-card">
                <div className="p-6 border-b-2 border-[var(--brutal-gray-200)]">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black">Recent Orders</h3>
                        <Link href="/account/orders" className="text-sm font-bold text-[var(--brutal-red)] hover:underline">
                            View All
                        </Link>
                    </div>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="p-8 text-center">
                        <Package className="w-12 h-12 mx-auto text-[var(--brutal-gray-300)] mb-4" />
                        <p className="font-bold">No orders yet</p>
                        <p className="text-[var(--brutal-gray-600)] text-sm mt-1">
                            When you place an order, it will appear here
                        </p>
                        <Link href="/products" className="brutal-btn brutal-btn-dark mt-4 inline-flex">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y-2 divide-[var(--brutal-gray-200)]">
                        {recentOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/account/orders/${order.id}`}
                                className="flex items-center justify-between p-6 hover:bg-[var(--brutal-gray-50)] transition-colors"
                            >
                                <div>
                                    <p className="font-bold">Order #{order.orderNumber}</p>
                                    <p className="text-sm text-[var(--brutal-gray-600)]">
                                        {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{formatPrice(order.total)}</p>
                                    <span className={`brutal-badge text-xs ${order.status === 'DELIVERED' ? 'brutal-badge-green' :
                                            order.status === 'SHIPPED' ? 'brutal-badge-blue' :
                                                order.status === 'CANCELLED' ? 'brutal-badge-red' :
                                                    ''
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
