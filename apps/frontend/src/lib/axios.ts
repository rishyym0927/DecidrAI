/**
 * Axios instance configured for API Gateway communication
 * Includes interceptors for auth and error handling
 */

import axios from 'axios';
import { API_BASE_URL } from './constants';

// Create axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Request interceptor - Add auth token if available
api.interceptors.request.use(
    (config) => {
        // Get Clerk token from session storage or cookies
        // This will be automatically handled by Clerk's useAuth hook
        const token = typeof window !== 'undefined' ? sessionStorage.getItem('clerk-token') : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => {
        // Return the data directly if it has the expected structure
        return response.data;
    },
    (error) => {
        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            const errorMessage = error.response.data?.message || error.response.data?.error || 'An error occurred';

            // You can add global error handling here (e.g., toast notifications)
            console.error('API Error:', errorMessage);

            return Promise.reject({
                message: errorMessage,
                status: error.response.status,
                data: error.response.data,
            });
        } else if (error.request) {
            // Request made but no response received
            console.error('Network Error:', error.message);
            return Promise.reject({
                message: 'Network error. Please check your connection.',
                status: 0,
            });
        } else {
            // Something else happened
            console.error('Error:', error.message);
            return Promise.reject({
                message: error.message || 'An unexpected error occurred',
                status: 0,
            });
        }
    }
);

export default api;
