import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;

export async function connectMongo(
  uri: string,
  dbName: string
): Promise<Db> {
  if (!client) {
    const newClient = new MongoClient(uri);
    await newClient.connect();
    console.log("✅ MongoDB connected");
    client = newClient;
  }

  return client.db(dbName);
}
