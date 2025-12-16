import express, { Request, Response } from "express";
import { requireAuth } from "@clerk/express";
import { getUserByClerkId } from "../services/user.service";

const router = express.Router();


router.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
});


router.get(
    "/me",
    requireAuth(),
    async (req: Request, res: Response) => {
        try {
            const { userId } = (req as any).auth;
            const user = await getUserByClerkId(userId);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.json(user);
        } catch (error) {
            console.error("Error fetching user:", error);
            return res.status(500).json({ error: "Failed to fetch user" });
        }
    }
);

export default router;
