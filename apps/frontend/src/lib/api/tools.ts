/**
 * Tool Service API endpoints
 * Properly typed to match backend responses
 */

import api from '../axios';
import type { ToolFilters, ToolsListResponse, ToolsSearchResponse, ToolDetailResponse, Tool } from '@/types/tool';

/**
 * Get all tools with optional filters
 * Response: { success, data: { tools: [], pagination: {} } }
 */
export const getTools = (filters?: ToolFilters): Promise<ToolsListResponse> => {
    return api.get('/tools', { params: filters });
};

/**
 * Search tools by query
 * Response: { success, data: [] } - NOTE: data is array directly!
 */
export const searchTools = (query: string): Promise<ToolsSearchResponse> => {
    return api.get('/tools/search', { params: { q: query } });
};

/**
 * Get tool by slug
 * Response: { success, data: Tool }
 */
export const getToolBySlug = (slug: string): Promise<ToolDetailResponse> => {
    return api.get(`/tools/${slug}`);
};

/**
 * Get related tools for a specific tool
 * Response: { success, data: Tool[] }
 */
export const getRelatedTools = (slug: string): Promise<{ success: boolean; data: Tool[] }> => {
    return api.get(`/tools/${slug}/related`);
};
