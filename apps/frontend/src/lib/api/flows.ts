/**
 * Flow Service API endpoints
 * Communicates with flow-service via API Gateway
 */

import { apiClient } from './client';
import type {
    FlowsResponse,
    FlowResponse,
    StartFlowResponse,
    SubmitAnswerResponse,
    FlowSessionResponse,
} from '@/types/flow';

/**
 * Get all flows
 * GET /api/flows
 */
export async function getFlows(params?: { category?: string; page?: number; limit?: number }) {
    return apiClient.get<FlowsResponse['data']>('/flows', params);
}

/**
 * Get flow by slug
 * GET /api/flows/:slug
 */
export async function getFlowBySlug(slug: string) {
    return apiClient.get<FlowResponse['data']>(`/flows/${slug}`);
}

/**
 * Start a new flow session
 * POST /api/flows/:slug/start
 */
export async function startFlow(slug: string) {
    return apiClient.post<StartFlowResponse['data']>(`/flows/${slug}/start`);
}

/**
 * Submit answer to current question
 * POST /api/flows/sessions/:sessionId/answer
 */
export async function submitAnswer(sessionId: string, answer: string | string[]) {
    return apiClient.post<SubmitAnswerResponse['data']>(
        `/flows/sessions/${sessionId}/answer`,
        { answer }
    );
}

/**
 * Get session status (for resuming)
 * GET /api/flows/sessions/:sessionId
 */
export async function getFlowSession(sessionId: string) {
    return apiClient.get<FlowSessionResponse['data']>(`/flows/sessions/${sessionId}`);
}

/**
 * Complete flow and get extracted tags
 * POST /api/flows/sessions/:sessionId/complete
 */
export async function completeFlow(sessionId: string) {
    return apiClient.post<{ extractedTags: string[] }>(`/flows/sessions/${sessionId}/complete`);
}
