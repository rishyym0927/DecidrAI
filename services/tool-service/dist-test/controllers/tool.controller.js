"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTool = exports.updateTool = exports.createTool = exports.getRelatedTools = exports.searchTools = exports.getToolBySlug = exports.getAllTools = void 0;
const Tool_1 = require("../models/Tool");
const cache_service_1 = require("../services/cache.service");
const search_service_1 = require("../services/search.service");
// ==================== PUBLIC CONTROLLERS ====================
/**
 * Get all tools with pagination and filters
 * GET /tools?page=1&limit=12&category=productivity&sort=popular
 */
const getAllTools = async (req, res) => {
    try {
        const { page = 1, limit = 12, category, price, learning_curve, sort = 'newest' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Build filter query
        const filter = { status: 'published' };
        if (category) {
            filter.categories = category;
        }
        if (price) {
            filter['pricing.model'] = price;
        }
        if (learning_curve) {
            filter.learning_curve = learning_curve;
        }
        // Check cache
        const cacheKey = cache_service_1.CacheService.getToolsListKey({ page, limit, category, price, learning_curve, sort });
        const cached = await cache_service_1.CacheService.get(cacheKey);
        if (cached) {
            res.json(cached);
            return;
        }
        // Build sort query
        let sortQuery = {};
        switch (sort) {
            case 'popular':
                sortQuery = { view_count: -1 };
                break;
            case 'price-low':
                sortQuery = { 'pricing.starting_price': 1 };
                break;
            case 'price-high':
                sortQuery = { 'pricing.starting_price': -1 };
                break;
            default:
                sortQuery = { createdAt: -1 };
        }
        // Execute query
        const [tools, total] = await Promise.all([
            Tool_1.Tool.find(filter)
                .sort(sortQuery)
                .limit(limitNum)
                .skip(skip)
                .select('-__v')
                .lean(),
            Tool_1.Tool.countDocuments(filter)
        ]);
        const response = {
            success: true,
            data: {
                tools,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum)
                }
            }
        };
        // Cache response
        await cache_service_1.CacheService.set(cacheKey, response, cache_service_1.CACHE_TTL.TOOLS_LIST);
        res.json(response);
    }
    catch (error) {
        console.error('[getAllTools] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tools',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAllTools = getAllTools;
/**
 * Get tool by slug
 * GET /tools/:slug
 */
const getToolBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        // Check cache
        const cacheKey = cache_service_1.CacheService.getToolKey(slug);
        const cached = await cache_service_1.CacheService.get(cacheKey);
        if (cached) {
            // Still increment view count even if cached
            await Tool_1.Tool.findOneAndUpdate({ slug, status: 'published' }, { $inc: { view_count: 1 } });
            res.json({ success: true, data: cached });
            return;
        }
        // Find and increment view count atomically
        const tool = await Tool_1.Tool.findOneAndUpdate({ slug, status: 'published' }, { $inc: { view_count: 1 } }, { new: true })
            .select('-__v')
            .lean();
        if (!tool) {
            res.status(404).json({
                success: false,
                message: 'Tool not found'
            });
            return;
        }
        // Cache the tool
        await cache_service_1.CacheService.set(cacheKey, tool, cache_service_1.CACHE_TTL.TOOL_DETAIL);
        res.json({ success: true, data: tool });
    }
    catch (error) {
        console.error('[getToolBySlug] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tool',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getToolBySlug = getToolBySlug;
/**
 * Search tools
 * GET /tools/search?q=chatgpt
 */
const searchTools = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
            return;
        }
        // Check cache
        const cacheKey = cache_service_1.CacheService.getSearchKey(q);
        const cached = await cache_service_1.CacheService.get(cacheKey);
        if (cached) {
            res.json({ success: true, data: cached });
            return;
        }
        // Perform search
        const tools = await search_service_1.SearchService.searchTools(q, { limit: 50 });
        // Cache results
        await cache_service_1.CacheService.set(cacheKey, tools, cache_service_1.CACHE_TTL.SEARCH);
        res.json({ success: true, data: tools });
    }
    catch (error) {
        console.error('[searchTools] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.searchTools = searchTools;
/**
 * Get related tools
 * GET /tools/:slug/related
 */
const getRelatedTools = async (req, res) => {
    try {
        const { slug } = req.params;
        // Check cache
        const cacheKey = cache_service_1.CacheService.getRelatedKey(slug);
        const cached = await cache_service_1.CacheService.get(cacheKey);
        if (cached) {
            res.json({ success: true, data: cached });
            return;
        }
        // Find the tool first
        const tool = await Tool_1.Tool.findOne({ slug, status: 'published' }).lean();
        if (!tool) {
            res.status(404).json({
                success: false,
                message: 'Tool not found'
            });
            return;
        }
        // Find related tools
        const relatedTools = await search_service_1.SearchService.findRelatedTools(tool._id.toString(), tool.categories, tool.problems_solved, 5);
        // Cache results
        await cache_service_1.CacheService.set(cacheKey, relatedTools, cache_service_1.CACHE_TTL.RELATED);
        res.json({ success: true, data: relatedTools });
    }
    catch (error) {
        console.error('[getRelatedTools] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch related tools',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getRelatedTools = getRelatedTools;
// ==================== ADMIN CONTROLLERS ====================
/**
 * Create new tool
 * POST /admin/tools
 */
const createTool = async (req, res) => {
    try {
        const toolData = req.body;
        // Create tool
        const tool = new Tool_1.Tool(toolData);
        await tool.save();
        // Clear cache
        await cache_service_1.CacheService.delPattern('tools:*');
        res.status(201).json({
            success: true,
            data: tool,
            message: 'Tool created successfully'
        });
    }
    catch (error) {
        console.error('[createTool] Error:', error);
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: 'Tool with this slug already exists'
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create tool',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createTool = createTool;
/**
 * Update tool
 * PATCH /admin/tools/:id
 */
const updateTool = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const tool = await Tool_1.Tool.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
        if (!tool) {
            res.status(404).json({
                success: false,
                message: 'Tool not found'
            });
            return;
        }
        // Clear cache
        await cache_service_1.CacheService.delPattern('tools:*');
        await cache_service_1.CacheService.del(cache_service_1.CacheService.getToolKey(tool.slug));
        res.json({
            success: true,
            data: tool,
            message: 'Tool updated successfully'
        });
    }
    catch (error) {
        console.error('[updateTool] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update tool',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateTool = updateTool;
/**
 * Delete tool (soft delete)
 * DELETE /admin/tools/:id
 */
const deleteTool = async (req, res) => {
    try {
        const { id } = req.params;
        const tool = await Tool_1.Tool.findByIdAndUpdate(id, { $set: { status: 'archived' } }, { new: true });
        if (!tool) {
            res.status(404).json({
                success: false,
                message: 'Tool not found'
            });
            return;
        }
        // Clear cache
        await cache_service_1.CacheService.delPattern('tools:*');
        await cache_service_1.CacheService.del(cache_service_1.CacheService.getToolKey(tool.slug));
        res.json({
            success: true,
            message: 'Tool archived successfully'
        });
    }
    catch (error) {
        console.error('[deleteTool] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete tool',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deleteTool = deleteTool;
