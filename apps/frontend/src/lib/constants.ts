/**
 * Application constants
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const APP_NAME = 'DecidrAI';
export const APP_DESCRIPTION = 'The Google for AI Decisions - an intelligent, curated discovery platform';

export const ROUTES = {
    HOME: '/',
    DISCOVER: '/discover',
    COMPARE: '/compare',
    CATEGORIES: '/categories',
    ABOUT: '/about',
    TOOLS: '/tools',
} as const;
