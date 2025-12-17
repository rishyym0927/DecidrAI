import { Request, Response, NextFunction } from 'express';
import { createLogger } from './logger';

/**
 * Create Express request logger middleware
 */
export function createRequestLogger(serviceName: string) {
    const logger = createLogger(serviceName);

    return (req: Request, res: Response, next: NextFunction): void => {
        const startTime = Date.now();

        res.on('finish', () => {
            const duration = Date.now() - startTime;
            logger.request(req.method, req.originalUrl, res.statusCode, duration);
        });

        next();
    };
}
