/**
 * Comparison-related TypeScript types
 */

import { Tool } from './tool';

export interface ComparisonScenario {
    title: string;
    winner: string; // tool slug
    reasoning: string;
}

export interface FeatureComparison {
    feature: string;
    tools: Record<string, string>; // toolSlug -> value
}

export interface Comparison {
    _id: string;
    toolSlugs: string[];
    tools: Tool[];
    winner: ComparisonScenario[];
    features: FeatureComparison[];
    summary: string;
    generatedAt: string;
    viewCount: number;
}

export interface ComparisonResponse {
    success: boolean;
    data: Comparison;
}

export interface PopularComparisonsResponse {
    success: boolean;
    data: {
        comparisons: Array<{
            toolSlugs: string[];
            viewCount: number;
        }>;
    };
}
