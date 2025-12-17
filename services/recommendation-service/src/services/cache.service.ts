import { getRedisClient } from 'db';
import { Redis } from 'ioredis';

// Lazy Redis client getter to avoid initialization before dotenv.config()
let redis: Redis | null = null;
function getRedis(): Redis {
    if (!redis) {
        redis = getRedisClient();
    }
    return redis;
}

export const CACHE_TTL = {
    RECOMMENDATIONS: 3600,     // 1 hour
    TOOLS_LIST: 300,           // 5 minutes (tools don't change often)
    SESSION_DATA: 1800         // 30 minutes
};

/**
 * Generate cache key for recommendations
 */
export function getRecommendationCacheKey(tagsHash: string): string {
    return `recs:${tagsHash}`;
}

/**
 * Generate cache key for session recommendations
 */
export function getSessionRecCacheKey(sessionId: string): string {
    return `recs:session:${sessionId}`;
}

/**
 * Create a hash from tags array for caching
 */
export function createTagsHash(tags: string[]): string {
    const sortedTags = [...tags].sort();
    return sortedTags.join(':').toLowerCase().replace(/\s+/g, '-');
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
export async function setCache<T>(key: string, value: T, ttlSeconds: number = CACHE_TTL.RECOMMENDATIONS): Promise<void> {
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
