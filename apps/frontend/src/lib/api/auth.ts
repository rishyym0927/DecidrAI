/**
 * Auth Service API endpoints
 * For user profile, saved tools, AI stack, and interactions
 */

import api from '../axios';
import type {
    User,
    UserResponse,
    UpdateUserPayload,
    SavedToolsResponse,
    AiStackResponse,
    TrackInteractionPayload,
    InteractionsResponse
} from '@/types/user';

// ==================== PROFILE ====================

/**
 * Get current user profile
 */
export const getCurrentUser = (): Promise<UserResponse> => {
    return api.get('/auth/me');
};

/**
 * Update current user profile
 */
export const updateUserProfile = (data: UpdateUserPayload): Promise<UserResponse> => {
    return api.patch('/auth/me', data);
};

/**
 * Delete current user account
 * This removes user data from the database
 */
export const deleteAccount = (): Promise<{ success: boolean; message: string }> => {
    return api.delete('/auth/me');
};

// ==================== SAVED TOOLS ====================

/**
 * Get user's saved tools
 */
export const getSavedTools = (): Promise<SavedToolsResponse> => {
    return api.get('/auth/me/saved-tools');
};

/**
 * Save a tool
 */
export const saveTool = (toolId: string, notes?: string): Promise<{ success: boolean; message: string }> => {
    return api.post(`/auth/me/saved-tools/${toolId}`, { notes });
};

/**
 * Unsave a tool
 */
export const unsaveTool = (toolId: string): Promise<{ success: boolean; message: string }> => {
    return api.delete(`/auth/me/saved-tools/${toolId}`);
};

// ==================== AI STACK ====================

/**
 * Get user's AI stack
 */
export const getAiStack = (): Promise<AiStackResponse> => {
    return api.get('/auth/me/ai-stack');
};

/**
 * Add tool to AI stack
 */
export const addToAiStack = (
    toolId: string,
    category: string,
    notes?: string
): Promise<{ success: boolean; message: string }> => {
    return api.post('/auth/me/ai-stack', { toolId, category, notes });
};

/**
 * Remove tool from AI stack
 */
export const removeFromAiStack = (toolId: string): Promise<{ success: boolean; message: string }> => {
    return api.delete(`/auth/me/ai-stack/${toolId}`);
};

// ==================== INTERACTIONS ====================

/**
 * Track a user interaction
 */
export const trackInteraction = (
    data: TrackInteractionPayload
): Promise<{ success: boolean; data: { id: string } }> => {
    return api.post('/auth/interactions', data);
};

/**
 * Get user's interactions
 */
export const getUserInteractions = (params?: {
    eventType?: string;
    toolId?: string;
    page?: number;
    limit?: number;
}): Promise<InteractionsResponse> => {
    return api.get('/auth/interactions', { params });
};
