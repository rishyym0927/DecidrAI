import { Request, Response } from 'express';
import { Tool, ITool } from '../models/Tool';
import { CacheService, CACHE_TTL } from '../services/cache.service';
import { SearchService } from '../services/search.service';



// ==================== PUBLIC CONTROLLERS ====================

/**
 * Get all tools with pagination and filters
 * GET /tools?page=1&limit=12&category=productivity&sort=popular
 */
export const getAllTools = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            page = 1,
            limit = 12,
            category,
            price,
            learning_curve,
            sort = 'newest'
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        // Build filter query
        const filter: any = { status: 'published' };

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
        const cacheKey = CacheService.getToolsListKey({ page, limit, category, price, learning_curve, sort });
        const cached = await CacheService.get<any>(cacheKey);

        if (cached) {
            res.json(cached);
            return;
        }

        // Build sort query
        let sortQuery: any = {};
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
            Tool.find(filter)
                .sort(sortQuery)
                .limit(limitNum)
                .skip(skip)
                .select('-__v')
                .lean(),
            Tool.countDocuments(filter)
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
        await CacheService.set(cacheKey, response, CACHE_TTL.TOOLS_LIST);

        res.json(response);
    } catch (error) {
        console.error('[getAllTools] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tools',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Get tool by slug
 * GET /tools/:slug
 */
export const getToolBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;

        // Check cache
        const cacheKey = CacheService.getToolKey(slug);
        const cached = await CacheService.get<ITool>(cacheKey);

        if (cached) {
            // Still increment view count even if cached
            await Tool.findOneAndUpdate(
                { slug, status: 'published' },
                { $inc: { view_count: 1 } }
            );

            res.json({ success: true, data: cached });
            return;
        }

        // Find and increment view count atomically
        const tool = await Tool.findOneAndUpdate(
            { slug, status: 'published' },
            { $inc: { view_count: 1 } },
            { new: true }
        )
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
        await CacheService.set(cacheKey, tool, CACHE_TTL.TOOL_DETAIL);

        res.json({ success: true, data: tool });
    } catch (error) {
        console.error('[getToolBySlug] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tool',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Search tools
 * GET /tools/search?q=chatgpt
 */
export const searchTools = async (req: Request, res: Response): Promise<void> => {
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
        const cacheKey = CacheService.getSearchKey(q);
        const cached = await CacheService.get<ITool[]>(cacheKey);

        if (cached) {
            res.json({ success: true, data: cached });
            return;
        }

        // Perform search
        const tools = await SearchService.searchTools(q, { limit: 50 });

        // Cache results
        await CacheService.set(cacheKey, tools, CACHE_TTL.SEARCH);

        res.json({ success: true, data: tools });
    } catch (error) {
        console.error('[searchTools] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Get related tools
 * GET /tools/:slug/related
 */
export const getRelatedTools = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;

        // Check cache
        const cacheKey = CacheService.getRelatedKey(slug);
        const cached = await CacheService.get<ITool[]>(cacheKey);

        if (cached) {
            res.json({ success: true, data: cached });
            return;
        }

        // Find the tool first
        const tool = await Tool.findOne({ slug, status: 'published' }).lean();

        if (!tool) {
            res.status(404).json({
                success: false,
                message: 'Tool not found'
            });
            return;
        }

        // Find related tools
        const relatedTools = await SearchService.findRelatedTools(
            tool._id.toString(),
            tool.categories,
            tool.problems_solved,
            5
        );

        // Cache results
        await CacheService.set(cacheKey, relatedTools, CACHE_TTL.RELATED);

        res.json({ success: true, data: relatedTools });
    } catch (error) {
        console.error('[getRelatedTools] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch related tools',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// ==================== ADMIN CONTROLLERS ====================

/**
 * Create new tool
 * POST /admin/tools
 */
export const createTool = async (req: Request, res: Response): Promise<void> => {
    try {
        const toolData = req.body;

        // Create tool
        const tool = new Tool(toolData);
        await tool.save();

        // Clear cache
        await CacheService.delPattern('tools:*');

        res.status(201).json({
            success: true,
            data: tool,
            message: 'Tool created successfully'
        });
    } catch (error) {
        console.error('[createTool] Error:', error);

        if ((error as any).code === 11000) {
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

/**
 * Update tool
 * PATCH /admin/tools/:id
 */
export const updateTool = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const tool = await Tool.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!tool) {
            res.status(404).json({
                success: false,
                message: 'Tool not found'
            });
            return;
        }

        // Clear cache
        await CacheService.delPattern('tools:*');
        await CacheService.del(CacheService.getToolKey(tool.slug));

        res.json({
            success: true,
            data: tool,
            message: 'Tool updated successfully'
        });
    } catch (error) {
        console.error('[updateTool] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update tool',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Delete tool (soft delete)
 * DELETE /admin/tools/:id
 */
export const deleteTool = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const tool = await Tool.findByIdAndUpdate(
            id,
            { $set: { status: 'archived' } },
            { new: true }
        );

        if (!tool) {
            res.status(404).json({
                success: false,
                message: 'Tool not found'
            });
            return;
        }

        // Clear cache
        await CacheService.delPattern('tools:*');
        await CacheService.del(CacheService.getToolKey(tool.slug));

        res.json({
            success: true,
            message: 'Tool archived successfully'
        });
    } catch (error) {
        console.error('[deleteTool] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete tool',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
