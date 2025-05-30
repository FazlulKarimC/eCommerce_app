'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, ProductSelection } from './types';

interface CartContextType {
  selectedProduct: ProductSelection | null;
  setSelectedProduct: (product: ProductSelection) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [selectedProduct, setSelectedProduct] = useState<ProductSelection | null>(null);

  const clearCart = () => {
    setSelectedProduct(null);
  };

  return (
    <CartContext.Provider value={{
      selectedProduct,
      setSelectedProduct,
      clearCart
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
