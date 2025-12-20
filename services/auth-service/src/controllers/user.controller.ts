// services/auth-service/src/controllers/user.controller.ts
import { Request, Response } from "express";
import {
    getUserByClerkId,
    updateUserProfile,
    getSavedTools,
    saveTool,
    unsaveTool,
    getAiStack,
    addToAiStack,
    removeFromAiStack
} from "../services/user.service";

// ==================== PROFILE ENDPOINTS ====================

/**
 * GET /auth/me - Get current user profile
 */
export async function getMe(req: Request, res: Response) {
    try {
        const { userId } = (req as any).auth;
        const user = await getUserByClerkId(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        return res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("[User Controller] Error fetching user:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch user"
        });
    }
}

/**
 * PATCH /auth/me - Update current user profile
 */
export async function updateMe(req: Request, res: Response) {
    try {
        const { userId } = (req as any).auth;
        const { name, bio, experienceLevel, interests, preferences } = req.body;

        const user = await updateUserProfile(userId, {
            name,
            bio,
            experienceLevel,
            interests,
            preferences
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        return res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("[User Controller] Error updating profile:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to update profile"
        });
    }
}

// ==================== SAVED TOOLS ENDPOINTS ====================

/**
 * GET /auth/me/saved-tools - Get user's saved tools
 */
export async function getSavedToolsHandler(req: Request, res: Response) {
    try {
        const { userId } = (req as any).auth;
        const savedTools = await getSavedTools(userId);

        return res.json({
            success: true,
            data: savedTools
        });
    } catch (error) {
        console.error("[User Controller] Error fetching saved tools:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch saved tools"
        });
    }
}

/**
 * POST /auth/me/saved-tools/:toolId - Save a tool
 */
export async function saveToolHandler(req: Request, res: Response) {
    try {
        const { userId } = (req as any).auth;
        const { toolId } = req.params;
        const { notes } = req.body;

        const user = await saveTool(userId, toolId, notes);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Tool saved successfully"
        });
    } catch (error) {
        console.error("[User Controller] Error saving tool:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to save tool"
        });
    }
}

/**
 * DELETE /auth/me/saved-tools/:toolId - Unsave a tool
 */
export async function unsaveToolHandler(req: Request, res: Response) {
    try {
        const { userId } = (req as any).auth;
        const { toolId } = req.params;

        await unsaveTool(userId, toolId);

        return res.json({
            success: true,
            message: "Tool removed from saved"
        });
    } catch (error) {
        console.error("[User Controller] Error unsaving tool:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to unsave tool"
        });
    }
}

// ==================== AI STACK ENDPOINTS ====================

/**
 * GET /auth/me/ai-stack - Get user's AI stack
 */
export async function getAiStackHandler(req: Request, res: Response) {
    try {
        const { userId } = (req as any).auth;
        const aiStack = await getAiStack(userId);

        return res.json({
            success: true,
            data: aiStack
        });
    } catch (error) {
        console.error("[User Controller] Error fetching AI stack:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch AI stack"
        });
    }
}

/**
 * POST /auth/me/ai-stack - Add tool to AI stack
 */
export async function addToAiStackHandler(req: Request, res: Response) {
    try {
        const { userId } = (req as any).auth;
        const { toolId, category, notes } = req.body;

        if (!toolId || !category) {
            return res.status(400).json({
                success: false,
                error: "toolId and category are required"
            });
        }

        const user = await addToAiStack(userId, toolId, category, notes);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Tool added to AI stack"
        });
    } catch (error) {
        console.error("[User Controller] Error adding to AI stack:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to add to AI stack"
        });
    }
}

/**
 * DELETE /auth/me/ai-stack/:toolId - Remove from AI stack
 */
export async function removeFromAiStackHandler(req: Request, res: Response) {
    try {
        const { userId } = (req as any).auth;
        const { toolId } = req.params;

        await removeFromAiStack(userId, toolId);

        return res.json({
            success: true,
            message: "Tool removed from AI stack"
        });
    } catch (error) {
        console.error("[User Controller] Error removing from AI stack:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to remove from AI stack"
        });
    }
}

// ==================== ACCOUNT DELETION ====================

/**
 * DELETE /auth/me - Delete current user account
 * This removes user data from MongoDB. 
 * Frontend should call Clerk's user.delete() after this succeeds.
 */
export async function deleteMe(req: Request, res: Response) {
    try {
        const { userId } = (req as any).auth;

        // Delete user from MongoDB
        const { deleteUser } = await import("../services/user.service");
        const result = await deleteUser(userId);

        if (!result) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        return res.json({
            success: true,
            message: "Account deleted successfully"
        });
    } catch (error) {
        console.error("[User Controller] Error deleting account:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to delete account"
        });
    }
}
