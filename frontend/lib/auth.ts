import { create } from 'zustand';
import { authClient } from './auth-client';
import { User } from './types';
import { useCartStore } from './cart';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isLoading: true,
    isAuthenticated: false,

    login: async (email: string, password: string) => {
        set({ isLoading: true });
        const { data, error } = await authClient.signIn.email({
            email,
            password,
        });

        if (error) {
            set({ isLoading: false });
            throw error;
        }

        if (data) {
            // Fetch user data
            await get().checkAuth();

            // Merge guest cart into customer cart after successful login
            await useCartStore.getState().mergeAndFetch();
        }
    },

    register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
        });

        if (error) {
            set({ isLoading: false });
            throw error;
        }

        if (data) {
            // Fetch user data
            await get().checkAuth();

            // Merge guest cart into customer cart after successful registration
            await useCartStore.getState().mergeAndFetch();
        }
    },

    logout: async () => {
        set({ isLoading: true });
        await authClient.signOut();
        set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
        // Guard localStorage access for SSR safety
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
            try {
                localStorage.removeItem('sessionId');
            } catch {
                // Ignore localStorage errors (e.g., private browsing mode)
            }
        }
    },

    setUser: (user) => set({ user, isAuthenticated: !!user }),

    checkAuth: async () => {
        set({ isLoading: true });
        const { data } = await authClient.getSession();

        if (data?.user) {
            // Map better-auth user to our User type
            // Note: better-auth user might miss some profile fields if not fetched
            // effectively acting as "me"
            const user = data.user as unknown as User;
            set({
                user,
                isAuthenticated: true,
                isLoading: false,
            });
        } else {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    },
}));
