'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Tag,
    Menu,
    X,
    LogOut,
    ChevronRight,
    Store,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/discounts', label: 'Discounts', icon: Tag },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, user, logout, isLoading } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login?redirect=/admin');
            return;
        }

        // Check role - only ADMIN and STAFF can access
        if (!isLoading && user && user.role !== 'ADMIN' && user.role !== 'STAFF') {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, user, router]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="animate-pulse text-2xl font-black">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'STAFF')) {
        return null;
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black text-white z-50 flex items-center justify-between px-4 border-b-4 border-yellow-400">
                <button onClick={() => setSidebarOpen(true)} className="p-2">
                    <Menu className="w-6 h-6" />
                </button>
                <span className="font-black text-lg">Admin</span>
                <div className="w-10" />
            </header>

            {/* Mobile Sidebar Backdrop */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 bottom-0 w-64 bg-black text-white z-50 transition-transform lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
                    <Link href="/admin" className="flex items-center gap-2">
                        <Store className="w-6 h-6 text-yellow-400" />
                        <span className="font-black text-lg">BRUTALIST</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname?.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors',
                                    isActive
                                        ? 'bg-yellow-400 text-black'
                                        : 'hover:bg-gray-800 text-gray-300'
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-yellow-400 text-black rounded-full flex items-center justify-center font-black">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold truncate">{user?.name}</p>
                            <p className="text-xs text-gray-400">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                    <Link
                        href="/"
                        className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors mt-1"
                    >
                        <Store className="w-4 h-4" />
                        View Store
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
