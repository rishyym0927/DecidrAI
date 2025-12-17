import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { connectMongo } from 'db';
import { getRedisClient } from 'db';
import recommendationRoutes from './routes/recommendation.routes';
import { createRequestLogger } from 'logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(createRequestLogger('recommendation-service'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', async (_, res) => {
  try {
    const mongoStatus = mongoose.connection.readyState;

    let redisStatus = 'disconnected';
    try {
      const redis = getRedisClient();
      await redis.ping();
      redisStatus = 'connected';
    } catch (error) {
      redisStatus = 'error';
    }

    res.json({
      status: 'ok',
      service: 'recommendation-service',
      port: PORT,
      mongodb: mongoStatus === 1 ? 'connected' : 'disconnected',
      redis: redisStatus,
      gemini: process.env.GEMINI_API_KEY ? 'configured' : 'not configured',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Redis test route (keep for compatibility)
app.get('/redis-test', async (_, res) => {
  try {
    const redis = getRedisClient();
    await redis.set('rec-test', 'hello');
    const value = await redis.get('rec-test');
    res.json({ redisWorking: value === 'hello' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Redis operation failed' });
  }
});

// Recommendation routes
app.use('/', recommendationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Server Error]:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

async function startServer() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await connectMongo(
      process.env.MONGODB_URI!,
      process.env.MONGODB_DB_NAME || 'decidrai_recommendations'
    );
    console.log('✅ MongoDB connected');

    // Initialize Redis client
    console.log('🔌 Connecting to Redis...');
    const redis = getRedisClient();
    await redis.ping();
    console.log('✅ Redis connected');

    // Check Gemini configuration
    if (process.env.GEMINI_API_KEY) {
      console.log('✅ Gemini AI configured');
    } else {
      console.log('⚠️ Gemini AI not configured (using template explanations)');
    }

    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n🚀 Recommendation Service running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 Recommend: POST http://localhost:${PORT}/recommend`);
      console.log(`📍 Session: GET http://localhost:${PORT}/recommend/session/:id\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
