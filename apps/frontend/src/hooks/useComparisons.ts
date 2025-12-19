/**
 * React Query hooks for Comparisons API
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { compareTools, regenerateComparison, getPopularComparisons } from '@/lib/api';

/**
 * Compare tools (cached)
 */
export const useCompareTools = (toolSlugs: string[]) => {
    return useQuery({
        queryKey: ['comparisons', toolSlugs.sort()],
        queryFn: () => compareTools(toolSlugs),
        enabled: toolSlugs.length >= 2,
    });
};

/**
 * Get popular comparisons
 */
export const usePopularComparisons = () => {
    return useQuery({
        queryKey: ['comparisons', 'popular'],
        queryFn: () => getPopularComparisons(),
    });
};

/**
 * Regenerate comparison
 */
export const useRegenerateComparison = () => {
    return useMutation({
        mutationFn: (toolSlugs: string[]) => regenerateComparison(toolSlugs),
    });
};
