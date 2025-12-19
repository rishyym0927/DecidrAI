/**
 * Recommendation Service API endpoints
 * Simplified with axios
 */

import api from '../axios';

/**
 * Get recommendations based on tags
 */
export const getRecommendations = (data: { tags: string[]; limit?: number }) => {
    return api.post('/recommend', data);
};

/**
 * Get recommendations from flow session
 */
export const getRecommendationsBySession = (sessionId: string) => {
    return api.get(`/recommend/session/${sessionId}`);
};
