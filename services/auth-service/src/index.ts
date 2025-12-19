import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { connectMongo } from "db";
import { createRequestLogger } from "logger";
// import { errorHandler, notFoundHandler } from "../../../apps/api-gateway/src/middleware/errorHandler.middleware"; // REMOVED: Circular dependency

import clerkWebhook from "./routes/clerkWebhook";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();

// Security & Standard Middleware
app.use(helmet());
app.use(cors());
app.use(createRequestLogger('auth-service'));

// Webhooks (before body parsing)
app.use("/webhooks", clerkWebhook);

// Body Parsing
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

// Health Check
app.get("/health", async (_, res) => {
  try {
    const dbState = await connectMongo(
      process.env.MONGODB_URI!,
      process.env.MONGODB_DB_NAME || "decidrai"
    );
    // connectMongo returns void, but we can assume connected if no error
    res.json({ status: "ok", service: "auth-service", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", message: "DB connection failed" });
  }
});

// Error Handling
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Auth Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

if (!process.env.CLERK_WEBHOOK_SECRET) {
  throw new Error("Missing CLERK_WEBHOOK_SECRET");
}

app.listen(process.env.PORT, async () => {
  try {
    await connectMongo(
      process.env.MONGODB_URI!,
      process.env.MONGODB_DB_NAME || "decidrai"
    );
    console.log(`🚀 Auth service running on port ${process.env.PORT}`);
  } catch (err) {
    console.error("Failed to connect to DB on startup:", err);
    process.exit(1);
  }
});
