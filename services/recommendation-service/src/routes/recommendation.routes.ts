import { Router } from 'express';
import {
    getRecommendations,
    getSessionRecommendations
} from '../controllers/recommendation.controller';

const router = Router();

/**
 * POST /recommend
 * Get recommendations based on direct tag input
 * Body: { tags: string[], limit?: number, useAI?: boolean }
 */
router.post('/recommend', getRecommendations);

/**
 * GET /recommend/session/:sessionId
 * Get recommendations for a completed flow session
 * Query: limit, useAI
 */
router.get('/recommend/session/:sessionId', getSessionRecommendations);

export default router;
