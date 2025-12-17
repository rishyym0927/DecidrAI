/**
 * Microservices configuration
 */
export const SERVICES = {
    auth: {
        name: 'auth-service',
        url: process.env.AUTH_SERVICE_URL || 'http://localhost:5002',
        healthPath: '/health'
    },
    tool: {
        name: 'tool-service',
        url: process.env.TOOL_SERVICE_URL || 'http://localhost:5003',
        healthPath: '/health'
    },
    flow: {
        name: 'flow-service',
        url: process.env.FLOW_SERVICE_URL || 'http://localhost:5004',
        healthPath: '/health'
    },
    comparison: {
        name: 'comparison-service',
        url: process.env.COMPARISON_SERVICE_URL || 'http://localhost:5005',
        healthPath: '/health'
    },
    recommendation: {
        name: 'recommendation-service',
        url: process.env.RECOMMENDATION_SERVICE_URL || 'http://localhost:5001',
        healthPath: '/health'
    }
} as const;

export type ServiceName = keyof typeof SERVICES;

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
    default: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // 100 requests per window
    },
    ai: {
        windowMs: 60 * 1000, // 1 minute
        max: 20 // 20 requests per minute for AI endpoints
    },
    auth: {
        windowMs: 15 * 60 * 1000,
        max: 50 // 50 auth requests per 15 minutes
    }
};

/**
 * Gateway configuration
 */
export const GATEWAY_CONFIG = {
    port: process.env.PORT || 4000,
    // Allow all origins in development for API playground testing
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || '*',
    trustProxy: process.env.TRUST_PROXY === 'true'
};
