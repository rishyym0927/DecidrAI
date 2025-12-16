import { verifyToken } from "@clerk/backend";

export const validateClerkSession = async (token: string) => {
    if (!process.env.CLERK_SECRET_KEY) {
        console.error("Missing CLERK_SECRET_KEY environment variable");
        return null; // Or throw, but returning null matches the existing error handling signature
    }

    try {
        const result = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });

        if (result && typeof result === "object" && "errors" in result && result.errors) {
            console.error("Clerk validation error:", result.errors);
            return null;
        }

        if (result && typeof result === "object" && "data" in result) {
            return result.data;
        }
        // If result is not as expected, return null
        return null;
    } catch (error) {
        console.error("Clerk validation error:", error);
        return null;
    }
};
