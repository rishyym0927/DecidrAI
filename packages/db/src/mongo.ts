import mongoose from "mongoose";

export async function connectMongo(
  uri: string,
  dbName: string
): Promise<void> {
  // Check if already connected
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ MongoDB already connected");
    return;
  }

  try {
    // Append dbName to URI if not already present
    const connectionUri = uri.includes("?")
      ? `${uri}&dbName=${dbName}`
      : `${uri}/${dbName}`;

    await mongoose.connect(connectionUri);
    console.log("✅ MongoDB connected via Mongoose");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    throw err;
  }
}

// Optional: Export disconnect function for graceful shutdown
export async function disconnectMongo(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");
  }
}
