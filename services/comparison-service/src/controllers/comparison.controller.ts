import { Request, Response } from 'express';
import { getOrCreateComparison, getPopularComparisons } from '../services/comparison.service';

/**
 * Get or generate comparison by tool slugs
 * GET /compare?tools=slug1,slug2&regenerate=false
 */
export const getComparison = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tools, regenerate } = req.query;

        if (!tools || typeof tools !== 'string') {
            res.status(400).json({
                success: false,
                message: 'Query parameter "tools" is required (comma-separated slugs)'
            });
            return;
        }

        const slugs = tools.split(',').map(s => s.trim()).filter(Boolean);

        if (slugs.length < 2) {
            res.status(400).json({
                success: false,
                message: 'At least 2 tool slugs are required for comparison'
            });
            return;
        }

        if (slugs.length > 4) {
            res.status(400).json({
                success: false,
                message: 'Maximum 4 tools can be compared at once'
            });
            return;
        }

        const comparison = await getOrCreateComparison(slugs, {
            forceRegenerate: regenerate === 'true'
        });

        if (!comparison) {
            res.status(404).json({
                success: false,
                message: 'One or more tools not found. Make sure the slugs are correct.'
            });
            return;
        }

        res.json({
            success: true,
            data: comparison
        });
    } catch (error) {
        console.error('[ComparisonController] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate comparison',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Generate a new comparison (POST version)
 * POST /compare
 * Body: { tools: ["slug1", "slug2"] }
 */
export const createComparison = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tools } = req.body;

        if (!tools || !Array.isArray(tools)) {
            res.status(400).json({
                success: false,
                message: 'Request body must contain "tools" array of slugs'
            });
            return;
        }

        if (tools.length < 2 || tools.length > 4) {
            res.status(400).json({
                success: false,
                message: 'Between 2 and 4 tool slugs are required'
            });
            return;
        }

        const comparison = await getOrCreateComparison(tools, {
            forceRegenerate: true
        });

        if (!comparison) {
            res.status(404).json({
                success: false,
                message: 'One or more tools not found'
            });
            return;
        }

        res.status(201).json({
            success: true,
            data: comparison
        });
    } catch (error) {
        console.error('[ComparisonController] Create error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create comparison',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Get popular comparisons
 * GET /compare/popular
 */
export const getPopular = async (req: Request, res: Response): Promise<void> => {
    try {
        const { limit = 5 } = req.query;
        const comparisons = await getPopularComparisons(Number(limit));

        res.json({
            success: true,
            data: comparisons
        });
    } catch (error) {
        console.error('[ComparisonController] Popular error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch popular comparisons'
        });
    }
};
