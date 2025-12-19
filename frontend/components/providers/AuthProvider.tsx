'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth';

/**
 * AuthProvider - Initializes authentication state on app load
 * This component calls checkAuth() to restore the session from cookies
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const checkAuth = useAuthStore((state) => state.checkAuth);

    useEffect(() => {
        // Check authentication status on app mount
        // This restores the session from cookies after page refresh
        checkAuth();
    }, [checkAuth]);

    return <>{children}</>;
}
