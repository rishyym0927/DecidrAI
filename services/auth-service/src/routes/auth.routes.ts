import express from "express";
import { requireAuth } from "@clerk/express";
import {
    getMe,
    updateMe,
    getSavedToolsHandler,
    saveToolHandler,
    unsaveToolHandler,
    getAiStackHandler,
    addToAiStackHandler,
    removeFromAiStackHandler,
    deleteMe
} from "../controllers/user.controller";
import {
    trackInteractionHandler,
    getUserInteractionsHandler
} from "../controllers/interaction.controller";

const router = express.Router();

// ==================== HEALTH CHECK ====================

/**
 * @swagger
 * /auth/health:
 *   get:
 *     summary: Health check for auth service
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "auth-service" });
});

// ==================== PROFILE ENDPOINTS ====================

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       404:
 *         description: User not found
 */
router.get("/me", requireAuth(), getMe);

/**
 * @swagger
 * /auth/me:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               experienceLevel:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *               preferences:
 *                 type: object
 *     responses:
 *       200:
 *         description: Updated user profile
 */
router.patch("/me", requireAuth(), updateMe);

/**
 * @swagger
 * /auth/me:
 *   delete:
 *     summary: Delete current user account
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/me", requireAuth(), deleteMe);

// ==================== SAVED TOOLS ENDPOINTS ====================

/**
 * @swagger
 * /auth/me/saved-tools:
 *   get:
 *     summary: Get user's saved tools
 *     tags: [Saved Tools]
 *     security:
 *       - bearerAuth: []
 */
router.get("/me/saved-tools", requireAuth(), getSavedToolsHandler);

/**
 * @swagger
 * /auth/me/saved-tools/{toolId}:
 *   post:
 *     summary: Save a tool
 *     tags: [Saved Tools]
 *     parameters:
 *       - in: path
 *         name: toolId
 *         required: true
 *         schema:
 *           type: string
 */
router.post("/me/saved-tools/:toolId", requireAuth(), saveToolHandler);

/**
 * @swagger
 * /auth/me/saved-tools/{toolId}:
 *   delete:
 *     summary: Unsave a tool
 *     tags: [Saved Tools]
 */
router.delete("/me/saved-tools/:toolId", requireAuth(), unsaveToolHandler);

// ==================== AI STACK ENDPOINTS ====================

/**
 * @swagger
 * /auth/me/ai-stack:
 *   get:
 *     summary: Get user's AI stack
 *     tags: [AI Stack]
 */
router.get("/me/ai-stack", requireAuth(), getAiStackHandler);

/**
 * @swagger
 * /auth/me/ai-stack:
 *   post:
 *     summary: Add tool to AI stack
 *     tags: [AI Stack]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toolId
 *               - category
 *             properties:
 *               toolId:
 *                 type: string
 *               category:
 *                 type: string
 *               notes:
 *                 type: string
 */
router.post("/me/ai-stack", requireAuth(), addToAiStackHandler);

/**
 * @swagger
 * /auth/me/ai-stack/{toolId}:
 *   delete:
 *     summary: Remove tool from AI stack
 *     tags: [AI Stack]
 */
router.delete("/me/ai-stack/:toolId", requireAuth(), removeFromAiStackHandler);

// ==================== INTERACTION ENDPOINTS ====================

/**
 * @swagger
 * /auth/interactions:
 *   post:
 *     summary: Track a user interaction
 *     tags: [Interactions]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - eventType
 *             properties:
 *               sessionId:
 *                 type: string
 *               eventType:
 *                 type: string
 *                 enum: [view, click, save, compare, flow_start, flow_complete]
 *               toolId:
 *                 type: string
 *               flowId:
 *                 type: string
 *               source:
 *                 type: string
 *               metadata:
 *                 type: object
 */
router.post("/interactions", requireAuth(), trackInteractionHandler);

/**
 * @swagger
 * /auth/interactions:
 *   get:
 *     summary: Get user's interactions
 *     tags: [Interactions]
 *     parameters:
 *       - in: query
 *         name: eventType
 *         schema:
 *           type: string
 *       - in: query
 *         name: toolId
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
router.get("/interactions", requireAuth(), getUserInteractionsHandler);

export default router;

