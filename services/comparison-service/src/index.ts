import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { connectMongo } from 'db';
import { getRedisClient } from 'db';
import comparisonRoutes from './routes/comparison.routes';
import { createRequestLogger } from 'logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(helmet());
app.use(cors());
app.use(createRequestLogger('comparison-service'));
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
            service: 'comparison-service',
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

// Comparison routes
app.use('/', comparisonRoutes);

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
            process.env.MONGODB_DB_NAME || 'decidrai_comparisons'
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
            console.log('⚠️ Gemini AI not configured (using template comparisons)');
        }

        // Start Express server
        app.listen(PORT, () => {
            console.log(`\n🚀 Comparison Service running on port ${PORT}`);
            console.log(`📍 Health check: http://localhost:${PORT}/health`);
            console.log(`📍 Compare: GET http://localhost:${PORT}/compare?tools=slug1,slug2`);
            console.log(`📍 Popular: GET http://localhost:${PORT}/compare/popular\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
