/**
 * Tool-related TypeScript types
 */

export interface Tool {
    _id: string;
    name: string;
    slug: string;
    tagline: string;
    description: string;
    category: string;
    subcategory?: string;
    website: string;
    logo?: string;
    pricing: {
        model: 'free' | 'freemium' | 'paid' | 'enterprise';
        startingPrice?: number;
        currency?: string;
    };
    features: string[];
    tags: string[];
    rating?: number;
    reviewCount?: number;
    viewCount?: number;
    isActive: boolean;
    isFeatured: boolean;
    isSponsored: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ToolFilters {
    category?: string;
    pricing?: string;
    tags?: string[];
    search?: string;
    page?: number;
    limit?: number;
    sort?: 'popular' | 'newest' | 'rating';
}

export interface ToolsResponse {
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

export interface ToolResponse {
    success: boolean;
    data: Tool;
}
