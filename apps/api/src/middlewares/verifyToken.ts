import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      currentUser?: {
        id: number;
        email: string;
        role?: string;
      };
    }
  }
}
export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorizationHeader = req.headers['authorization'];
  if (!authorizationHeader) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }

  const token = authorizationHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }

  try {
    const verifiedUser = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as JwtPayload & {
      id: number;
      email: string;
    };

    if (!verifiedUser) {
      return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }

    if (verifiedUser.role) {
      req.currentUser = {
        id: verifiedUser.id,
        email: verifiedUser.email,
        role: verifiedUser.role,
      };
    } else {
      req.currentUser = {
        id: verifiedUser.id,
        email: verifiedUser.email,
      };
    }

    next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }
}
