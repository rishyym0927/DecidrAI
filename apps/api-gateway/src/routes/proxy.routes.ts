import { Router, Request, Response } from 'express';
import axios from 'axios';
import { SERVICES } from '../config/services.config';
import { authMiddleware } from '../middleware/auth.middleware';
import { aiRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

/**
 * Helper to proxy requests to a service
 */
async function proxyRequest(
    req: Request,
    res: Response,
    serviceUrl: string,
    path: string
): Promise<void> {
    try {
        const url = `${serviceUrl}${path}`;

        const response = await axios({
            method: req.method as any,
            url,
            data: req.body,
            params: req.query,
            headers: {
                'Content-Type': 'application/json',
                // Forward auth header if present
                ...(req.headers.authorization && {
                    'Authorization': req.headers.authorization
                }),
                // Forward user info if authenticated
                ...(req.user && {
                    'X-User-Id': req.user.userId,
                    'X-User-Role': req.user.role
                })
            },
            timeout: 30000, // 30 second timeout
            validateStatus: () => true // Don't throw on any status
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(`[Proxy Error] ${req.method} ${path}:`, error);

        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNREFUSED') {
                res.status(503).json({
                    success: false,
                    error: 'Service unavailable',
                    message: 'The requested service is not running'
                });
                return;
            }
            if (error.code === 'ETIMEDOUT') {
                res.status(504).json({
                    success: false,
                    error: 'Gateway timeout',
                    message: 'The service took too long to respond'
                });
                return;
            }
        }

        res.status(500).json({
            success: false,
            error: 'Internal gateway error'
        });
    }
}

// ================================
// TOOL SERVICE ROUTES
// ================================

// Public routes
router.get('/tools', (req, res) =>
    proxyRequest(req, res, SERVICES.tool.url, '/tools'));

router.get('/tools/:slug', (req, res) =>
    proxyRequest(req, res, SERVICES.tool.url, `/tools/${req.params.slug}`));

router.get('/tools/:slug/related', (req, res) =>
    proxyRequest(req, res, SERVICES.tool.url, `/tools/${req.params.slug}/related`));

// Admin routes (protected)
router.post('/admin/tools', authMiddleware, (req, res) =>
    proxyRequest(req, res, SERVICES.tool.url, '/admin/tools'));

router.patch('/admin/tools/:id', authMiddleware, (req, res) =>
    proxyRequest(req, res, SERVICES.tool.url, `/admin/tools/${req.params.id}`));

router.delete('/admin/tools/:id', authMiddleware, (req, res) =>
    proxyRequest(req, res, SERVICES.tool.url, `/admin/tools/${req.params.id}`));

// ================================
// FLOW SERVICE ROUTES
// ================================

// Public routes
router.get('/flows', (req, res) =>
    proxyRequest(req, res, SERVICES.flow.url, '/flows'));

router.get('/flows/:slug', (req, res) =>
    proxyRequest(req, res, SERVICES.flow.url, `/flows/${req.params.slug}`));

router.post('/flows/:slug/start', (req, res) =>
    proxyRequest(req, res, SERVICES.flow.url, `/flows/${req.params.slug}/start`));

router.get('/flows/sessions/:sessionId', (req, res) =>
    proxyRequest(req, res, SERVICES.flow.url, `/flows/sessions/${req.params.sessionId}`));

router.post('/flows/sessions/:sessionId/answer', (req, res) =>
    proxyRequest(req, res, SERVICES.flow.url, `/flows/sessions/${req.params.sessionId}/answer`));

router.post('/flows/sessions/:sessionId/complete', (req, res) =>
    proxyRequest(req, res, SERVICES.flow.url, `/flows/sessions/${req.params.sessionId}/complete`));

// Admin routes (protected)
router.post('/admin/flows', authMiddleware, (req, res) =>
    proxyRequest(req, res, SERVICES.flow.url, '/admin/flows'));

router.patch('/admin/flows/:id', authMiddleware, (req, res) =>
    proxyRequest(req, res, SERVICES.flow.url, `/admin/flows/${req.params.id}`));

router.delete('/admin/flows/:id', authMiddleware, (req, res) =>
    proxyRequest(req, res, SERVICES.flow.url, `/admin/flows/${req.params.id}`));

// ================================
// COMPARISON SERVICE ROUTES
// ================================

router.get('/compare', aiRateLimiter, (req, res) =>
    proxyRequest(req, res, SERVICES.comparison.url, '/compare'));

router.post('/compare', aiRateLimiter, (req, res) =>
    proxyRequest(req, res, SERVICES.comparison.url, '/compare'));

router.get('/compare/popular', (req, res) =>
    proxyRequest(req, res, SERVICES.comparison.url, '/compare/popular'));

// ================================
// RECOMMENDATION SERVICE ROUTES
// ================================

router.post('/recommend', aiRateLimiter, (req, res) =>
    proxyRequest(req, res, SERVICES.recommendation.url, '/recommend'));

router.get('/recommend/session/:sessionId', aiRateLimiter, (req, res) =>
    proxyRequest(req, res, SERVICES.recommendation.url, `/recommend/session/${req.params.sessionId}`));

// ================================
// AUTH SERVICE ROUTES
// ================================

router.get('/auth/me', authMiddleware, (req, res) =>
    proxyRequest(req, res, SERVICES.auth.url, '/me'));

export default router;
