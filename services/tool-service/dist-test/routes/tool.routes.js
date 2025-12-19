"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tool_controller_1 = require("../controllers/tool.controller");
const router = (0, express_1.Router)();
// ==================== PUBLIC ROUTES ====================
/**
 * GET /tools
 * Get all tools with pagination and filters
 */
router.get('/tools', tool_controller_1.getAllTools);
/**
 * GET /tools/search
 * Search tools by query
 */
router.get('/tools/search', tool_controller_1.searchTools);
/**
 * GET /tools/:slug
 * Get tool by slug
 */
router.get('/tools/:slug', tool_controller_1.getToolBySlug);
/**
 * GET /tools/:slug/related
 * Get related tools
 */
router.get('/tools/:slug/related', tool_controller_1.getRelatedTools);
// ==================== ADMIN ROUTES ====================
// Note: Authentication is handled by API Gateway
// These routes will be protected at the gateway level
/**
 * POST /admin/tools
 * Create new tool
 */
router.post('/admin/tools', tool_controller_1.createTool);
/**
 * PATCH /admin/tools/:id
 * Update existing tool
 */
router.patch('/admin/tools/:id', tool_controller_1.updateTool);
/**
 * DELETE /admin/tools/:id
 * Delete tool (soft delete)
 */
router.delete('/admin/tools/:id', tool_controller_1.deleteTool);
exports.default = router;
