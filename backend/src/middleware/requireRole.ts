import { Request, Response, NextFunction } from 'express';

export const requireRole = (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const role = req.authUser?.role;
    if (!role || !roles.includes(role)) {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }
    next();
  };
