/**
 * React Query hooks for Tools API
 * Provides automatic caching, loading states, and error handling
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTools, searchTools, getToolBySlug, getRelatedTools } from '@/lib/api';
import type { ToolFilters } from '@/types/tool';

/**
 * Get all tools with filters
 */
export const useTools = (filters?: ToolFilters) => {
    return useQuery({
        queryKey: ['tools', filters],
        queryFn: () => getTools(filters),
    });
};

/**
 * Search tools
 */
export const useSearchTools = (query: string, enabled = true) => {
    return useQuery({
        queryKey: ['tools', 'search', query],
        queryFn: () => searchTools(query),
        enabled: enabled && query.length > 0,
    });
};

/**
 * Get single tool by slug
 */
export const useTool = (slug: string) => {
    return useQuery({
        queryKey: ['tools', slug],
        queryFn: () => getToolBySlug(slug),
        enabled: !!slug,
    });
};

/**
 * Get related tools
 */
export const useRelatedTools = (slug: string) => {
    return useQuery({
        queryKey: ['tools', slug, 'related'],
        queryFn: () => getRelatedTools(slug),
        enabled: !!slug,
    });
};
