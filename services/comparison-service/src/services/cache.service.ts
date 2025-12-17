import { getRedisClient } from 'db';
import { Redis } from 'ioredis';

// Lazy Redis client getter
let redis: Redis | null = null;
function getRedis(): Redis {
    if (!redis) {
        redis = getRedisClient();
    }
    return redis;
}

export const CACHE_TTL = {
    COMPARISON: 86400 * 7,  // 7 days
    TOOLS_DATA: 300         // 5 minutes
};

/**
 * Generate cache key for comparison
 */
export function getComparisonCacheKey(slugs: string[]): string {
    const sortedSlugs = [...slugs].sort();
    return `comparison:${sortedSlugs.join(':')}`;
}

/**
 * Get cached data
 */
export async function getCache<T>(key: string): Promise<T | null> {
    try {
        const data = await getRedis().get(key);
        if (!data) return null;
        return JSON.parse(data) as T;
    } catch (error) {
        console.error('[Cache] Get error:', error);
        return null;
    }
}

/**
 * Set cached data with TTL
 */
export async function setCache<T>(key: string, value: T, ttlSeconds: number = CACHE_TTL.COMPARISON): Promise<void> {
    try {
        await getRedis().set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (error) {
        console.error('[Cache] Set error:', error);
    }
}

/**
 * Delete cached data
 */
export async function delCache(key: string): Promise<void> {
    try {
        await getRedis().del(key);
    } catch (error) {
        console.error('[Cache] Delete error:', error);
    }
}

/**
 * Delete cache by pattern
 */
export async function delCachePattern(pattern: string): Promise<void> {
    try {
        const keys = await getRedis().keys(pattern);
        if (keys.length > 0) {
            await getRedis().del(...keys);
        }
    } catch (error) {
        console.error('[Cache] Pattern delete error:', error);
    }
}
