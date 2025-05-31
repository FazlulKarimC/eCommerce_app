'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductSelection, CartItem } from './types';

interface CartContextType {
  // Original functionality (direct checkout) - kept for backward compatibility
  selectedProduct: ProductSelection | null;
  setSelectedProduct: (product: ProductSelection) => void;

  // New cart functionality
  cartItems: CartItem[];
  addToCart: (product: Product, selectedColor: string, selectedSize: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to generate a unique ID for cart items to uniquely identify same product with different selections
const generateCartItemId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export function CartProvider({ children }: { children: ReactNode }) {
  // Original state (kept for backward compatibility)
  const [selectedProduct, setSelectedProduct] = useState<ProductSelection | null>(null);

  // New cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (
    product: Product, 
    selectedColor: string, 
    selectedSize: string, 
    quantity: number
  ) => {
    const newItem: CartItem = {
      id: generateCartItemId(),
      productId: product.id,
      productName: product.name || '',
      selectedColor,
      selectedSize,
      quantity,
      price: product.price,
      image: product.image || '',
      addedAt: new Date().toISOString()
    };

    setCartItems((prevItems: CartItem[]) => [...prevItems, newItem]);
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems: CartItem[]) => prevItems.filter((item: CartItem) => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setCartItems((prevItems: CartItem[]) => 
      prevItems.map((item: CartItem) => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Clear all items from cart
  const clearCart = () => {
    setCartItems([]);
    setSelectedProduct(null);
  };

  // Calculate total price of all items in cart
  const getCartTotal = () => {
    return cartItems.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
  };

  // Get total number of items in cart
  const getCartItemCount = () => {
    return cartItems.reduce((count: number, item: CartItem) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      // Original functionality
      selectedProduct,
      setSelectedProduct,

      // New cart functionality
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
