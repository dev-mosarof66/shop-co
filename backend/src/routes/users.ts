import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/me', requireAuth, (req: Request, res: Response) => {
  res.json({ success: true, data: req.authUser });
});

export default router;
