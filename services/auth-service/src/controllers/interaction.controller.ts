// services/auth-service/src/controllers/interaction.controller.ts
import { Request, Response } from "express";
import {
    trackInteraction,
    getUserInteractions
} from "../services/interaction.service";
import { getUserByClerkId } from "../services/user.service";

/**
 * POST /auth/interactions - Track a user interaction
 */
export async function trackInteractionHandler(req: Request, res: Response) {
    try {
        const { userId: clerkUserId } = (req as any).auth;
        const {
            sessionId,
            eventType,
            toolId,
            flowId,
            source,
            metadata
        } = req.body;

        if (!sessionId || !eventType) {
            return res.status(400).json({
                success: false,
                error: "sessionId and eventType are required"
            });
        }

        // Validate eventType
        const validEventTypes = ["view", "click", "save", "compare", "flow_start", "flow_complete"];
        if (!validEventTypes.includes(eventType)) {
            return res.status(400).json({
                success: false,
                error: `eventType must be one of: ${validEventTypes.join(", ")}`
            });
        }

        // Get internal user ID
        const user = await getUserByClerkId(clerkUserId);

        const interaction = await trackInteraction({
            userId: user?._id?.toString(),
            sessionId,
            eventType,
            toolId,
            flowId,
            source,
            metadata,
            userAgent: req.get("user-agent"),
            ipAddress: req.ip
        });

        return res.status(201).json({
            success: true,
            data: { id: interaction._id }
        });
    } catch (error) {
        console.error("[Interaction Controller] Error tracking interaction:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to track interaction"
        });
    }
}

/**
 * GET /auth/interactions - Get user's interactions
 */
export async function getUserInteractionsHandler(req: Request, res: Response) {
    try {
        const { userId: clerkUserId } = (req as any).auth;
        const { eventType, toolId, page, limit } = req.query;

        // Get internal user ID
        const user = await getUserByClerkId(clerkUserId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        const result = await getUserInteractions(
            user._id.toString(),
            {
                eventType: eventType as string,
                toolId: toolId as string
            },
            {
                page: page ? parseInt(page as string) : 1,
                limit: limit ? parseInt(limit as string) : 50
            }
        );

        return res.json({
            success: true,
            data: result.interactions,
            pagination: result.pagination
        });
    } catch (error) {
        console.error("[Interaction Controller] Error fetching interactions:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch interactions"
        });
    }
}
