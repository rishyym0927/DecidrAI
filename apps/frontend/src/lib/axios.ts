/**
 * Axios instance configured for API Gateway communication
 * Includes interceptors for auth, error handling, and retry mechanism
 */

import axios from 'axios';
import axiosRetry from 'axios-retry';
import { API_BASE_URL } from './constants';

// Create axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 seconds
});

// Configure retry mechanism with exponential backoff
axiosRetry(api, {
    retries: 3,
    retryDelay: (retryCount) => {
        // Exponential backoff: 1s, 2s, 4s
        return Math.pow(2, retryCount - 1) * 1000;
    },
    retryCondition: (error) => {
        // Retry on network errors or 5xx server errors
        return (
            axiosRetry.isNetworkOrIdempotentRequestError(error) ||
            (error.response?.status !== undefined && error.response.status >= 500)
        );
    },
    onRetry: (retryCount, error, requestConfig) => {
        console.log(`Retry attempt ${retryCount} for ${requestConfig.url}`);
    },
});

// Request interceptor - Add auth token if available
api.interceptors.request.use(
    (config) => {
        // Get Clerk token from session storage or cookies
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
