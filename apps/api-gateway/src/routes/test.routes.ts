import { Router, Request, Response } from 'express';
import axios from 'axios';
import { SERVICES, ServiceName } from '../config/services.config';

const router = Router();

/**
 * GET /test/services
 * Check health of all services
 */
router.get('/services', async (req: Request, res: Response) => {
    const results: Record<string, { status: string; latency?: number; error?: string }> = {};

    await Promise.all(
        Object.entries(SERVICES).map(async ([name, config]) => {
            const startTime = Date.now();
            try {
                const response = await axios.get(`${config.url}${config.healthPath}`, {
                    timeout: 5000
                });
                results[name] = {
                    status: response.data.status || 'ok',
                    latency: Date.now() - startTime
                };
            } catch (error) {
                results[name] = {
                    status: 'error',
                    latency: Date.now() - startTime,
                    error: axios.isAxiosError(error)
                        ? error.code || error.message
                        : 'Unknown error'
                };
            }
        })
    );

    const allHealthy = Object.values(results).every(r => r.status !== 'error');

    res.status(allHealthy ? 200 : 503).json({
        success: allHealthy,
        gateway: 'healthy',
        services: results,
        timestamp: new Date().toISOString()
    });
});

/**
 * GET /test/service/:name
 * Check health of a specific service
 */
router.get('/service/:name', async (req: Request, res: Response) => {
    const { name } = req.params;

    if (!SERVICES[name as ServiceName]) {
        res.status(404).json({
            success: false,
            error: `Unknown service: ${name}`,
            availableServices: Object.keys(SERVICES)
        });
        return;
    }

    const config = SERVICES[name as ServiceName];
    const startTime = Date.now();

    try {
        const response = await axios.get(`${config.url}${config.healthPath}`, {
            timeout: 5000
        });

        res.json({
            success: true,
            service: name,
            status: response.data.status || 'ok',
            data: response.data,
            latency: Date.now() - startTime
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            service: name,
            status: 'error',
            error: axios.isAxiosError(error) ? error.code || error.message : 'Unknown error',
            latency: Date.now() - startTime
        });
    }
});

/**
 * GET /test/echo
 * Echo back request details (for debugging)
 */
router.all('/echo', (req: Request, res: Response) => {
    res.json({
        success: true,
        request: {
            method: req.method,
            path: req.path,
            query: req.query,
            body: req.body,
            headers: {
                'content-type': req.headers['content-type'],
                'authorization': req.headers.authorization ? '[PRESENT]' : '[MISSING]',
                'user-agent': req.headers['user-agent'],
                'x-forwarded-for': req.headers['x-forwarded-for']
            },
            user: req.user || null,
            ip: req.ip
        },
        timestamp: new Date().toISOString()
    });
});

/**
 * GET /test/protected
 * Test protected route (requires auth)
 */
router.get('/protected', (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            error: 'Not authenticated',
            message: 'This endpoint requires authentication'
        });
        return;
    }

    res.json({
        success: true,
        message: 'You are authenticated!',
        user: req.user
    });
});

export default router;
