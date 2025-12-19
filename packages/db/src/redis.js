"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = getRedisClient;
const ioredis_1 = __importDefault(require("ioredis"));
/**
 * We create ONE Redis client.
 * Services reuse it.
 * Simple, predictable, production-safe.
 */
let redis = null;
function getRedisClient() {
    if (!redis) {
        if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
            throw new Error("Redis env variables missing");
        }
        redis = new ioredis_1.default(process.env.REDIS_URL, {
            password: process.env.REDIS_TOKEN,
        });
        redis.on('error', (err) => {
            console.error('Redis connection error:', err);
        });
    }
    return redis;
}
