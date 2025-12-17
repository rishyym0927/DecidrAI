import { Request, Response, NextFunction } from 'express';
import { AppError } from 'errors';

/**
 * Global error handler middleware
 */
export const errorHandler = (
    err: AppError | Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode = 'statusCode' in err ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';

    // Log the error
    console.error(`[API Gateway Error] ${req.method} ${req.path}:`, {
        statusCode,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.path,
        method: req.method
    });
};
