import rateLimit from 'express-rate-limit';
import { RATE_LIMITS } from '../config/services.config';

/**
 * Default rate limiter for general API access
 */
export const defaultRateLimiter = rateLimit({
    windowMs: RATE_LIMITS.default.windowMs,
    max: RATE_LIMITS.default.max,
    message: {
        success: false,
        error: 'Too many requests, please try again later.',
        retryAfter: Math.ceil(RATE_LIMITS.default.windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        // Use X-Forwarded-For if behind proxy, otherwise use IP
        return req.headers['x-forwarded-for']?.toString().split(',')[0] ||
            req.ip ||
            'unknown';
    }
});

/**
 * Stricter rate limiter for AI-powered endpoints
 */
export const aiRateLimiter = rateLimit({
    windowMs: RATE_LIMITS.ai.windowMs,
    max: RATE_LIMITS.ai.max,
    message: {
        success: false,
        error: 'AI rate limit exceeded. Please wait before making more requests.',
        retryAfter: Math.ceil(RATE_LIMITS.ai.windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Rate limiter for auth endpoints
 */
export const authRateLimiter = rateLimit({
    windowMs: RATE_LIMITS.auth.windowMs,
    max: RATE_LIMITS.auth.max,
    message: {
        success: false,
        error: 'Too many authentication attempts.',
        retryAfter: Math.ceil(RATE_LIMITS.auth.windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false
});
