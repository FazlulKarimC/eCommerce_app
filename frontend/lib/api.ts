import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor to add session ID
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        // Add session ID for guest cart
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
            config.headers['X-Session-Id'] = sessionId;
        }
    }
    return config;
});

// Response interceptor to handle 401s (optional specific handling)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Optional: Redirect to login or handled by component
        }
        return Promise.reject(error);
    }
);

export default api;
