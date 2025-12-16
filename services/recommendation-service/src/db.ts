import { connectMongo } from "../../../packages/db/src/mongo";

export async function initDB(): Promise<void> {
  await connectMongo(
    process.env.MONGODB_URI!,
    process.env.MONGODB_DB_NAME || "decidrai_recommendations"
  );
}
