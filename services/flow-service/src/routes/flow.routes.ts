import { Router } from 'express';
import {
    getAllFlows,
    getFlowBySlug,
    startFlow,
    submitAnswer,
    getSession,
    completeFlow,
    createFlow,
    updateFlow,
    deleteFlow
} from '../controllers/flow.controller';

const router = Router();

// ==================== PUBLIC ROUTES ====================

/**
 * GET /flows
 * Get all flows with pagination and filters
 */
router.get('/flows', getAllFlows);

/**
 * GET /flows/:slug
 * Get flow by slug
 */
router.get('/flows/:slug', getFlowBySlug);

/**
 * POST /flows/:slug/start
 * Start a new flow session
 */
router.post('/flows/:slug/start', startFlow);

/**
 * POST /flows/sessions/:sessionId/answer
 * Submit an answer for a flow session
 */
router.post('/flows/sessions/:sessionId/answer', submitAnswer);

/**
 * GET /flows/sessions/:sessionId
 * Get session details (for resuming)
 */
router.get('/flows/sessions/:sessionId', getSession);

/**
 * POST /flows/sessions/:sessionId/complete
 * Complete a flow session manually
 */
router.post('/flows/sessions/:sessionId/complete', completeFlow);

// ==================== ADMIN ROUTES ====================
// Note: Authentication is handled by API Gateway
// These routes will be protected at the gateway level

/**
 * POST /admin/flows
 * Create new flow
 */
router.post('/admin/flows', createFlow);

/**
 * PATCH /admin/flows/:id
 * Update existing flow
 */
router.patch('/admin/flows/:id', updateFlow);

/**
 * DELETE /admin/flows/:id
 * Delete flow (soft delete)
 */
router.delete('/admin/flows/:id', deleteFlow);

export default router;
