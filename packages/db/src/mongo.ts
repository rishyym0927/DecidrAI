import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;

export async function connectMongo(
  uri: string,
  dbName: string
): Promise<Db> {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("✅ MongoDB connected");
  }

  return client.db(dbName);
}
