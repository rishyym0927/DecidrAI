import { ScoredTool } from '../matchers/tagMatcher';

/**
 * Sort tools by score in descending order
 */
export function rankByScore(tools: ScoredTool[]): ScoredTool[] {
    return [...tools].sort((a, b) => b.score - a.score);
}

/**
 * Apply diversity penalty to avoid same-category clustering
 * Reduces score of tools that share categories with higher-ranked tools
 */
export function applyDiversityPenalty(tools: ScoredTool[], penaltyPercent: number = 10): ScoredTool[] {
    if (tools.length <= 1) return tools;

    const result: ScoredTool[] = [];
    const seenCategories = new Set<string>();

    for (const tool of tools) {
        let adjustedScore = tool.score;

        // Check for category overlap with already selected tools
        const toolCategories = tool.tool.categories || [];
        const overlappingCategories = toolCategories.filter(cat => seenCategories.has(cat.toLowerCase()));

        if (overlappingCategories.length > 0) {
            // Apply penalty for each overlapping category
            const penalty = (overlappingCategories.length / toolCategories.length) * penaltyPercent;
            adjustedScore = Math.max(0, adjustedScore - penalty);
        }

        // Add categories to seen set
        toolCategories.forEach(cat => seenCategories.add(cat.toLowerCase()));

        result.push({
            ...tool,
            score: adjustedScore
        });
    }

    // Re-sort after applying penalties
    return result.sort((a, b) => b.score - a.score);
}

/**
 * Get top N recommendations
 */
export function getTopN(tools: ScoredTool[], n: number = 3): ScoredTool[] {
    return tools.slice(0, n);
}

/**
 * Apply sponsored boost (slight preference for sponsored tools at similar scores)
 */
export function applySponsoredBoost(tools: ScoredTool[], boostPercent: number = 5): ScoredTool[] {
    return tools.map(item => {
        if (item.tool.is_sponsored) {
            return {
                ...item,
                score: Math.min(100, item.score + boostPercent)
            };
        }
        return item;
    });
}

/**
 * Full ranking pipeline
 */
export function rankTools(
    tools: ScoredTool[],
    options: {
        applyDiversity?: boolean;
        applySponsoredBoost?: boolean;
        topN?: number;
    } = {}
): ScoredTool[] {
    const {
        applyDiversity = true,
        applySponsoredBoost: sponsoredBoost = true,
        topN = 3
    } = options;

    let ranked = rankByScore(tools);

    if (sponsoredBoost) {
        ranked = applySponsoredBoost(ranked);
        ranked = rankByScore(ranked); // Re-sort after boost
    }

    if (applyDiversity) {
        ranked = applyDiversityPenalty(ranked);
    }

    return getTopN(ranked, topN);
}
