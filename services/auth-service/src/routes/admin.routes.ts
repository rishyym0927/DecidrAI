// services/auth-service/src/routes/admin.routes.ts
import express from "express";
import { requireAuth } from "@clerk/express";
import {
    getAllUsersHandler,
    getUserByIdHandler,
    updateUserRoleHandler,
    getUserAnalyticsHandler
} from "../controllers/admin.controller";
import { getUserByClerkId } from "../services/user.service";

const router = express.Router();

// Middleware to require admin role
async function requireAdmin(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    try {
        const { userId } = (req as any).auth;
        const user = await getUserByClerkId(userId);

        if (!user || user.role !== "admin") {
            return res.status(403).json({
                success: false,
                error: "Admin access required"
            });
        }

        next();
    } catch (error) {
        console.error("[Admin Middleware] Error:", error);
        return res.status(500).json({
            success: false,
            error: "Authorization failed"
        });
    }
}

// ==================== ADMIN USER MANAGEMENT ====================

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (paginated)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 */
router.get("/users", requireAuth(), requireAdmin, getAllUsersHandler);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get("/users/:id", requireAuth(), requireAdmin, getUserByIdHandler);

/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     summary: Update user role
 *     tags: [Admin]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 */
router.patch("/users/:id/role", requireAuth(), requireAdmin, updateUserRoleHandler);

// ==================== ADMIN ANALYTICS ====================

/**
 * @swagger
 * /admin/analytics/users:
 *   get:
 *     summary: Get user analytics
 *     tags: [Admin]
 */
router.get("/analytics/users", requireAuth(), requireAdmin, getUserAnalyticsHandler);

export default router;
