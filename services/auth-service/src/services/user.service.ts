import { User, IUser } from "../models/User";
import { Types } from "mongoose";

// Define a union type for user roles
export type UserRole = "admin" | "user";

// ==================== ROLE MANAGEMENT ====================

export async function upgradeUserRole(
    clerkUserId: string,
    role: UserRole
) {
    return User.findOneAndUpdate(
        { clerkUserId },
        { role },
        { new: true }
    );
}

// ==================== USER CRUD ====================

export async function upsertUser(data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string;
}) {
    return User.findOneAndUpdate(
        { clerkUserId: data.id },
        {
            clerkUserId: data.id,
            email: (Array.isArray(data.email_addresses) && data.email_addresses.length > 0)
                ? data.email_addresses[0].email_address
                : null,
            name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
            image: data.image_url,
        },
        { upsert: true, new: true }
    );
}

export async function deleteUser(clerkUserId: string) {
    return User.findOneAndDelete({ clerkUserId });
}

export async function getUserByClerkId(clerkUserId: string) {
    return User.findOne({ clerkUserId });
}

export async function getUserById(userId: string) {
    return User.findById(userId);
}

// ==================== PROFILE MANAGEMENT ====================

interface ProfileUpdate {
    name?: string;
    bio?: string;
    experienceLevel?: "beginner" | "intermediate" | "advanced";
    interests?: string[];
    preferences?: {
        emailNotifications?: boolean;
        theme?: "light" | "dark" | "system";
    };
}

export async function updateUserProfile(
    clerkUserId: string,
    updates: ProfileUpdate
) {
    const updateData: Record<string, unknown> = {};

    if (updates.name !== undefined) {
        updateData.name = updates.name;
    }

    if (updates.bio !== undefined) {
        updateData["profile.bio"] = updates.bio;
    }

    if (updates.experienceLevel !== undefined) {
        updateData["profile.experienceLevel"] = updates.experienceLevel;
    }

    if (updates.interests !== undefined) {
        updateData["profile.interests"] = updates.interests;
    }

    if (updates.preferences) {
        if (updates.preferences.emailNotifications !== undefined) {
            updateData["preferences.emailNotifications"] = updates.preferences.emailNotifications;
        }
        if (updates.preferences.theme !== undefined) {
            updateData["preferences.theme"] = updates.preferences.theme;
        }
    }

    return User.findOneAndUpdate(
        { clerkUserId },
        { $set: updateData },
        { new: true }
    );
}

// ==================== SAVED TOOLS MANAGEMENT ====================

export async function getSavedTools(clerkUserId: string) {
    const user = await User.findOne({ clerkUserId })
        .select("savedTools")
        .populate("savedTools.toolId");

    return user?.savedTools || [];
}

export async function saveTool(
    clerkUserId: string,
    toolId: string,
    notes?: string
) {
    // Check if tool is already saved
    const user = await User.findOne({
        clerkUserId,
        "savedTools.toolId": new Types.ObjectId(toolId)
    });

    if (user) {
        // Update notes if tool already saved
        return User.findOneAndUpdate(
            { clerkUserId, "savedTools.toolId": new Types.ObjectId(toolId) },
            { $set: { "savedTools.$.notes": notes } },
            { new: true }
        );
    }

    // Add new saved tool
    return User.findOneAndUpdate(
        { clerkUserId },
        {
            $push: {
                savedTools: {
                    toolId: new Types.ObjectId(toolId),
                    savedAt: new Date(),
                    notes
                }
            }
        },
        { new: true }
    );
}

export async function unsaveTool(clerkUserId: string, toolId: string) {
    return User.findOneAndUpdate(
        { clerkUserId },
        {
            $pull: {
                savedTools: { toolId: new Types.ObjectId(toolId) }
            }
        },
        { new: true }
    );
}

// ==================== AI STACK MANAGEMENT ====================

export async function getAiStack(clerkUserId: string) {
    const user = await User.findOne({ clerkUserId })
        .select("aiStack")
        .populate("aiStack.toolId");

    return user?.aiStack || [];
}

export async function addToAiStack(
    clerkUserId: string,
    toolId: string,
    category: string,
    notes?: string
) {
    // Check if tool is already in stack
    const user = await User.findOne({
        clerkUserId,
        "aiStack.toolId": new Types.ObjectId(toolId)
    });

    if (user) {
        // Update category/notes if already in stack
        return User.findOneAndUpdate(
            { clerkUserId, "aiStack.toolId": new Types.ObjectId(toolId) },
            {
                $set: {
                    "aiStack.$.category": category,
                    "aiStack.$.notes": notes
                }
            },
            { new: true }
        );
    }

    // Add new stack item
    return User.findOneAndUpdate(
        { clerkUserId },
        {
            $push: {
                aiStack: {
                    toolId: new Types.ObjectId(toolId),
                    category,
                    notes,
                    addedAt: new Date()
                }
            }
        },
        { new: true }
    );
}

export async function removeFromAiStack(clerkUserId: string, toolId: string) {
    return User.findOneAndUpdate(
        { clerkUserId },
        {
            $pull: {
                aiStack: { toolId: new Types.ObjectId(toolId) }
            }
        },
        { new: true }
    );
}

// ==================== ADMIN FUNCTIONS ====================

interface UserFilters {
    role?: UserRole;
    search?: string;
}

interface PaginationOptions {
    page?: number;
    limit?: number;
}

export async function getAllUsers(
    filters: UserFilters = {},
    pagination: PaginationOptions = {}
) {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (filters.role) {
        query.role = filters.role;
    }

    if (filters.search) {
        query.$or = [
            { name: { $regex: filters.search, $options: "i" } },
            { email: { $regex: filters.search, $options: "i" } }
        ];
    }

    const [users, total] = await Promise.all([
        User.find(query)
            .select("-savedTools -aiStack")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        User.countDocuments(query)
    ]);

    return {
        users,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}
