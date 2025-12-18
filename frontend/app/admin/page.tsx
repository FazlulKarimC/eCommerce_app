'use client';

import Link from 'next/link';
import {
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    TrendingUp,
    ArrowRight,
    Clock
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    recentOrders: Array<{
        id: string;
        orderNumber: string;
        email: string;
        total: number;
        status: string;
        createdAt: string;
    }>;
}

function useDashboardStats() {
    return useQuery<DashboardStats>({
        queryKey: ['admin', 'dashboard'],
        queryFn: async () => {
            // Fetch stats from server-side aggregation endpoints
            const [statsRes, recentOrdersRes, customersRes, productsRes] = await Promise.all([
                api.get('/orders/stats'),           // Server-side aggregated revenue
                api.get('/orders/admin?limit=5'),   // Only recent 5 for display
                api.get('/customers?limit=1'),
                api.get('/products?limit=1'),
            ]);

            const recentOrders = recentOrdersRes.data.orders || [];
            const totalCustomers = customersRes.data.pagination?.total || 0;
            const totalProducts = productsRes.data.pagination?.total || 0;

            return {
                totalRevenue: statsRes.data.totalRevenue || 0,
                totalOrders: statsRes.data.totalOrders || 0,
                totalCustomers,
                totalProducts,
                recentOrders: recentOrders.slice(0, 5),
            };
        },
    });
}

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
};

export default function AdminDashboard() {
    const { data: stats, isLoading } = useDashboardStats();

    const statCards = [
        {
            title: 'Total Revenue',
            value: formatPrice(stats?.totalRevenue || 0),
            icon: DollarSign,
            color: 'bg-[var(--brutal-green)]',
            href: '/admin/orders',
        },
        {
            title: 'Orders',
            value: stats?.totalOrders || 0,
            icon: ShoppingCart,
            color: 'bg-[var(--brutal-blue)]',
            href: '/admin/orders',
        },
        {
            title: 'Customers',
            value: stats?.totalCustomers || 0,
            icon: Users,
            color: 'bg-[var(--brutal-purple)]',
            href: '/admin/customers',
        },
        {
            title: 'Products',
            value: stats?.totalProducts || 0,
            icon: Package,
            color: 'bg-[var(--brutal-orange)]',
            href: '/admin/products',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black">Dashboard</h1>
                    <p className="text-(--brutal-gray-600)">
                        Welcome back! Here's what's happening today.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/products/new" className="brutal-btn brutal-btn-primary">
                        <Package className="w-4 h-4" />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={stat.title}
                            href={stat.href}
                            className="brutal-card p-6 hover:translate-y-[-2px] transition-transform"
                        >
                            <div className="flex items-start justify-between">
                                <div className={`p-3 ${stat.color} text-white`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <TrendingUp className="w-4 h-4 text-(--brutal-green)" />
                            </div>
                            <div className="mt-4">
                                {isLoading ? (
                                    <div className="h-8 w-20 bg-(--brutal-gray-200) animate-pulse" />
                                ) : (
                                    <p className="text-3xl font-black">{stat.value}</p>
                                )}
                                <p className="text-(--brutal-gray-600) text-sm mt-1">
                                    {stat.title}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Recent Orders */}
            <div className="brutal-card">
                <div className="p-6 border-b-2 border-(--brutal-gray-200) flex items-center justify-between">
                    <h2 className="text-xl font-black">Recent Orders</h2>
                    <Link
                        href="/admin/orders"
                        className="text-sm font-bold text-(--brutal-red) hover:underline flex items-center gap-1"
                    >
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="p-6">
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-4 animate-pulse">
                                    <div className="w-24 h-5 bg-(--brutal-gray-200)" />
                                    <div className="w-48 h-5 bg-(--brutal-gray-200)" />
                                    <div className="w-20 h-5 bg-(--brutal-gray-200)" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : stats?.recentOrders.length === 0 ? (
                    <div className="p-12 text-center">
                        <ShoppingCart className="w-12 h-12 mx-auto text-(--brutal-gray-300) mb-4" />
                        <p className="font-bold">No orders yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-(--brutal-gray-100)">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider">
                                        Order
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-(--brutal-gray-200)">
                                {stats?.recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-(--brutal-gray-50)">
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="font-bold hover:text-(--brutal-red)"
                                            >
                                                #{order.orderNumber}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{order.email}</td>
                                        <td className="px-6 py-4 font-bold">{formatPrice(order.total)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded ${statusColors[order.status] || 'bg-gray-100'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-(--brutal-gray-600)">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/admin/products/new" className="brutal-card p-6 hover:bg-(--brutal-gray-50) transition-colors group">
                    <Package className="w-8 h-8 text-(--brutal-orange) mb-4" />
                    <h3 className="font-black group-hover:text-(--brutal-red)">Add Product</h3>
                    <p className="text-sm text-(--brutal-gray-600) mt-1">
                        Create a new product listing
                    </p>
                </Link>

                <Link href="/admin/discounts/new" className="brutal-card p-6 hover:bg-(--brutal-gray-50) transition-colors group">
                    <DollarSign className="w-8 h-8 text-(--brutal-green) mb-4" />
                    <h3 className="font-black group-hover:text-(--brutal-red)">Create Discount</h3>
                    <p className="text-sm text-(--brutal-gray-600) mt-1">
                        Set up a new discount code
                    </p>
                </Link>

                <Link href="/admin/orders" className="brutal-card p-6 hover:bg-(--brutal-gray-50) transition-colors group">
                    <ShoppingCart className="w-8 h-8 text-(--brutal-blue) mb-4" />
                    <h3 className="font-black group-hover:text-(--brutal-red)">Manage Orders</h3>
                    <p className="text-sm text-(--brutal-gray-600) mt-1">
                        View and update order statuses
                    </p>
                </Link>
            </div>
        </div>
    );
}
