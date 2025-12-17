/**
 * Base application error
 */
export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}

/**
 * 400 Bad Request
 */
export class BadRequestError extends AppError {
    constructor(message: string = 'Bad request') {
        super(message, 400);
    }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
    }
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
    }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends AppError {
    constructor(message: string = 'Not found') {
        super(message, 404);
    }
}

/**
 * 409 Conflict
 */
export class ConflictError extends AppError {
    constructor(message: string = 'Conflict') {
        super(message, 409);
    }
}

/**
 * 422 Validation Error
 */
export class ValidationError extends AppError {
    public errors: Record<string, string[]>;

    constructor(message: string = 'Validation failed', errors: Record<string, string[]> = {}) {
        super(message, 422);
        this.errors = errors;
    }
}

/**
 * 429 Rate Limit Error
 */
export class RateLimitError extends AppError {
    public retryAfter: number;

    constructor(message: string = 'Too many requests', retryAfter: number = 60) {
        super(message, 429);
        this.retryAfter = retryAfter;
    }
}

/**
 * 500 Internal Server Error
 */
export class InternalError extends AppError {
    constructor(message: string = 'Internal server error') {
        super(message, 500);
    }
}

/**
 * 503 Service Unavailable
 */
export class ServiceUnavailableError extends AppError {
    constructor(message: string = 'Service unavailable') {
        super(message, 503);
    }
}

/**
 * 504 Gateway Timeout
 */
export class GatewayTimeoutError extends AppError {
    constructor(message: string = 'Gateway timeout') {
        super(message, 504);
    }
}
