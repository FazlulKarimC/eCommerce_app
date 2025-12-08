'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
    ShoppingBag,
    User,
    Menu,
    X,
    Search,
    Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth';
import { useCartStore } from '@/lib/cart';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/collections', label: 'Collections' },
    { href: '/products', label: 'Shop All' },
    { href: '/sale', label: 'Sale', highlight: true },
];

export function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const { user, isAuthenticated } = useAuthStore();
    const { cart, toggleCart } = useCartStore();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
                isScrolled
                    ? 'bg-[var(--brutal-white)] shadow-[0_3px_0_var(--brutal-black)]'
                    : 'bg-transparent'
            )}
        >
            <div className="container">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-2xl font-black tracking-tight hover:text-[var(--brutal-red)] transition-colors"
                    >
                        BRUTALIST
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-sm font-bold uppercase tracking-wider relative py-1',
                                    'hover:text-[var(--brutal-red)] transition-colors',
                                    pathname === link.href && 'text-[var(--brutal-red)]',
                                    link.highlight && 'text-[var(--brutal-red)]'
                                )}
                            >
                                {link.label}
                                {pathname === link.href && (
                                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--brutal-red)]" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <button
                            className="p-2 hover:bg-[var(--brutal-gray-100)] transition-colors"
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Wishlist */}
                        {isAuthenticated && (
                            <Link
                                href="/wishlist"
                                className="p-2 hover:bg-[var(--brutal-gray-100)] transition-colors"
                                aria-label="Wishlist"
                            >
                                <Heart className="w-5 h-5" />
                            </Link>
                        )}

                        {/* Account */}
                        <Link
                            href={isAuthenticated ? '/account' : '/auth/login'}
                            className="p-2 hover:bg-[var(--brutal-gray-100)] transition-colors"
                            aria-label="Account"
                        >
                            <User className="w-5 h-5" />
                        </Link>

                        {/* Cart */}
                        <button
                            onClick={toggleCart}
                            className="relative p-2 hover:bg-[var(--brutal-gray-100)] transition-colors"
                            aria-label="Cart"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {cart && cart.itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--brutal-red)] text-white text-xs font-bold flex items-center justify-center">
                                    {cart.itemCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 hover:bg-[var(--brutal-gray-100)] transition-colors"
                            aria-label="Menu"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--brutal-white)] border-b-4 border-[var(--brutal-black)]">
                        <nav className="container py-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'text-lg font-bold uppercase tracking-wider py-2',
                                        'hover:text-[var(--brutal-red)] transition-colors',
                                        pathname === link.href && 'text-[var(--brutal-red)]',
                                        link.highlight && 'text-[var(--brutal-red)]'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="h-px bg-[var(--brutal-gray-300)] my-2" />
                            {isAuthenticated ? (
                                <>
                                    <Link href="/account" className="text-lg font-bold py-2">
                                        My Account
                                    </Link>
                                    <Link href="/orders" className="text-lg font-bold py-2">
                                        My Orders
                                    </Link>
                                </>
                            ) : (
                                <Link href="/auth/login" className="text-lg font-bold py-2">
                                    Sign In
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
