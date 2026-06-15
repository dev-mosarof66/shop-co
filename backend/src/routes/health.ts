import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /api/v1/health
 * Health check endpoint
 */
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
