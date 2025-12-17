import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";

import { createRequestLogger } from "logger";
import { GATEWAY_CONFIG } from "./config/services.config";
import { authMiddleware } from "./middleware/auth.middleware";
import { defaultRateLimiter } from "./middleware/rateLimiter.middleware";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.middleware";

import proxyRoutes from "./routes/proxy.routes";
import testRoutes from "./routes/test.routes";

const app = express();

// ================================
// SECURITY & PARSING MIDDLEWARE
// ================================

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS
app.use(cors({
  origin: GATEWAY_CONFIG.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging (using shared logger package)
app.use(createRequestLogger('api-gateway'));

// Trust proxy (for rate limiting behind reverse proxy)
if (GATEWAY_CONFIG.trustProxy) {
  app.set('trust proxy', 1);
}

// ================================
// PUBLIC ROUTES (No Auth Required)
// ================================

// Health check
app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    service: "api-gateway",
    port: GATEWAY_CONFIG.port,
    timestamp: new Date().toISOString()
  });
});

// Test routes (for debugging)
app.use("/test", testRoutes);

// ================================
// RATE LIMITED API ROUTES
// ================================

// Apply default rate limiting to all /api routes
app.use("/api", defaultRateLimiter);

// Proxy routes to microservices
app.use("/api", proxyRoutes);

// ================================
// PROTECTED ROUTES (Legacy)
// ================================

app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user
  });
});

// ================================
// ERROR HANDLING
// ================================

app.use(notFoundHandler);
app.use(errorHandler);

// ================================
// START SERVER
// ================================

const PORT = GATEWAY_CONFIG.port;

app.listen(PORT, () => {
  console.log(`\n🚀 API Gateway running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`📍 Services: http://localhost:${PORT}/test/services`);
  console.log(`📍 API: http://localhost:${PORT}/api/*\n`);
});

export default app;
