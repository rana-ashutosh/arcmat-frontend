import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    // baseURL: '/api/proxy',
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = sessionStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 unauthorized errors
api.interceptors.response.use(
    (response) => {
        // Return successful responses as-is
        return response;
    },
    (error) => {
        // Check if error is 401 Unauthorized
        if (error.response && error.response.status === 401) {
            // Clear authentication data
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');

                // Redirect to login page (use absolute path to avoid double /auth)
                window.location.href = '/auth/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;

