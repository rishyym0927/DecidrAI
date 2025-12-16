import { verifyToken } from "@clerk/backend";

export interface ClerkAuthSession {
    sub: string;
    sid?: string;
    public_metadata?: Record<string, unknown>;
    role?: string; // Sometimes role is top-level depending on claims
    [key: string]: any;
}

export const validateClerkSession = async (token: string): Promise<ClerkAuthSession | null> => {
    if (!process.env.CLERK_SECRET_KEY) {
        console.error("Missing CLERK_SECRET_KEY environment variable");
        return null;
    }

    try {
        const result = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
            clockSkewInMs: 300 * 1000, // Allow 5 minutes skew
        });

        return result as ClerkAuthSession;

    } catch (error) {
        console.error("Clerk validation error:", error);
        return null;
    }
};
