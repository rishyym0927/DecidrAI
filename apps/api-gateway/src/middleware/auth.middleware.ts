import { Request, Response, NextFunction } from 'express';
import { validateClerkSession, ClerkAuthSession } from '@decidrai/auth';


declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: string;
            };
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({ error: "Unauthorized - Missing or Invalid Token" });
            return;
        }

        const token = authHeader.split(" ")[1];
        const sessionData = await validateClerkSession(token);

        if (!sessionData) {
            res.status(401).json({ error: "Unauthorized - Invalid Token" });
            return;
        }

        // Extract userId (sub) using safe optional chaining just in case
        const userId = sessionData.sub;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized - Invalid Token Payload" });
            return;
        }

        // Extract role with fallback
        const metadata = sessionData.public_metadata || {};
        const role = (metadata.role as string) || sessionData.role || 'user';

        req.user = { userId, role };
        next();
    } catch (error) {
        console.error("[AuthMiddleware] Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
