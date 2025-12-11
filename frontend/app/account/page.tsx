'use client';

import Link from 'next/link';
import { Package, Heart, MapPin, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { useMyOrders, useWishlist } from '@/lib/hooks';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';

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
            <Card shadow="md" className="bg-yellow-400">
                <CardContent className="p-6">
                    <h2 className="text-2xl font-black">Welcome back, {user?.name}!</h2>
                    <p className="mt-1">
                        Manage your orders, addresses, and wishlist from your account dashboard.
                    </p>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/account/orders">
                    <Card shadow="md" hover="liftSm" className="group cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <Package className="w-8 h-8 text-gray-500" />
                                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-3xl font-black mt-4">{totalOrders}</p>
                            <p className="text-gray-600">Total Orders</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/account/wishlist">
                    <Card shadow="md" hover="liftSm" className="group cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <Heart className="w-8 h-8 text-gray-500" />
                                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-3xl font-black mt-4">{wishlistCount}</p>
                            <p className="text-gray-600">Wishlist Items</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/account/addresses">
                    <Card shadow="md" hover="liftSm" className="group cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <MapPin className="w-8 h-8 text-gray-500" />
                                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-3xl font-black mt-4">-</p>
                            <p className="text-gray-600">Saved Addresses</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Recent Orders */}
            <Card shadow="md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Orders</CardTitle>
                    <Link href="/account/orders" className="text-sm font-bold text-red-500 hover:underline">
                        View All
                    </Link>
                </CardHeader>

                {recentOrders.length === 0 ? (
                    <CardContent className="p-8 text-center">
                        <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p className="font-bold">No orders yet</p>
                        <p className="text-gray-600 text-sm mt-1">
                            When you place an order, it will appear here
                        </p>
                        <Button asChild variant="secondary" className="mt-4">
                            <Link href="/products">Start Shopping</Link>
                        </Button>
                    </CardContent>
                ) : (
                    <div className="divide-y-4 divide-black">
                        {recentOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/account/orders/${order.id}`}
                                className="flex items-center justify-between p-6 hover:bg-yellow-50 transition-colors"
                            >
                                <div>
                                    <p className="font-black">#{order.orderNumber}</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{formatPrice(order.total)}</p>
                                    <Badge
                                        variant={
                                            order.status === 'DELIVERED' ? 'delivered' :
                                                order.status === 'SHIPPED' ? 'shipped' :
                                                    order.status === 'CANCELLED' ? 'cancelled' :
                                                        'pending'
                                        }
                                        size="sm"
                                    >
                                        {order.status}
                                    </Badge>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
