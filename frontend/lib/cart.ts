import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from './api';
import { generateSessionId } from './utils';

export interface CartItem {
    id: string;
    variantId: string;
    quantity: number;
    product: {
        id: string;
        title: string;
        slug: string;
        image: string | null;
    };
    variant: {
        id: string;
        title: string;
        sku: string | null;
        price: number;
        compareAtPrice: number | null;
        inventoryQty: number;
        options: Array<{ name: string; value: string }>;
    };
    lineTotal: number;
}

export interface Cart {
    id: string;
    items: CartItem[];
    itemCount: number;
    subtotal: number;
}

interface CartState {
    cart: Cart | null;
    isLoading: boolean;
    isOpen: boolean;

    // Actions
    fetchCart: () => Promise<void>;
    addItem: (variantId: string, quantity?: number) => Promise<void>;
    updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    setIsOpen: (isOpen: boolean) => void;
    closeCart: () => void;
    toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: null,
            isLoading: false,
            isOpen: false,

            fetchCart: async () => {
                set({ isLoading: true });
                try {
                    generateSessionId(); // Ensure session ID exists
                    const response = await api.get('/cart');

                    // Store session ID if returned
                    if (response.data.sessionId) {
                        localStorage.setItem('sessionId', response.data.sessionId);
                    }

                    set({ cart: response.data, isLoading: false });
                } catch (error) {
                    console.error('Failed to fetch cart:', error);
                    set({ isLoading: false });
                }
            },

            addItem: async (variantId: string, quantity = 1) => {
                set({ isLoading: true });
                try {
                    generateSessionId();
                    const response = await api.post('/cart/items', { variantId, quantity });

                    if (response.data.sessionId) {
                        localStorage.setItem('sessionId', response.data.sessionId);
                    }

                    set({ cart: response.data, isLoading: false, isOpen: true });
                } catch (error: any) {
                    set({ isLoading: false });
                    throw new Error(error.response?.data?.error || 'Failed to add item');
                }
            },

            updateItemQuantity: async (itemId: string, quantity: number) => {
                const { cart } = get();
                if (!cart) return;

                // Optimistic update
                const updatedItems = cart.items.map((item) =>
                    item.id === itemId
                        ? { ...item, quantity, lineTotal: item.variant.price * quantity }
                        : item
                );
                const newSubtotal = updatedItems.reduce((sum, item) => sum + item.lineTotal, 0);
                const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

                set({
                    cart: {
                        ...cart,
                        items: quantity === 0 ? updatedItems.filter((i) => i.id !== itemId) : updatedItems,
                        subtotal: newSubtotal,
                        itemCount: newItemCount,
                    },
                });

                try {
                    const response = await api.patch(`/cart/items/${itemId}`, { quantity });
                    set({ cart: response.data });
                } catch (error) {
                    // Revert on error
                    get().fetchCart();
                }
            },

            removeItem: async (itemId: string) => {
                const { cart } = get();
                if (!cart) return;

                // Optimistic update
                const updatedItems = cart.items.filter((item) => item.id !== itemId);
                const newSubtotal = updatedItems.reduce((sum, item) => sum + item.lineTotal, 0);
                const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

                set({
                    cart: {
                        ...cart,
                        items: updatedItems,
                        subtotal: newSubtotal,
                        itemCount: newItemCount,
                    },
                });

                try {
                    const response = await api.delete(`/cart/items/${itemId}`);
                    set({ cart: response.data });
                } catch (error) {
                    get().fetchCart();
                }
            },

            clearCart: async () => {
                try {
                    const response = await api.delete('/cart');
                    set({ cart: response.data });
                } catch (error) {
                    console.error('Failed to clear cart:', error);
                }
            },

            setIsOpen: (isOpen) => set({ isOpen }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({
                cart: state.cart,
            }),
        }
    )
);
