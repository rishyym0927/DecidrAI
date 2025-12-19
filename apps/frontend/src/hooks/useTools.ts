/**
 * React Query hooks for Tools API
 * Properly typed to match backend responses
 */

import { useQuery } from '@tanstack/react-query';
import { getTools, searchTools, getToolBySlug, getRelatedTools } from '@/lib/api';
import type { ToolFilters, ToolsListResponse, ToolsSearchResponse, ToolDetailResponse, Tool } from '@/types/tool';

/**
 * Get all tools with filters
 */
export const useTools = (filters?: ToolFilters) => {
    return useQuery<ToolsListResponse>({
        queryKey: ['tools', filters],
        queryFn: () => getTools(filters),
    });
};

/**
 * Search tools
 */
export const useSearchTools = (query: string, enabled = true) => {
    return useQuery<ToolsSearchResponse>({
        queryKey: ['tools', 'search', query],
        queryFn: () => searchTools(query),
        enabled: enabled && query.length >= 3,
    });
};

/**
 * Get single tool by slug
 */
export const useTool = (slug: string) => {
    return useQuery<ToolDetailResponse>({
        queryKey: ['tools', slug],
        queryFn: () => getToolBySlug(slug),
        enabled: !!slug,
    });
};

/**
 * Get related tools
 */
export const useRelatedTools = (slug: string) => {
    return useQuery<{ success: boolean; data: Tool[] }>({
        queryKey: ['tools', slug, 'related'],
        queryFn: () => getRelatedTools(slug),
        enabled: !!slug,
    });
};
