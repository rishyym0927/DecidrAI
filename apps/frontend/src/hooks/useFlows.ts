/**
 * React Query hooks for Flows API
 * Matching actual backend responses
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getFlows,
    getFlowBySlug,
    startFlow,
    submitAnswer,
    getSession,
    completeFlow
} from '@/lib/api';
import type {
    FlowsListResponse,
    FlowDetailResponse,
    FlowStartResponse,
    SubmitAnswerResponse,
    SessionResponse
} from '@/types/flow';

/**
 * Get all flows with optional filters
 */
export const useFlows = (params?: {
    page?: number;
    limit?: number;
    category?: string;
    sort?: string;
}) => {
    return useQuery<FlowsListResponse>({
        queryKey: ['flows', params],
        queryFn: () => getFlows(params),
    });
};

/**
 * Get flow by slug
 */
export const useFlow = (slug: string) => {
    return useQuery<FlowDetailResponse>({
        queryKey: ['flows', slug],
        queryFn: () => getFlowBySlug(slug),
        enabled: !!slug,
    });
};

/**
 * Get flow session
 */
export const useFlowSession = (sessionId: string) => {
    return useQuery<SessionResponse>({
        queryKey: ['sessions', sessionId],
        queryFn: () => getSession(sessionId),
        enabled: !!sessionId,
    });
};

/**
 * Start a flow (mutation)
 */
export const useStartFlow = () => {
    const queryClient = useQueryClient();

    return useMutation<FlowStartResponse, Error, { slug: string; userId?: string }>({
        mutationFn: ({ slug, userId }) => startFlow(slug, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });
};

/**
 * Submit an answer (mutation)
 */
export const useSubmitAnswer = () => {
    const queryClient = useQueryClient();

    return useMutation<
        SubmitAnswerResponse,
        Error,
        { sessionId: string; questionId: string; value: string | string[] }
    >({
        mutationFn: ({ sessionId, questionId, value }) =>
            submitAnswer(sessionId, questionId, value),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['sessions', variables.sessionId] });
        },
    });
};

/**
 * Complete a flow (mutation)
 */
export const useCompleteFlow = () => {
    const queryClient = useQueryClient();

    return useMutation<SubmitAnswerResponse, Error, string>({
        mutationFn: (sessionId) => completeFlow(sessionId),
        onSuccess: (_, sessionId) => {
            queryClient.invalidateQueries({ queryKey: ['sessions', sessionId] });
        },
    });
};
