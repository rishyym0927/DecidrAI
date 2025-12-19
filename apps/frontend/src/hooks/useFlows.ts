/**
 * React Query hooks for Flows API
 * Provides automatic caching, loading states, and error handling
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getFlows,
    getFlowBySlug,
    startFlow,
    submitAnswer,
    getFlowSession,
    completeFlow,
} from '@/lib/api';

/**
 * Get all flows
 */
export const useFlows = (params?: { category?: string; page?: number; limit?: number }) => {
    return useQuery({
        queryKey: ['flows', params],
        queryFn: () => getFlows(params),
    });
};

/**
 * Get single flow by slug
 */
export const useFlow = (slug: string) => {
    return useQuery({
        queryKey: ['flows', slug],
        queryFn: () => getFlowBySlug(slug),
        enabled: !!slug,
    });
};

/**
 * Get flow session
 */
export const useFlowSession = (sessionId: string) => {
    return useQuery({
        queryKey: ['flows', 'sessions', sessionId],
        queryFn: () => getFlowSession(sessionId),
        enabled: !!sessionId,
    });
};

/**
 * Start a new flow session
 */
export const useStartFlow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (slug: string) => startFlow(slug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['flows', 'sessions'] });
        },
    });
};

/**
 * Submit answer to flow question
 */
export const useSubmitAnswer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ sessionId, answer }: { sessionId: string; answer: string | string[] }) =>
            submitAnswer(sessionId, answer),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['flows', 'sessions', variables.sessionId] });
        },
    });
};

/**
 * Complete flow and get tags
 */
export const useCompleteFlow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sessionId: string) => completeFlow(sessionId),
        onSuccess: (_, sessionId) => {
            queryClient.invalidateQueries({ queryKey: ['flows', 'sessions', sessionId] });
        },
    });
};
