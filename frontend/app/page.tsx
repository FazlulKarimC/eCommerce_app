import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Shield, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import type { Collection, ProductListItem } from '@/lib/types';

// Force dynamic rendering since data is fetched from external API at runtime
export const dynamic = 'force-dynamic';

async function getFeaturedProducts() {
  try {
    const response = await api.get('/products?featured=true&limit=8');
    return response.data.products as ProductListItem[];
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return [];
  }
}

async function getFeaturedCollections() {
  try {
    const response = await api.get('/collections/featured');
    return response.data as Collection[];
  } catch (error) {
    console.error('Failed to fetch featured collections:', error);
    return [];
  }
}

export default async function HomePage() {
  const [products, collections] = await Promise.all([
    getFeaturedProducts(),
    getFeaturedCollections(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-[var(--brutal-yellow)]">
        <div className="absolute inset-0 grid grid-cols-12 gap-4 opacity-10 pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="bg-[var(--brutal-black)]" />
          ))}
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-3xl">
            <span className="brutal-badge brutal-badge-red mb-6 inline-block">
              New Season
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-6">
              BOLD.<br />
              BRUTAL.<br />
              <span className="text-[var(--brutal-red)]">BEAUTIFUL.</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium mb-8 max-w-xl">
              Fashion that makes a statement. No compromises, no apologies.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="brutal-btn brutal-btn-dark text-lg py-4 px-8">
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/collections/new-arrivals" className="brutal-btn text-lg py-4 px-8">
                New Arrivals
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-[600px] bg-[var(--brutal-red)] hidden lg:block border-l-8 border-[var(--brutal-black)]" />
      </section>

      {/* Features Bar */}
      <section className="bg-[var(--brutal-black)] text-[var(--brutal-white)] py-6 border-y-4 border-[var(--brutal-white)]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <Truck className="w-8 h-8 text-[var(--brutal-yellow)]" />
              <div>
                <p className="font-bold">Free Shipping</p>
                <p className="text-sm text-[var(--brutal-gray-400)]">On orders over $75</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <RefreshCw className="w-8 h-8 text-[var(--brutal-yellow)]" />
              <div>
                <p className="font-bold">Easy Returns</p>
                <p className="text-sm text-[var(--brutal-gray-400)]">30-day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-[var(--brutal-yellow)]" />
              <div>
                <p className="font-bold">Secure Checkout</p>
                <p className="text-sm text-[var(--brutal-gray-400)]">100% protected payments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      {collections.length > 0 && (
        <section className="py-20">
          <div className="container">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-black">
                  Shop by Collection
                </h2>
                <p className="text-[var(--brutal-gray-600)] mt-2 text-lg">
                  Curated selections for every style
                </p>
              </div>
              <Link
                href="/collections"
                className="brutal-btn hidden md:flex"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.slice(0, 3).map((collection, index) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.slug}`}
                  className="brutal-card group relative aspect-[4/5] overflow-hidden"
                >
                  {collection.image ? (
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--brutal-gray-200)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-black mb-2">{collection.title}</h3>
                    <p className="text-white/80">{collection._count?.products || 0} Products</p>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/collections"
              className="brutal-btn mt-8 md:hidden w-full"
            >
              View All Collections
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-20 bg-[var(--brutal-cream)]">
          <div className="container">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="brutal-badge brutal-badge-red mb-4 inline-block">
                  Trending Now
                </span>
                <h2 className="text-4xl md:text-5xl font-black">
                  Featured Products
                </h2>
              </div>
              <Link
                href="/products"
                className="brutal-btn hidden md:flex"
              >
                Shop All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <Link
              href="/products"
              className="brutal-btn mt-8 md:hidden w-full"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-[var(--brutal-red)] text-white">
        <div className="container text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            JOIN THE MOVEMENT
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
            Subscribe for early access to new drops, exclusive offers, and 10% off your first order.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="brutal-input flex-1 bg-white text-black"
            />
            <button type="submit" className="brutal-btn brutal-btn-dark">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                OUR STORY
              </h2>
              <p className="text-lg text-[var(--brutal-gray-700)] mb-4">
                Born from a love of bold design and sustainable fashion, BRUTALIST represents a new era of conscious style. We believe that fashion should be a statement, not a compromise.
              </p>
              <p className="text-lg text-[var(--brutal-gray-700)] mb-8">
                Every piece in our collection is thoughtfully designed and ethically produced. From organic materials to fair labor practices, we're committed to doing things differently.
              </p>
              <Link href="/about" className="brutal-btn brutal-btn-dark">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="brutal-card aspect-square relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
                alt="Our story"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
