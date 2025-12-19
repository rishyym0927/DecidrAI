/**
 * Comparison Service API endpoints
 * Simplified with axios
 */

import api from '../axios';

/**
 * Compare tools (cached)
 */
export const compareTools = (toolSlugs: string[]) => {
    return api.get('/compare', { params: { tools: toolSlugs.join(',') } });
};

/**
 * Force regenerate comparison
 */
export const regenerateComparison = (toolSlugs: string[]) => {
    return api.post('/compare', { tools: toolSlugs });
};

/**
 * Get popular comparisons
 */
export const getPopularComparisons = () => {
    return api.get('/compare/popular');
};
