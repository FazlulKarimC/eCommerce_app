'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, Package, MapPin, Heart, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/account', label: 'Overview', icon: User, exact: true },
    { href: '/account/orders', label: 'Orders', icon: Package },
    { href: '/account/addresses', label: 'Addresses', icon: MapPin },
    { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
];

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, user, logout, isLoading } = useAuthStore();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login?redirect=/account');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (isLoading) {
        return (
            <div className="container py-12">
                <div className="animate-pulse">
                    <div className="h-8 w-48 bg-[var(--brutal-gray-200)] mb-8" />
                    <div className="flex gap-8">
                        <div className="w-64 space-y-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-12 bg-[var(--brutal-gray-200)]" />
                            ))}
                        </div>
                        <div className="flex-1 h-96 bg-[var(--brutal-gray-200)]" />
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="py-8">
            <div className="container">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-black">My Account</h1>
                    <p className="text-[var(--brutal-gray-600)] mt-1">
                        Welcome back, {user?.name || 'Customer'}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <nav className="brutal-card p-4 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.exact
                                    ? pathname === item.href
                                    : pathname?.startsWith(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-3 font-medium transition-colors',
                                            isActive
                                                ? 'bg-[var(--brutal-black)] text-white'
                                                : 'hover:bg-[var(--brutal-gray-100)]'
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.label}
                                        <ChevronRight className={cn(
                                            'w-4 h-4 ml-auto transition-transform',
                                            isActive && 'rotate-90'
                                        )} />
                                    </Link>
                                );
                            })}

                            <hr className="my-4 border-[var(--brutal-gray-200)]" />

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 font-medium text-[var(--brutal-red)] hover:bg-[var(--brutal-gray-100)] w-full text-left"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
