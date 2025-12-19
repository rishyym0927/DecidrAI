"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CACHE_TTL = exports.CacheService = void 0;
const redis_1 = require("../../../../packages/db/src/redis");
/**
 * Cache Service
 * Wrapper around Redis client for caching operations
 */
class CacheService {
    /**
     * Get value from cache
     */
    static async get(key) {
        try {
            const redis = (0, redis_1.getRedisClient)();
            const data = await redis.get(key);
            if (!data)
                return null;
            return JSON.parse(data);
        }
        catch (error) {
            console.error('[CacheService] Get error:', error);
            return null;
        }
    }
    /**
     * Set value in cache with TTL (in seconds)
     */
    static async set(key, value, ttl) {
        try {
            const redis = (0, redis_1.getRedisClient)();
            const data = JSON.stringify(value);
            await redis.setex(key, ttl, data);
            return true;
        }
        catch (error) {
            console.error('[CacheService] Set error:', error);
            return false;
        }
    }
    /**
     * Delete key from cache
     */
    static async del(key) {
        try {
            const redis = (0, redis_1.getRedisClient)();
            await redis.del(key);
            return true;
        }
        catch (error) {
            console.error('[CacheService] Delete error:', error);
            return false;
        }
    }
    /**
     * Delete multiple keys by pattern
     */
    static async delPattern(pattern) {
        try {
            const redis = (0, redis_1.getRedisClient)();
            const keys = await redis.keys(pattern);
            if (keys.length > 0) {
                await redis.del(...keys);
            }
            return true;
        }
        catch (error) {
            console.error('[CacheService] Delete pattern error:', error);
            return false;
        }
    }
    /**
     * Generate cache key for tools list
     */
    static getToolsListKey(filters) {
        const filterStr = JSON.stringify(filters);
        return `tools:list:${Buffer.from(filterStr).toString('base64')}`;
    }
    /**
     * Generate cache key for search
     */
    static getSearchKey(query) {
        return `tools:search:${query.toLowerCase()}`;
    }
    /**
     * Generate cache key for tool detail
     */
    static getToolKey(slug) {
        return `tool:${slug}`;
    }
    /**
     * Generate cache key for related tools
     */
    static getRelatedKey(slug) {
        return `tools:related:${slug}`;
    }
}
exports.CacheService = CacheService;
// Cache TTL constants (in seconds)
exports.CACHE_TTL = {
    TOOL_DETAIL: 15 * 60, // 15 minutes
    TOOLS_LIST: 60 * 60, // 1 hour
    SEARCH: 30 * 60, // 30 minutes
    RELATED: 2 * 60 * 60, // 2 hours
};
