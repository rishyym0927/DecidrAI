/**
 * Recommendation-related TypeScript types
 */

import { Tool } from './tool';

export interface RecommendationRequest {
    tags: string[];
    limit?: number;
    excludeSponsored?: boolean;
}

export interface RecommendedTool {
    tool: Tool;
    score: number;
    matchedTags: string[];
    explanation?: string;
}

export interface RecommendationResponse {
    success: boolean;
    data: {
        recommendations: RecommendedTool[];
        totalMatched: number;
        aiExplanation?: string;
    };
}

export interface SessionRecommendationResponse {
    success: boolean;
    data: {
        sessionId: string;
        extractedTags: string[];
        recommendations: RecommendedTool[];
        aiExplanation?: string;
    };
}
