import { Router } from 'express';
import {
    getComparison,
    createComparison,
    getPopular
} from '../controllers/comparison.controller';

const router = Router();

/**
 * GET /compare?tools=slug1,slug2
 * Get or generate comparison by tool slugs
 */
router.get('/compare', getComparison);

/**
 * POST /compare
 * Generate new comparison
 * Body: { tools: ["slug1", "slug2"] }
 */
router.post('/compare', createComparison);

/**
 * GET /compare/popular
 * Get popular comparisons
 */
router.get('/compare/popular', getPopular);

export default router;
