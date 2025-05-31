'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import { PageLoader } from '@/components/ui/page-loader';
import { useCart } from '@/lib/cart-context';
import { CartItem } from '@/lib/types';
import { useNavigationLoading } from '@/lib/hooks/useNavigationLoading';

export default function CartPage() {
  const router = useRouter();
  const { loadingStates, navigateWithLoading } = useNavigationLoading();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal,
    setSelectedProduct 
  } = useCart();

  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Calculate subtotal, tax, and total
  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  // Handle quantity change
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(itemId);

    // Simulate a slight delay to show loading state
    setTimeout(() => {
      updateQuantity(itemId, newQuantity);
      setIsUpdating(null);
    }, 300);
  };

  // Handle remove item
  const handleRemoveItem = (itemId: string) => {
    setIsUpdating(itemId);

    // Simulate a slight delay to show loading state
    setTimeout(() => {
      removeFromCart(itemId);
      setIsUpdating(null);
    }, 300);
  };

  // Handle checkout
  const handleCheckout = (itemId: string) => {
    const item = cartItems.find((item: CartItem) => item.id === itemId);
    if (!item) return;

    // Set the selected item for checkout
    setSelectedProduct({
      productId: item.productId,
      productName: item.productName,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      quantity: item.quantity,
      price: item.price
    });

    // Navigate to checkout
    router.push('/checkout');
  };

  // Handle checkout all
  const handleCheckoutAll = () => {
    if (cartItems.length === 0) return;

    // For now, just checkout with the first item
    // In a real implementation, we would modify the checkout page to handle multiple items
    const item = cartItems[0];
    setSelectedProduct({
      productId: item.productId,
      productName: item.productName,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      quantity: item.quantity,
      price: item.price
    });

    router.push('/checkout');
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <LoadingButton
              variant="ghost"
              loading={loadingStates['/']}
              onClick={() => navigateWithLoading('/')}
              loadingText="Going back..."
              className="mb-4 cursor-pointer transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </LoadingButton>
            <h1 className="heading-1">Your Cart</h1>
          </div>

          <Card className="text-center py-16">
            <CardContent>
              <div className="flex justify-center mb-4">
                <ShoppingCart className="h-16 w-16 text-muted-foreground" />
              </div>
              <h2 className="heading-2 mb-2">Your cart is empty</h2>
              <p className="body-small mb-8">Looks like you haven't added any products to your cart yet.</p>
              <LoadingButton 
                loading={loadingStates['/']}
                onClick={() => navigateWithLoading('/')}
                loadingText="Loading products..."
                className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer transition-colors"
              >
                Start Shopping
              </LoadingButton>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <LoadingButton
            variant="ghost"
            loading={loadingStates['/']}
            onClick={() => navigateWithLoading('/')}
            loadingText="Going back..."
            className="mb-4 cursor-pointer transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </LoadingButton>
          <div className="flex items-center justify-between">
            <h1 className="heading-1">Your Cart</h1>
            <Button 
              variant="outline" 
              onClick={() => clearCart()}
              className="text-destructive border-destructive/20 hover:bg-destructive/10 cursor-pointer transition-colors"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item: CartItem) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {/* Product Image */}
                  <div className="relative w-full sm:w-32 h-32 bg-white cart-thumbnail m-2">
                    <Image
                      src={item.image}
                      alt={item.productName || 'Product Image'}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 p-4">
                    <div className="flex justify-between gap-1.5">
                      <h3 className="heading-3">{item.productName}</h3>
                      <p className="font-bold text-primary tracking-tight">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    <div className="body-small mt-2">
                      <p>Color: {item.selectedColor}</p>
                      <p>Size: {item.selectedSize}</p>
                      <p>Price: ${item.price.toFixed(2)} each</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 cursor-pointer transition-colors"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isUpdating === item.id}
                        >
                          {isUpdating === item.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Minus className="h-4 w-4" />
                          )}
                        </Button>

                        <span className="w-8 text-center">{item.quantity}</span>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 cursor-pointer transition-colors"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={isUpdating === item.id}
                        >
                          {isUpdating === item.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-destructive border-destructive/20 hover:bg-destructive/10 cursor-pointer transition-colors"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isUpdating === item.id}
                          title="Remove item"
                        >
                          {isUpdating === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="heading-3">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="body-small">Subtotal</span>
                    <span className="body-large">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="body-small">Tax (8%)</span>
                    <span className="body-large">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span className="body-large font-semibold">Total</span>
                    <span className="text-primary font-bold tracking-tight">${total.toFixed(2)}</span>
                  </div>
                </div>

                <LoadingButton
                  loading={loadingStates['/checkout']}
                  onClick={() => navigateWithLoading('/checkout')}
                  loadingText="Processing..."
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 cursor-pointer transition-colors"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Checkout (${total.toFixed(2)})
                </LoadingButton>

                <p className="caption text-center mt-2">
                  Shipping and taxes calculated at checkout
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
