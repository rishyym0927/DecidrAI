import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.MONGODB_DB_NAME,
    });
    console.log("Mongoose connected");
  } catch (err) {
    console.error("Mongoose connection failed:", err);
    throw err;
  }
}

