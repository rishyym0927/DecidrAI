/**
 * User-related TypeScript types
 * Matching auth-service API responses
 */

// User profile interface
export interface UserProfile {
    bio?: string;
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
    interests?: string[];
}

// User preferences interface
export interface UserPreferences {
    emailNotifications: boolean;
    theme: 'light' | 'dark' | 'system';
}

// Saved tool item
export interface SavedTool {
    toolId: string;
    savedAt: string;
    notes?: string;
    // Populated tool data (when populated)
    tool?: {
        _id: string;
        name: string;
        slug: string;
        tagline: string;
        logo_url?: string;
    };
}

// AI Stack item
export interface AiStackItem {
    toolId: string;
    category: string;
    notes?: string;
    addedAt: string;
    // Populated tool data (when populated)
    tool?: {
        _id: string;
        name: string;
        slug: string;
        tagline: string;
        logo_url?: string;
    };
}

// Full user interface
export interface User {
    _id: string;
    clerkUserId: string;
    email?: string;
    name?: string;
    image?: string;
    role: 'user' | 'admin';
    profile: UserProfile;
    savedTools: SavedTool[];
    aiStack: AiStackItem[];
    preferences: UserPreferences;
    createdAt: string;
    updatedAt: string;
}

// User update payload
export interface UpdateUserPayload {
    name?: string;
    bio?: string;
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
    interests?: string[];
    preferences?: Partial<UserPreferences>;
}

// Interaction types
export type InteractionEventType =
    | 'view'
    | 'click'
    | 'save'
    | 'compare'
    | 'flow_start'
    | 'flow_complete';

export interface Interaction {
    _id: string;
    userId?: string;
    sessionId: string;
    eventType: InteractionEventType;
    toolId?: string;
    flowId?: string;
    source?: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
}

export interface TrackInteractionPayload {
    sessionId: string;
    eventType: InteractionEventType;
    toolId?: string;
    flowId?: string;
    source?: string;
    metadata?: Record<string, unknown>;
}

// API Response types
export interface UserResponse {
    success: boolean;
    data: User;
}

export interface SavedToolsResponse {
    success: boolean;
    data: SavedTool[];
}

export interface AiStackResponse {
    success: boolean;
    data: AiStackItem[];
}

export interface InteractionsResponse {
    success: boolean;
    data: Interaction[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Admin types
export interface UsersListResponse {
    success: boolean;
    data: User[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface UserAnalytics {
    totalUsers: number;
    adminCount: number;
    recentSignups: number;
    experienceLevelStats: Array<{ _id: string; count: number }>;
    recentInteractions: Array<{ id: string; eventType: string; createdAt: string }>;
}

export interface UserAnalyticsResponse {
    success: boolean;
    data: UserAnalytics;
}
