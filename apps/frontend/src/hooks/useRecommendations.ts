/**
 * React Query hooks for Recommendations API
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { getRecommendations, getRecommendationsBySession } from '@/lib/api';

/**
 * Get recommendations by session
 */
export const useRecommendationsBySession = (sessionId: string) => {
    return useQuery({
        queryKey: ['recommendations', 'session', sessionId],
        queryFn: () => getRecommendationsBySession(sessionId),
        enabled: !!sessionId,
    });
};

/**
 * Get recommendations by tags (mutation because it's a POST request)
 */
export const useGetRecommendations = () => {
    return useMutation({
        mutationFn: (data: { tags: string[]; limit?: number }) => getRecommendations(data),
    });
};
