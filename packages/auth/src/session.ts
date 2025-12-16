import { verifyToken } from "@clerk/backend";
import dotenv from "dotenv";

dotenv.config();

export const validateClerkSession = async (token: string) => {
    try {
        const result = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });

        if (result.errors) {
            console.error("Clerk validation error:", result.errors);
            return null;
        }

        return result.data;
    } catch (error) {
        console.error("Clerk validation error:", error);
        return null; // Return null if verification fails
    }
};
