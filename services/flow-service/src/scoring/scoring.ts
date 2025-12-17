/**
 * Scoring utilities for flow-based recommendations
 * These utilities calculate match scores based on extracted tags
 */

export interface ScoringWeights {
    price: number;
    learningCurve: number;
    features: number;
}

/**
 * Calculate tag overlap score between user tags and tool tags
 * Returns a score between 0 and 100
 */
export function calculateTagScore(
    toolTags: string[],
    userTags: string[],
    requiredTags: string[] = [],
    optionalTags: string[] = []
): number {
    if (userTags.length === 0) return 0;

    const toolTagSet = new Set(toolTags.map(t => t.toLowerCase()));
    const userTagSet = new Set(userTags.map(t => t.toLowerCase()));

    // Check required tags first
    let requiredMatches = 0;
    let requiredTotal = requiredTags.length;

    for (const tag of requiredTags) {
        if (toolTagSet.has(tag.toLowerCase()) && userTagSet.has(tag.toLowerCase())) {
            requiredMatches++;
        }
    }

    // If required tags exist and not all are met, heavily penalize
    if (requiredTotal > 0) {
        const requiredScore = (requiredMatches / requiredTotal);
        if (requiredScore < 0.5) {
            return Math.round(requiredScore * 30); // Max 30 points if less than half required
        }
    }

    // Calculate overlap between user tags and tool tags
    let overlapCount = 0;
    for (const tag of userTags) {
        if (toolTagSet.has(tag.toLowerCase())) {
            overlapCount++;
        }
    }

    const overlapScore = (overlapCount / userTags.length) * 70; // Max 70 points from overlap

    // Bonus for optional tag matches
    let optionalBonus = 0;
    for (const tag of optionalTags) {
        if (toolTagSet.has(tag.toLowerCase()) && userTagSet.has(tag.toLowerCase())) {
            optionalBonus += 5;
        }
    }
    optionalBonus = Math.min(optionalBonus, 30); // Cap at 30 bonus points

    // Required tags score (if any)
    const requiredScore = requiredTotal > 0
        ? (requiredMatches / requiredTotal) * 30
        : 0;

    return Math.min(100, Math.round(overlapScore + requiredScore + optionalBonus));
}

/**
 * Apply scoring weights to adjust the base score
 */
export function applyWeights(
    baseScore: number,
    toolAttributes: {
        priceModel?: 'free' | 'freemium' | 'paid';
        learningCurve?: 'low' | 'medium' | 'high';
        hasApi?: boolean;
    },
    userPreferences: {
        budget?: 'free' | 'freemium' | 'paid' | 'any';
        learningCurve?: 'low' | 'medium' | 'high' | 'any';
        needsApi?: boolean;
    },
    weights: ScoringWeights
): number {
    let adjustedScore = baseScore;

    // Price adjustment
    if (userPreferences.budget && userPreferences.budget !== 'any') {
        if (toolAttributes.priceModel === userPreferences.budget) {
            adjustedScore += weights.price * 2;
        } else if (userPreferences.budget === 'free' && toolAttributes.priceModel === 'freemium') {
            adjustedScore += weights.price; // Partial match
        } else if (userPreferences.budget === 'paid' && toolAttributes.priceModel !== 'paid') {
            // No penalty, they can afford more
        } else {
            adjustedScore -= weights.price;
        }
    }

    // Learning curve adjustment
    if (userPreferences.learningCurve && userPreferences.learningCurve !== 'any') {
        if (toolAttributes.learningCurve === userPreferences.learningCurve) {
            adjustedScore += weights.learningCurve * 2;
        } else {
            const curveMap = { low: 1, medium: 2, high: 3 };
            const userCurve = curveMap[userPreferences.learningCurve];
            const toolCurve = curveMap[toolAttributes.learningCurve || 'medium'];

            // Penalize if tool is harder than user wants
            if (toolCurve > userCurve) {
                adjustedScore -= weights.learningCurve * (toolCurve - userCurve);
            }
        }
    }

    // API requirement
    if (userPreferences.needsApi && !toolAttributes.hasApi) {
        adjustedScore -= weights.features * 3; // Significant penalty
    }

    return Math.max(0, Math.min(100, Math.round(adjustedScore)));
}

/**
 * Rank tools by score
 */
export function rankToolsByScore<T extends { score: number }>(tools: T[]): T[] {
    return [...tools].sort((a, b) => b.score - a.score);
}
