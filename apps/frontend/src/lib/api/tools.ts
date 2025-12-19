/**
 * Tool Service API endpoints
 * Simplified with axios
 */

import api from '../axios';
import type { ToolFilters } from '@/types/tool';

/**
 * Get all tools with optional filters
 */
export const getTools = (filters?: ToolFilters) => {
    return api.get('/tools', { params: filters });
};

/**
 * Search tools by query
 */
export const searchTools = (query: string) => {
    return api.get('/tools/search', { params: { q: query } });
};

/**
 * Get tool by slug
 */
export const getToolBySlug = (slug: string) => {
    return api.get(`/tools/${slug}`);
};

/**
 * Get related tools for a specific tool
 */
export const getRelatedTools = (slug: string) => {
    return api.get(`/tools/${slug}/related`);
};
