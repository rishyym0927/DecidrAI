import { fetchTools, matchToolsToTags, fetchFlowSession, Tool, ScoredTool } from '../matchers/tagMatcher';
import { rankTools } from '../ranking/ranking';
import { generateExplanations, Explanation } from '../explainers/explainer';
import {
    getCache,
    setCache,
    getRecommendationCacheKey,
    getSessionRecCacheKey,
    createTagsHash,
    CACHE_TTL
} from './cache.service';

/**
 * Recommendation result structure
 */
export interface RecommendationResult {
    tool: {
        id: string;
        name: string;
        slug: string;
        tagline?: string;
        logo_url?: string;
        pricing: {
            model: string;
            starting_price?: number;
        };
    };
    score: number;
    rank: number;
    reasoning: Explanation;
    affiliate_link?: string;
    is_sponsored: boolean;
}

/**
 * Full recommendation response
 */
export interface RecommendationResponse {
    recommendations: RecommendationResult[];
    totalMatched: number;
    extractedTags: string[];
    cached: boolean;
}

/**
 * Get recommendations based on user tags
 */
export async function getRecommendationsByTags(
    userTags: string[],
    options: {
        limit?: number;
        useAI?: boolean;
        skipCache?: boolean;
    } = {}
): Promise<RecommendationResponse> {
    const { limit = 3, useAI = true, skipCache = false } = options;

    // Check cache first
    const tagsHash = createTagsHash(userTags);
    const cacheKey = getRecommendationCacheKey(tagsHash);

    if (!skipCache) {
        const cached = await getCache<RecommendationResponse>(cacheKey);
        if (cached) {
            console.log('[RecommendationService] Cache hit for tags:', tagsHash);
            return { ...cached, cached: true };
        }
    }

    // Fetch tools from tool-service
    const tools = await fetchTools();

    if (tools.length === 0) {
        return {
            recommendations: [],
            totalMatched: 0,
            extractedTags: userTags,
            cached: false
        };
    }

    // Match and score tools
    const scoredTools = matchToolsToTags(tools, userTags);
    const totalMatched = scoredTools.length;

    // Rank and get top N
    const topTools = rankTools(scoredTools, { topN: limit });

    // Generate explanations
    const explanations = await generateExplanations(topTools, userTags, useAI);

    // Build response
    const recommendations: RecommendationResult[] = topTools.map((item, index) => ({
        tool: {
            id: item.tool._id,
            name: item.tool.name,
            slug: item.tool.slug,
            tagline: item.tool.tagline,
            pricing: item.tool.pricing
        },
        score: Math.round(item.score),
        rank: index + 1,
        reasoning: explanations.get(item.tool._id) || {
            whyRecommended: 'This tool matches your requirements.',
            bestFor: 'Works well for your use case.',
            whenNotToUse: 'Generally applicable.'
        },
        affiliate_link: item.tool.affiliate_link,
        is_sponsored: item.tool.is_sponsored
    }));

    const response: RecommendationResponse = {
        recommendations,
        totalMatched,
        extractedTags: userTags,
        cached: false
    };

    // Cache the response
    await setCache(cacheKey, response, CACHE_TTL.RECOMMENDATIONS);

    return response;
}

/**
 * Get recommendations for a flow session
 */
export async function getRecommendationsForSession(
    sessionId: string,
    options: {
        limit?: number;
        useAI?: boolean;
        skipCache?: boolean;
    } = {}
): Promise<RecommendationResponse | null> {
    const { limit = 3, useAI = true, skipCache = false } = options;

    // Check session-specific cache
    const sessionCacheKey = getSessionRecCacheKey(sessionId);

    if (!skipCache) {
        const cached = await getCache<RecommendationResponse>(sessionCacheKey);
        if (cached) {
            console.log('[RecommendationService] Cache hit for session:', sessionId);
            return { ...cached, cached: true };
        }
    }

    // Fetch session data from flow-service
    const session = await fetchFlowSession(sessionId);

    if (!session || session.extractedTags.length === 0) {
        console.log('[RecommendationService] No tags found for session:', sessionId);
        return null;
    }

    // Get recommendations using extracted tags
    const response = await getRecommendationsByTags(session.extractedTags, {
        limit,
        useAI,
        skipCache: true // We'll cache at session level
    });

    // Cache at session level (shorter TTL since session might be updated)
    await setCache(sessionCacheKey, response, CACHE_TTL.SESSION_DATA);

    return response;
}
