/**
 * Recommendation Service API endpoints
 * Communicates with recommendation-service via API Gateway
 */

import { apiClient } from './client';
import type {
    RecommendationRequest,
    RecommendationResponse,
    SessionRecommendationResponse,
} from '@/types/recommendation';

/**
 * Get recommendations based on tags
 * POST /api/recommend
 */
export async function getRecommendations(request: RecommendationRequest) {
    return apiClient.post<RecommendationResponse['data']>('/recommend', request);
}

/**
 * Get recommendations from a completed flow session
 * GET /api/recommend/session/:sessionId
 */
export async function getRecommendationsBySession(sessionId: string) {
    return apiClient.get<SessionRecommendationResponse['data']>(
        `/recommend/session/${sessionId}`
    );
}
