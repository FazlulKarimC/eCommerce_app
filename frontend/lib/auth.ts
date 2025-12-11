import { create } from 'zustand';
import { authClient } from './auth-client';
import { User } from './types';

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

        // Merge guest cart if checkAuth logic handles it or we do it here
        // For now, simple state update
        if (data) {
            // We need to fetch full profile or trust session data
            // session.user might simpler than full User type
            // Let's rely on checkAuth to normalize the user state
            await get().checkAuth();
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
            await get().checkAuth();
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
        localStorage.removeItem('sessionId'); // cleanup guest session logic if any
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
