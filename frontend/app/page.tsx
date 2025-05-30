'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import api from '@/lib/axios';

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();
  const { setSelectedProduct } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');

      const parsedProducts = response.data.map((product: any) => {
        const variants = JSON.parse(product.variants);
        return {
          ...product,
          variants: {
            colors: variants.find((v: any) => v.type === 'color')?.options || [],
            sizes: variants.find((v: any) => v.type === 'size')?.options || [],
          },
        };
      });

      setProducts(parsedProducts);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (product: Product) => {
    const selection = {
      productId: product.id,
      productName: product.name,
      selectedColor: product.variants.colors[0],
      selectedSize: product.variants.sizes[0],
      quantity: 1,
      price: product.price,
    };

    setSelectedProduct(selection);
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">{error || 'No products available'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <div className="relative aspect-square bg-white rounded-t-lg overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name || 'Product Image'}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {product.description.slice(0, 100)}...
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-between flex-grow">
                <div className="mb-4">
                  <p className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{product.inventory} in stock</p>
                </div>
                <Button
                  onClick={() => handleBuyNow(product)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}