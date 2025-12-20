// services/auth-service/src/controllers/admin.controller.ts
import { Request, Response } from "express";
import {
    getAllUsers,
    getUserById,
    upgradeUserRole,
    UserRole
} from "../services/user.service";
import { getRecentInteractions } from "../services/interaction.service";
import { User } from "../models/User";

/**
 * GET /admin/users - Get all users (paginated)
 */
export async function getAllUsersHandler(req: Request, res: Response) {
    try {
        const { role, search, page, limit } = req.query;

        const result = await getAllUsers(
            {
                role: role as UserRole,
                search: search as string
            },
            {
                page: page ? parseInt(page as string) : 1,
                limit: limit ? parseInt(limit as string) : 20
            }
        );

        return res.json({
            success: true,
            data: result.users,
            pagination: result.pagination
        });
    } catch (error) {
        console.error("[Admin Controller] Error fetching users:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch users"
        });
    }
}

/**
 * GET /admin/users/:id - Get user by ID
 */
export async function getUserByIdHandler(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const user = await getUserById(id);

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
        console.error("[Admin Controller] Error fetching user:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch user"
        });
    }
}

/**
 * PATCH /admin/users/:id/role - Update user role
 */
export async function updateUserRoleHandler(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !["user", "admin"].includes(role)) {
            return res.status(400).json({
                success: false,
                error: "role must be 'user' or 'admin'"
            });
        }

        // Get user by MongoDB ID first
        const existingUser = await getUserById(id);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        const user = await upgradeUserRole(existingUser.clerkUserId, role as UserRole);

        return res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("[Admin Controller] Error updating user role:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to update user role"
        });
    }
}

/**
 * GET /admin/analytics/users - Get user analytics
 */
export async function getUserAnalyticsHandler(req: Request, res: Response) {
    try {
        // Get basic user stats
        const [totalUsers, adminCount, recentInteractions] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "admin" }),
            getRecentInteractions(10)
        ]);

        // Get users by experience level
        const experienceLevelStats = await User.aggregate([
            { $match: { "profile.experienceLevel": { $exists: true } } },
            {
                $group: {
                    _id: "$profile.experienceLevel",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get recent signups (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentSignups = await User.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        return res.json({
            success: true,
            data: {
                totalUsers,
                adminCount,
                recentSignups,
                experienceLevelStats,
                recentInteractions: recentInteractions.map(i => ({
                    id: i._id,
                    eventType: i.eventType,
                    createdAt: i.createdAt
                }))
            }
        });
    } catch (error) {
        console.error("[Admin Controller] Error fetching analytics:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch analytics"
        });
    }
}
