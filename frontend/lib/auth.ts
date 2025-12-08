import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from './api';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    clearAuth: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: true,
            isAuthenticated: false,

            login: async (email: string, password: string) => {
                const response = await api.post('/auth/login', { email, password });
                const { user, accessToken, refreshToken } = response.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                    isLoading: false,
                });

                // Merge guest cart if exists
                const sessionId = localStorage.getItem('sessionId');
                if (sessionId) {
                    try {
                        await api.post('/cart/merge', { sessionId });
                        localStorage.removeItem('sessionId');
                    } catch {
                        // Ignore merge errors
                    }
                }
            },

            register: async (name: string, email: string, password: string) => {
                const response = await api.post('/auth/register', { name, email, password });
                const { user, accessToken, refreshToken } = response.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                    isLoading: false,
                });
            },

            logout: async () => {
                const { refreshToken } = get();

                try {
                    if (refreshToken) {
                        await api.post('/auth/logout', { refreshToken });
                    }
                } catch {
                    // Ignore logout errors
                }

                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            },

            setUser: (user) => set({ user, isAuthenticated: !!user }),

            setTokens: (accessToken, refreshToken) => {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                set({ accessToken, refreshToken });
            },

            clearAuth: () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },

            checkAuth: async () => {
                const accessToken = localStorage.getItem('accessToken');

                if (!accessToken) {
                    set({ isLoading: false, isAuthenticated: false });
                    return;
                }

                try {
                    const response = await api.get('/auth/me');
                    set({
                        user: response.data,
                        accessToken,
                        refreshToken: localStorage.getItem('refreshToken'),
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch {
                    get().clearAuth();
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
