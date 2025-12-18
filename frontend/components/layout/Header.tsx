'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
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
    { href: '/collections/sale', label: 'Sale', highlight: true },
];

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    const { isAuthenticated } = useAuthStore();
    const { cart, toggleCart } = useCartStore();

    // Focus input when search opens
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    // Handle search submit
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    // Close search on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
                setSearchQuery('');
            }
        };
        if (isSearchOpen) {
            window.addEventListener('keydown', handleEscape);
        }
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isSearchOpen]);

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
                'fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b-4',
                isScrolled
                    ? 'bg-white border-black shadow-[0_4px_0px_#000]'
                    : 'bg-transparent border-transparent'
            )}
        >
            <div className="container">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-2xl font-black tracking-tight hover:text-red-500 transition-colors"
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
                                    'hover:text-red-500 transition-colors',
                                    pathname === link.href && 'text-red-500',
                                    link.highlight && 'text-red-500'
                                )}
                            >
                                {link.label}
                                {pathname === link.href && (
                                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-red-500" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        {isSearchOpen ? (
                            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-40 md:w-64 h-9 px-3 bg-white border-2 border-black rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                                <button
                                    type="submit"
                                    className="p-2 bg-black text-white hover:bg-yellow-400 hover:text-black transition-colors rounded-lg"
                                    aria-label="Submit search"
                                >
                                    <Search className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSearchOpen(false);
                                        setSearchQuery('');
                                    }}
                                    className="p-2 hover:bg-yellow-400 transition-colors rounded-lg"
                                    aria-label="Close search"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 hover:bg-yellow-400 transition-colors rounded-lg"
                                aria-label="Open search"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        )}

                        {/* Wishlist */}
                        {isAuthenticated && (
                            <Link
                                href="/account/wishlist"
                                className="p-2 hover:bg-yellow-400 transition-colors rounded-lg"
                                aria-label="Wishlist"
                            >
                                <Heart className="w-5 h-5" />
                            </Link>
                        )}

                        {/* Account */}
                        <Link
                            href={isAuthenticated ? '/account' : '/auth/login'}
                            className="p-2 hover:bg-yellow-400 transition-colors rounded-lg"
                            aria-label="Account"
                        >
                            <User className="w-5 h-5" />
                        </Link>

                        {/* Cart */}
                        <button
                            onClick={toggleCart}
                            className="relative p-2 hover:bg-yellow-400 transition-colors rounded-lg"
                            aria-label="Cart"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {cart && cart.itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-black">
                                    {cart.itemCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 hover:bg-yellow-400 transition-colors rounded-lg"
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
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b-4 border-black shadow-[0_4px_0px_#000]">
                        <nav className="container py-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'text-lg font-bold uppercase tracking-wider py-2',
                                        'hover:text-red-500 transition-colors',
                                        pathname === link.href && 'text-red-500',
                                        link.highlight && 'text-red-500'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="h-px bg-gray-300 my-2" />
                            {isAuthenticated ? (
                                <>
                                    <Link href="/account" className="text-lg font-bold py-2 hover:text-red-500 transition-colors">
                                        My Account
                                    </Link>
                                    <Link href="/account/orders" className="text-lg font-bold py-2 hover:text-red-500 transition-colors">
                                        My Orders
                                    </Link>
                                </>
                            ) : (
                                <Link href="/auth/login" className="text-lg font-bold py-2 hover:text-red-500 transition-colors">
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
