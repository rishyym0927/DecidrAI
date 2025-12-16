import { User } from "../models/User";

// Define a union type for user roles
export type UserRole = "admin" | "moderator" | "user";

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
