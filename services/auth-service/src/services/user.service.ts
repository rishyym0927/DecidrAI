import { User } from "../models/User";
export async function upgradeUserRole(
    clerkUserId: string,
    role: "admin"
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
            email: data.email_addresses[0]?.email_address,
            name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
            image: data.image_url,
        },
        { upsert: true, new: true }
    );
}

export async function deleteUser(clerkUserId: string) {
    return User.findOneAndDelete({ clerkUserId });
}
