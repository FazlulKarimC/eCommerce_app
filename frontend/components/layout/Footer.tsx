import Link from 'next/link';
import {
    Instagram,
    Twitter,
    Facebook,
    Mail
} from 'lucide-react';

const footerLinks = {
    shop: [
        { label: 'All Products', href: '/products' },
        { label: 'New Arrivals', href: '/collections/new-arrivals' },
        { label: 'Best Sellers', href: '/collections/best-sellers' },
        { label: 'Sale', href: '/sale' },
    ],
    help: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'Shipping & Returns', href: '/policies/shipping' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Size Guide', href: '/size-guide' },
    ],
    company: [
        { label: 'About Us', href: '/about' },
        { label: 'Sustainability', href: '/sustainability' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
    ],
    legal: [
        { label: 'Terms of Service', href: '/policies/terms' },
        { label: 'Privacy Policy', href: '/policies/privacy' },
        { label: 'Cookie Policy', href: '/policies/cookies' },
    ],
};

const socialLinks = [
    { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
    { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
];

export function Footer() {
    return (
        <footer className="bg-[var(--brutal-black)] text-[var(--brutal-white)] mt-20">
            {/* Newsletter */}
            {/* Newsletter */}
            <div className="bg-[var(--brutal-yellow)] text-[var(--brutal-black)] border-t-[var(--border-width-thick)] border-b-[var(--border-width-thick)] border-[var(--brutal-black)]">
                <div className="container py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-black">JOIN THE MOVEMENT</h3>
                            <p className="mt-1 font-medium">
                                Get 10% off your first order + exclusive drops
                            </p>
                        </div>
                        <form className="flex w-full md:w-auto gap-3">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="brutal-input bg-[var(--brutal-white)] border-[var(--brutal-black)] text-[var(--brutal-black)] w-full md:w-80 placeholder:text-[var(--brutal-gray-500)]"
                            />
                            <button
                                type="submit"
                                className="brutal-btn brutal-btn-dark whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Links */}
            <div className="container py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h4 className="font-bold uppercase tracking-wider mb-4">Shop</h4>
                        <ul className="space-y-2">
                            {footerLinks.shop.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-[var(--brutal-gray-400)] hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold uppercase tracking-wider mb-4">Help</h4>
                        <ul className="space-y-2">
                            {footerLinks.help.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-[var(--brutal-gray-400)] hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold uppercase tracking-wider mb-4">Company</h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-[var(--brutal-gray-400)] hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold uppercase tracking-wider mb-4">Legal</h4>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-[var(--brutal-gray-400)] hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-[var(--brutal-gray-700)]">
                <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--brutal-gray-400)] hover:text-white transition-colors"
                                aria-label={social.label}
                            >
                                <social.icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                    <p className="text-[var(--brutal-gray-400)] text-sm">
                        © {new Date().getFullYear()} BRUTALIST STORE. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
