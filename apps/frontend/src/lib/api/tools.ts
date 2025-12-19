/**
 * Tool Service API endpoints
 * Communicates with tool-service via API Gateway
 */

import { apiClient } from './client';
import type { ToolsResponse, ToolResponse, ToolFilters } from '@/types/tool';

/**
 * Get all tools with optional filters
 * GET /api/tools
 */
export async function getTools(filters?: ToolFilters) {
    return apiClient.get<ToolsResponse['data']>('/tools', filters);
}

/**
 * Search tools by query
 * GET /api/tools/search?q=query
 */
export async function searchTools(query: string) {
    return apiClient.get<ToolsResponse['data']>('/tools/search', { q: query });
}

/**
 * Get tool by slug
 * GET /api/tools/:slug
 */
export async function getToolBySlug(slug: string) {
    return apiClient.get<ToolResponse['data']>(`/tools/${slug}`);
}

/**
 * Get related tools for a specific tool
 * GET /api/tools/:slug/related
 */
export async function getRelatedTools(slug: string) {
    return apiClient.get<ToolsResponse['data']>(`/tools/${slug}/related`);
}
