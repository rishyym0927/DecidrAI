import { Db } from "mongodb";
import { connectMongo } from "../../../packages/db/src/mongo";

let db: Db | null = null;


export async function getDB(): Promise<Db> {
  if (!db) {
    db = await connectMongo(
      process.env.MONGODB_URI!,
      process.env.MONGODB_DB_NAME!
    );
  }
  return db;
}
