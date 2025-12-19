import Redis from "ioredis";

/**
 * We create ONE Redis client.
 * Services reuse it.
 * Simple, predictable, production-safe.
 */

let redis: Redis | null = null;

export function getRedisClient() {
  if (!redis) {
    if (!process.env.REDIS_URL) {
      throw new Error("Redis env variable REDIS_URL missing");
    }

    const options: any = {};
    if (process.env.REDIS_TOKEN) {
      options.password = process.env.REDIS_TOKEN;
    }

    console.log(`[Redis] Connecting to ${process.env.REDIS_URL?.replace(/:[^:@]*@/, ':****@')}`);
    redis = new Redis(process.env.REDIS_URL, options);
    redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }

  return redis;
}
