import { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../lib/auth';

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string;
        email: string;
        role: string;
        name: string;
      };
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    req.authUser = {
      id: session.user.id,
      email: session.user.email,
      role: (session.user as any).role ?? 'customer',
      name: session.user.name ?? '',
    };

    next();
  } catch {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};
