/**
 * Tool types
 */
export interface Tool {
    _id: string;
    name: string;
    slug: string;
    tagline?: string;
    description: string;
    logo_url?: string;
    website_url?: string;
    categories: string[];
    problems_solved: string[];
    use_cases: string[];
    pricing: {
        model: 'free' | 'freemium' | 'paid' | 'enterprise';
        starting_price?: number;
        tiers?: {
            name: string;
            price: number;
            features: string[];
        }[];
    };
    best_for: string[];
    not_good_for: string[];
    learning_curve: 'low' | 'medium' | 'high';
    has_api: boolean;
    integrations: string[];
    platforms: string[];
    status: 'draft' | 'published' | 'archived';
    view_count: number;
    click_count: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Flow types
 */
export interface FlowQuestion {
    id: string;
    text: string;
    type: 'single' | 'multiple' | 'text' | 'scale';
    required: boolean;
    options?: {
        id: string;
        text: string;
        tags: string[];
    }[];
}

export interface Flow {
    _id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    questions: FlowQuestion[];
    status: 'draft' | 'published' | 'archived';
    createdAt: Date;
    updatedAt: Date;
}

export interface FlowSession {
    _id: string;
    flowId: string;
    sessionId: string;
    answers: Record<string, unknown>[];
    extractedTags: string[];
    status: 'in_progress' | 'completed' | 'expired';
    currentQuestionIndex: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * User types
 */
export interface User {
    _id: string;
    clerkUserId: string;
    email: string;
    name?: string;
    image?: string;
    role: 'user' | 'admin' | 'super_admin';
    createdAt: Date;
    updatedAt: Date;
}

/**
 * API Response types
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

/**
 * Comparison types
 */
export interface Comparison {
    _id: string;
    toolSlugs: string[];
    summary: string;
    winnerScenarios: {
        toolSlug: string;
        scenario: string;
        reasoning: string;
    }[];
    featureComparison: {
        feature: string;
        toolValues: Record<string, string>;
    }[];
    generatedAt: Date;
    viewCount: number;
}

/**
 * Recommendation types
 */
export interface Recommendation {
    tool: Tool;
    score: number;
    explanation: string;
    matchedTags: string[];
}
