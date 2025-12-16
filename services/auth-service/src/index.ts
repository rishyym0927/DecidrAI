import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db";

import clerkWebhook from "./routes/clerkWebhook";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/webhooks", clerkWebhook);
app.use("/auth", authRoutes);


if (!process.env.CLERK_WEBHOOK_SECRET) {
  throw new Error("Missing CLERK_WEBHOOK_SECRET");
}

app.get("/health", async (_, res) => {
  try {
    await connectDB();
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error" });
  }
});

app.listen(process.env.PORT, async () => {
  try {
    await connectDB();
    console.log(`🚀 Auth service on ${process.env.PORT}`);
  } catch (err) {
    console.error("Failed to connect to DB on startup:", err);
  }
});
