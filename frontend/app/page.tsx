'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Check, X, Loader2 } from 'lucide-react';
import { PageLoader } from '@/components/ui/page-loader';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import api from '@/lib/axios';
import { useNavigationLoading } from '@/lib/hooks/useNavigationLoading';

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();
  const { addToCart, getCartItemCount } = useCart();
  const { loadingStates, navigateWithLoading } = useNavigationLoading();
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');

      const parsedProducts = response.data.map((product: any) => {
        const variants = JSON.parse(product.variants);
        return {
          id: product.id.toString(), // Convert to string
          name: product.title,       // Map title to name
          description: product.description,
          price: product.price,
          image: product.image,
          inventory: product.inventory,
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

  // Reset product selection when active product changes
  useEffect(() => {
    if (activeProduct) {
      const product = products.find((p: Product) => p.id === activeProduct);
      if (product) {
        setSelectedColor(product.variants.colors[0] || '');
        setSelectedSize(product.variants.sizes[0] || '');
        setQuantity(1);
      }
    }
  }, [activeProduct, products]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);


  const handleAddToCart = (product: Product) => {
    setIsAddingToCart(product.id);

    // Simulate a slight delay to show loading state
    setTimeout(() => {
      addToCart(
        product,
        selectedColor || product.variants.colors[0],
        selectedSize || product.variants.sizes[0],
        quantity
      );
      setSuccessMessage(`${product.name} added to cart!`);
      setActiveProduct(null);
      setIsAddingToCart(null);
    }, 500);
  };

  const toggleProductOptions = (productId: string) => {
    setActiveProduct(activeProduct === productId ? null : productId);
    setSuccessMessage(null);
  };

  if (loading) {
    return <PageLoader message="Loading products..." />;
  }

  if (error || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="">
            <p className="text-center text-red-600">{error || 'No products available'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="heading-1 mb-2">Our Products</h1>
          <div className="relative">
            <LoadingButton
              variant="ghost"
              size="icon"
              loading={loadingStates['/cart']}
              onClick={() => navigateWithLoading('/cart')}
              className="h-12 w-12 cursor-pointer transition-colors"
            >
              <ShoppingCart className="h-6 w-6 text-foreground" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </LoadingButton>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-4 right-4 bg-card border-l-4 border-primary text-foreground px-5 py-4 rounded-md flex items-center shadow-xl z-50 animate-in slide-in-from-right-5 duration-300">
            <Check className="h-5 w-5 mr-3 text-primary" />
            <span className="font-medium">{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="ml-4 hover:text-muted-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: Product) => (
            <Card key={product.id} className="flex flex-col border shadow-sm pt-0">
              <div className="relative aspect-square bg-white product-image">
                <Image
                  src={product.image}
                  alt={product.name || 'Product Image'}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="heading-3">{product.name}</CardTitle>
                <CardDescription className="body-small mt-1">
                  {product.description.slice(0, 100)}...
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-between flex-grow">
                <div className="mb-4">
                  <p className="text-lg font-bold text-primary tracking-tight">${product.price.toFixed(2)}</p>
                  <p className="caption mt-1">{product.inventory} in stock</p>
                </div>
                {activeProduct === product.id ? (
                  <div className="space-y-4">
                    {/* Color Selection */}
                    {product.variants.colors.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Color</label>
                        <div className="flex flex-wrap gap-2">
                          {product.variants.colors.map((color: string) => (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={`px-3 py-1 rounded-full text-sm ${
                                selectedColor === color
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Size Selection */}
                    {product.variants.sizes.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Size</label>
                        <div className="flex flex-wrap gap-2">
                          {product.variants.sizes.map((size: string) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-3 py-1 rounded-full text-sm ${
                                selectedSize === size
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity Selection */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Quantity</label>
                      <div className="flex items-center">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-2 py-1 bg-muted hover:bg-muted/80 rounded-l-md border-r"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-4 py-1 bg-card text-center border-y">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-2 py-1 bg-muted hover:bg-muted/80 rounded-r-md border-l"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setActiveProduct(null)}
                        className="flex-1 cursor-pointer transition-colors"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer transition-colors"
                        disabled={isAddingToCart === product.id}
                      >
                        {isAddingToCart === product.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          'Add to Cart'
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => toggleProductOptions(product.id)}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 cursor-pointer transition-colors"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
