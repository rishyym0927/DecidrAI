import { Router } from 'express';
import {
    getAllTools,
    getToolBySlug,
    searchTools,
    getRelatedTools,
    createTool,
    updateTool,
    deleteTool
} from '../controllers/tool.controller';

const router = Router();

// ==================== PUBLIC ROUTES ====================

/**
 * GET /tools
 * Get all tools with pagination and filters
 */
router.get('/tools', getAllTools);

/**
 * GET /tools/search
 * Search tools by query
 */
router.get('/tools/search', searchTools);

/**
 * GET /tools/:slug
 * Get tool by slug
 */
router.get('/tools/:slug', getToolBySlug);

/**
 * GET /tools/:slug/related
 * Get related tools
 */
router.get('/tools/:slug/related', getRelatedTools);

// ==================== ADMIN ROUTES ====================
// Note: Authentication is handled by API Gateway
// These routes will be protected at the gateway level

/**
 * POST /admin/tools
 * Create new tool
 */
router.post('/admin/tools', createTool);

/**
 * PATCH /admin/tools/:id
 * Update existing tool
 */
router.patch('/admin/tools/:id', updateTool);

/**
 * DELETE /admin/tools/:id
 * Delete tool (soft delete)
 */
router.delete('/admin/tools/:id', deleteTool);

export default router;
