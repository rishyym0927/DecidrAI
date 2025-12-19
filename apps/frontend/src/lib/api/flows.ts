/**
 * Flow Service API endpoints
 * Simplified with axios
 */

import api from '../axios';

/**
 * Get all flows
 */
export const getFlows = (params?: { category?: string; page?: number; limit?: number }) => {
    return api.get('/flows', { params });
};

/**
 * Get flow by slug
 */
export const getFlowBySlug = (slug: string) => {
    return api.get(`/flows/${slug}`);
};

/**
 * Start a new flow session
 */
export const startFlow = (slug: string) => {
    return api.post(`/flows/${slug}/start`);
};

/**
 * Submit answer to current question
 */
export const submitAnswer = (sessionId: string, answer: string | string[]) => {
    return api.post(`/flows/sessions/${sessionId}/answer`, { answer });
};

/**
 * Get session status (for resuming)
 */
export const getFlowSession = (sessionId: string) => {
    return api.get(`/flows/sessions/${sessionId}`);
};

/**
 * Complete flow and get extracted tags
 */
export const completeFlow = (sessionId: string) => {
    return api.post(`/flows/sessions/${sessionId}/complete`);
};
