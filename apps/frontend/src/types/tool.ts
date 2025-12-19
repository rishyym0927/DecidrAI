/**
 * Tool-related TypeScript types
 * Matching actual backend API response
 */

export interface Tool {
    _id: string;
    name: string;
    slug: string;
    tagline: string;
    description: string;
    long_description?: string;
    logo_url?: string;
    website_url: string;
    categories: string[];
    problems_solved: string[];
    use_cases: string[];
    pricing: {
        model: 'free' | 'freemium' | 'paid' | 'enterprise';
        starting_price: number;
        tiers?: Array<{
            name: string;
            price: number;
            features: string[];
            _id?: string;
        }>;
    };
    best_for: string[];
    not_good_for: string[];
    learning_curve: string;
    has_api: boolean;
    integrations: string[];
    platforms: string[];
    privacy_concerns?: string;
    data_location?: string;
    last_verified?: string;
    is_sponsored: boolean;
    view_count: number;
    click_count: number;
    alternatives: string[];
    similar_tools: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
    score?: number; // Only in search results
}

export interface ToolFilters {
    category?: string;
    price?: string;
    learning_curve?: string;
    page?: number;
    limit?: number;
    sort?: 'popular' | 'newest' | 'price-low' | 'price-high';
}

export interface ToolsListResponse {
    success: boolean;
    data: {
        tools: Tool[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
}

export interface ToolsSearchResponse {
    success: boolean;
    data: Tool[]; // Note: Search returns array directly, not { tools: [] }
}

export interface ToolDetailResponse {
    success: boolean;
    data: Tool;
}
