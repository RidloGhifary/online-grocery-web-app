import { NextFunction, Request, Response } from 'express';

export async function verifySuperAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = req.currentUser;

    if (!user?.role || user?.role !== 'super_admin') {
      return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }
}
