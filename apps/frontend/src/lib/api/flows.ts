/**
 * Flow Service API endpoints
 * Matching actual backend responses
 */

import api from '../axios';
import type {
    FlowsListResponse,
    FlowDetailResponse,
    FlowStartResponse,
    SubmitAnswerResponse,
    SessionResponse
} from '@/types/flow';

/**
 * Get all flows with optional filters
 * GET /flows?page=1&limit=12&category=interview
 */
export const getFlows = (params?: {
    page?: number;
    limit?: number;
    category?: string;
    sort?: string;
}): Promise<FlowsListResponse> => {
    return api.get('/flows', { params });
};

/**
 * Get flow by slug
 * GET /flows/:slug
 */
export const getFlowBySlug = (slug: string): Promise<FlowDetailResponse> => {
    return api.get(`/flows/${slug}`);
};

/**
 * Start a flow session
 * POST /flows/:slug/start
 */
export const startFlow = (slug: string, userId?: string): Promise<FlowStartResponse> => {
    return api.post(`/flows/${slug}/start`, { userId });
};

/**
 * Submit an answer for a flow session
 * POST /flows/sessions/:sessionId/answer
 */
export const submitAnswer = (
    sessionId: string,
    questionId: string,
    value: string | string[]
): Promise<SubmitAnswerResponse> => {
    return api.post(`/flows/sessions/${sessionId}/answer`, { questionId, value });
};

/**
 * Get session details
 * GET /flows/sessions/:sessionId
 */
export const getSession = (sessionId: string): Promise<SessionResponse> => {
    return api.get(`/flows/sessions/${sessionId}`);
};

/**
 * Complete a flow session manually
 * POST /flows/sessions/:sessionId/complete
 */
export const completeFlow = (sessionId: string): Promise<SubmitAnswerResponse> => {
    return api.post(`/flows/sessions/${sessionId}/complete`);
};
