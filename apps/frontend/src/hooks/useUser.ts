/**
 * React Query hooks for User/Auth API
 * For user profile, saved tools, AI stack, and interactions
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import {
    getCurrentUser,
    updateUserProfile,
    getSavedTools,
    saveTool,
    unsaveTool,
    getAiStack,
    addToAiStack,
    removeFromAiStack,
    trackInteraction,
    getUserInteractions
} from '@/lib/api';
import type {
    UserResponse,
    UpdateUserPayload,
    SavedToolsResponse,
    AiStackResponse,
    TrackInteractionPayload,
    InteractionsResponse
} from '@/types/user';

// ==================== PROFILE HOOKS ====================

/**
 * Get current user profile
 */
export const useCurrentUser = () => {
    const { isSignedIn } = useAuth();

    return useQuery<UserResponse>({
        queryKey: ['user', 'me'],
        queryFn: getCurrentUser,
        enabled: isSignedIn,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Update user profile mutation
 */
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateUserPayload) => updateUserProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
        },
    });
};

/**
 * Delete account mutation
 */
export const useDeleteAccount = () => {
    const queryClient = useQueryClient();
    const { signOut } = useAuth();
    const { deleteAccount } = require('@/lib/api');

    return useMutation({
        mutationFn: () => deleteAccount(),
        onSuccess: async () => {
            // Clear all user data from cache
            queryClient.clear();
            // Sign out the user (this will also clear Clerk session)
            await signOut();
        },
    });
};

// ==================== SAVED TOOLS HOOKS ====================

/**
 * Get user's saved tools
 */
export const useSavedTools = () => {
    const { isSignedIn } = useAuth();

    return useQuery<SavedToolsResponse>({
        queryKey: ['user', 'saved-tools'],
        queryFn: getSavedTools,
        enabled: isSignedIn,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Save a tool mutation
 */
export const useSaveTool = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ toolId, notes }: { toolId: string; notes?: string }) =>
            saveTool(toolId, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'saved-tools'] });
        },
    });
};

/**
 * Unsave a tool mutation
 */
export const useUnsaveTool = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (toolId: string) => unsaveTool(toolId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'saved-tools'] });
        },
    });
};

/**
 * Check if a tool is saved
 */
export const useIsToolSaved = (toolId: string) => {
    const { data } = useSavedTools();
    return data?.data?.some(saved => saved.toolId === toolId) ?? false;
};

// ==================== AI STACK HOOKS ====================

/**
 * Get user's AI stack
 */
export const useAiStack = () => {
    const { isSignedIn } = useAuth();

    return useQuery<AiStackResponse>({
        queryKey: ['user', 'ai-stack'],
        queryFn: getAiStack,
        enabled: isSignedIn,
        staleTime: 2 * 60 * 1000,
    });
};

/**
 * Add to AI stack mutation
 */
export const useAddToAiStack = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ toolId, category, notes }: { toolId: string; category: string; notes?: string }) =>
            addToAiStack(toolId, category, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'ai-stack'] });
        },
    });
};

/**
 * Remove from AI stack mutation
 */
export const useRemoveFromAiStack = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (toolId: string) => removeFromAiStack(toolId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'ai-stack'] });
        },
    });
};

// ==================== INTERACTION HOOKS ====================

/**
 * Track interaction mutation
 */
export const useTrackInteraction = () => {
    return useMutation({
        mutationFn: (data: TrackInteractionPayload) => trackInteraction(data),
    });
};

/**
 * Get user's interactions
 */
export const useUserInteractions = (params?: {
    eventType?: string;
    toolId?: string;
    page?: number;
    limit?: number;
}) => {
    const { isSignedIn } = useAuth();

    return useQuery<InteractionsResponse>({
        queryKey: ['user', 'interactions', params],
        queryFn: () => getUserInteractions(params),
        enabled: isSignedIn,
    });
};
