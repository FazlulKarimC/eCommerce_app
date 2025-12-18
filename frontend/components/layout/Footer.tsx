import Link from 'next/link';
import {
    Instagram,
    Twitter,
    Facebook,
    Mail
} from 'lucide-react';
import { Button, Input } from '@/components/ui';

const footerLinks = {
    shop: [
        { label: 'All Products', href: '/products' },
        { label: 'New Arrivals', href: '/collections/new-arrivals' },
        { label: 'Best Sellers', href: '/collections/best-sellers' },
        { label: 'Sale', href: '/collections/sale' },
    ],
    help: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'Shipping & Returns', href: '/coming-soon' },
        { label: 'FAQ', href: '/coming-soon' },
        { label: 'Size Guide', href: '/coming-soon' },
    ],
    company: [
        { label: 'About Us', href: '/about' },
        { label: 'Sustainability', href: '/coming-soon' },
        { label: 'Careers', href: '/coming-soon' },
        { label: 'Press', href: '/coming-soon' },
    ],
    legal: [
        { label: 'Terms of Service', href: '/coming-soon' },
        { label: 'Privacy Policy', href: '/coming-soon' },
        { label: 'Cookie Policy', href: '/coming-soon' },
    ],
};

const socialLinks = [
    { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
    { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
];

export function Footer() {
    return (
        <footer className="bg-black text-white mt-20">
            {/* Newsletter */}
            <div className="bg-yellow-400 text-black border-t-4 border-b-4 border-black">
                <div className="container py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-black">JOIN THE MOVEMENT</h3>
                            <p className="mt-1 font-medium">
                                Get 10% off your first order + exclusive drops
                            </p>
                        </div>
                        <form
                            className="flex w-full md:w-auto gap-3"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const form = e.currentTarget;
                                const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
                                const email = emailInput?.value?.trim();

                                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                                    alert('Please enter a valid email address');
                                    return;
                                }

                                // TODO: Implement newsletter API call
                                // await api.post('/newsletter', { email });
                                alert('Thank you for subscribing!');
                                emailInput.value = '';
                            }}
                        >
                            <Input
                                type="email"
                                name="email"
                                placeholder="Your email"
                                required
                                className="bg-white text-black w-full md:w-80"
                            />
                            <Button type="submit" variant="secondary" className="whitespace-nowrap">
                                Subscribe
                            </Button>
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
                                        className="text-gray-400 hover:text-white transition-colors"
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
                                        className="text-gray-400 hover:text-white transition-colors"
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
                                        className="text-gray-400 hover:text-white transition-colors"
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
                                        className="text-gray-400 hover:text-white transition-colors"
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
            <div className="border-t border-gray-700">
                <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label={social.label}
                            >
                                <social.icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} BRUTALIST STORE. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
