import Link from 'next/link';
import { Construction, Home, ShoppingBag, ArrowLeft, Wrench, Clock } from 'lucide-react';
import { Button } from '@/components/ui';

export default function ComingSoonPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center py-20 bg-[#FAFAFA]">
            <div className="container max-w-2xl px-4 text-center">
                {/* Giant Icon */}
                <div className="relative mb-8">
                    <div className="inline-flex items-center justify-center">
                        <div className="relative">
                            {/* Background decoration */}
                            <div className="absolute -inset-6 bg-yellow-400 rounded-full border-4 border-black -rotate-6"></div>

                            {/* Main circle */}
                            <div className="relative w-40 h-40 bg-black rounded-full border-4 border-black flex items-center justify-center shadow-[8px_8px_0px_#FACC15]">
                                <Construction className="w-20 h-20 text-yellow-400" />
                            </div>

                            {/* Floating wrench */}
                            <div className="absolute -top-4 -right-4 w-14 h-14 bg-red-500 rounded-lg border-4 border-black flex items-center justify-center rotate-12 shadow-[4px_4px_0px_#000]">
                                <Wrench className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message Card */}
                <div className="bg-white border-4 border-black rounded-xl p-8 shadow-[8px_8px_0px_#000] mb-8">
                    <div className="inline-block bg-yellow-400 px-4 py-2 border-4 border-black rounded-lg mb-6 -rotate-2 shadow-[4px_4px_0px_#000]">
                        <span className="font-mono text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Coming Soon
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
                        Under Development
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">
                        We're working hard to bring you something amazing!
                    </p>
                    <p className="text-gray-500">
                        This page is still being built. Check back soon for updates.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                        <Link href="/">
                            <Home className="w-5 h-5" />
                            Back to Home
                        </Link>
                    </Button>

                    <Button asChild variant="yellow" size="lg">
                        <Link href="/products">
                            <ShoppingBag className="w-5 h-5" />
                            Browse Products
                        </Link>
                    </Button>
                </div>

                {/* Fun Quote */}
                <div className="mt-12 inline-block bg-black text-white px-6 py-3 rounded-xl border-4 border-black rotate-1 shadow-[4px_4px_0px_#FACC15]">
                    <p className="font-mono font-bold text-sm uppercase">
                        "Good things take time. Great things take a little longer."
                    </p>
                </div>

                {/* Quick Links */}
                <div className="mt-12 pt-8 border-t-4 border-black">
                    <p className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">
                        While You Wait, Explore
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {[
                            { label: 'Collections', href: '/collections' },
                            { label: 'All Products', href: '/products' },
                            { label: 'Categories', href: '/categories' },
                            { label: 'Track Order', href: '/track' },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 bg-white border-4 border-black rounded-lg font-bold text-sm hover:bg-yellow-400 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
