// services/auth-service/src/services/interaction.service.ts
import { Interaction, IInteraction } from "../models/Interaction";
import { Types } from "mongoose";

interface TrackInteractionData {
    userId?: string;
    sessionId: string;
    eventType: "view" | "click" | "save" | "compare" | "flow_start" | "flow_complete";
    toolId?: string;
    flowId?: string;
    source?: string;
    metadata?: Record<string, unknown>;
    userAgent?: string;
    ipAddress?: string;
}

export async function trackInteraction(data: TrackInteractionData) {
    const interaction = new Interaction({
        userId: data.userId ? new Types.ObjectId(data.userId) : undefined,
        sessionId: data.sessionId,
        eventType: data.eventType,
        toolId: data.toolId ? new Types.ObjectId(data.toolId) : undefined,
        flowId: data.flowId ? new Types.ObjectId(data.flowId) : undefined,
        source: data.source,
        metadata: data.metadata,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
    });

    return interaction.save();
}

interface InteractionFilters {
    eventType?: string;
    toolId?: string;
    startDate?: Date;
    endDate?: Date;
}

interface PaginationOptions {
    page?: number;
    limit?: number;
}

export async function getUserInteractions(
    userId: string,
    filters: InteractionFilters = {},
    pagination: PaginationOptions = {}
) {
    const { page = 1, limit = 50 } = pagination;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {
        userId: new Types.ObjectId(userId)
    };

    if (filters.eventType) {
        query.eventType = filters.eventType;
    }

    if (filters.toolId) {
        query.toolId = new Types.ObjectId(filters.toolId);
    }

    if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
            (query.createdAt as Record<string, Date>).$gte = filters.startDate;
        }
        if (filters.endDate) {
            (query.createdAt as Record<string, Date>).$lte = filters.endDate;
        }
    }

    const [interactions, total] = await Promise.all([
        Interaction.find(query)
            .populate("toolId", "name slug logo_url")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        Interaction.countDocuments(query)
    ]);

    return {
        interactions,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

// Analytics helper functions
export async function getToolInteractionStats(toolId: string) {
    const stats = await Interaction.aggregate([
        { $match: { toolId: new Types.ObjectId(toolId) } },
        {
            $group: {
                _id: "$eventType",
                count: { $sum: 1 }
            }
        }
    ]);

    return stats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
    }, {} as Record<string, number>);
}

export async function getRecentInteractions(limit: number = 100) {
    return Interaction.find()
        .populate("userId", "name email")
        .populate("toolId", "name slug")
        .sort({ createdAt: -1 })
        .limit(limit);
}
