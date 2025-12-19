/**
 * Comparison Service API endpoints
 * Communicates with comparison-service via API Gateway
 */

import { apiClient } from './client';
import type { ComparisonResponse, PopularComparisonsResponse } from '@/types/comparison';

/**
 * Compare tools by slugs
 * GET /api/compare?tools=slug1,slug2
 */
export async function compareTools(toolSlugs: string[]) {
    return apiClient.get<ComparisonResponse['data']>('/compare', {
        tools: toolSlugs.join(','),
    });
}

/**
 * Force regenerate comparison
 * POST /api/compare
 */
export async function regenerateComparison(toolSlugs: string[]) {
    return apiClient.post<ComparisonResponse['data']>('/compare', {
        tools: toolSlugs,
    });
}

/**
 * Get popular comparisons
 * GET /api/compare/popular
 */
export async function getPopularComparisons() {
    return apiClient.get<PopularComparisonsResponse['data']>('/compare/popular');
}
