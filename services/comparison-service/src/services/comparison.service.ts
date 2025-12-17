import mongoose from 'mongoose';
import { Comparison, IComparison } from '../models/Comparison';
import { fetchToolsBySlugs, generateComparison, ToolData } from '../generators/comparisonGenerator';
import { getCache, setCache, getComparisonCacheKey, CACHE_TTL } from './cache.service';

/**
 * Comparison response structure
 */
export interface ComparisonResponse {
    id: string;
    tools: {
        slug: string;
        name: string;
        tagline?: string;
        pricing: string;
    }[];
    summary: string;
    winnerScenarios: {
        toolSlug: string;
        scenario: string;
        reasoning: string;
    }[];
    featureComparison: {
        feature: string;
        description?: string;
        toolValues: Record<string, string>;
    }[];
    generatedAt: Date;
    viewCount: number;
    cached: boolean;
}

/**
 * Get or generate comparison by tool slugs
 */
export async function getOrCreateComparison(
    slugs: string[],
    options: { forceRegenerate?: boolean } = {}
): Promise<ComparisonResponse | null> {
    const { forceRegenerate = false } = options;

    // Sort slugs for consistent lookup
    const sortedSlugs = [...slugs].sort();
    const cacheKey = getComparisonCacheKey(sortedSlugs);

    // Check Redis cache first (unless force regenerate)
    if (!forceRegenerate) {
        const cached = await getCache<ComparisonResponse>(cacheKey);
        if (cached) {
            console.log('[ComparisonService] Cache hit for:', sortedSlugs);
            return { ...cached, cached: true };
        }

        // Check MongoDB for existing comparison
        const existing = await Comparison.findOne({
            toolSlugs: { $all: sortedSlugs, $size: sortedSlugs.length }
        });

        if (existing && existing.cacheUntil > new Date()) {
            // Increment view count
            existing.viewCount += 1;
            await existing.save();

            const response = formatComparisonResponse(existing, [], true);
            await setCache(cacheKey, response, CACHE_TTL.COMPARISON);
            return response;
        }
    }

    // Fetch tools from tool-service
    const tools = await fetchToolsBySlugs(sortedSlugs);

    if (tools.length < 2) {
        console.error('[ComparisonService] Not enough tools found:', tools.length);
        return null;
    }

    // Generate comparison using AI
    console.log('[ComparisonService] Generating comparison for:', sortedSlugs);
    const generated = await generateComparison(tools);

    // Save to MongoDB
    const comparison = new Comparison({
        toolIds: tools.map(t => new mongoose.Types.ObjectId(t._id)),
        toolSlugs: sortedSlugs,
        summary: generated.summary,
        winnerScenarios: generated.winnerScenarios.map(ws => ({
            toolId: new mongoose.Types.ObjectId(tools.find(t => t.slug === ws.toolSlug)?._id),
            toolSlug: ws.toolSlug,
            scenario: ws.scenario,
            reasoning: ws.reasoning
        })),
        featureComparison: generated.featureComparison.map(fc => ({
            feature: fc.feature,
            description: fc.description,
            toolValues: new Map(Object.entries(fc.toolValues))
        })),
        generatedAt: new Date(),
        cacheUntil: new Date(Date.now() + CACHE_TTL.COMPARISON * 1000),
        viewCount: 1
    });

    await comparison.save();

    // Format response
    const response = formatComparisonResponse(comparison, tools, false);

    // Cache in Redis
    await setCache(cacheKey, response, CACHE_TTL.COMPARISON);

    return response;
}

/**
 * Format comparison document to response
 */
function formatComparisonResponse(
    comparison: IComparison,
    tools: ToolData[],
    cached: boolean
): ComparisonResponse {
    return {
        id: comparison._id.toString(),
        tools: comparison.toolSlugs.map(slug => {
            const tool = tools.find(t => t.slug === slug);
            return {
                slug,
                name: tool?.name || slug,
                tagline: tool?.tagline,
                pricing: tool?.pricing.model || 'Unknown'
            };
        }),
        summary: comparison.summary,
        winnerScenarios: comparison.winnerScenarios.map(ws => ({
            toolSlug: ws.toolSlug,
            scenario: ws.scenario,
            reasoning: ws.reasoning
        })),
        featureComparison: comparison.featureComparison.map(fc => ({
            feature: fc.feature,
            description: fc.description,
            toolValues: Object.fromEntries(fc.toolValues)
        })),
        generatedAt: comparison.generatedAt,
        viewCount: comparison.viewCount,
        cached
    };
}

/**
 * Get popular comparisons
 */
export async function getPopularComparisons(limit: number = 5): Promise<ComparisonResponse[]> {
    const comparisons = await Comparison.find()
        .sort({ viewCount: -1 })
        .limit(limit)
        .lean();

    return comparisons.map(c => formatComparisonResponse(c as IComparison, [], true));
}
