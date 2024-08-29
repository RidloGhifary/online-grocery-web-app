import prisma from '@/prisma';
import { Request, Response } from 'express';

export class UserController {
  async getCurrentUser(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(req.currentUser?.id),
        },
      });

      res.status(200).json({ ok: true, user });
    } catch {
      res.status(500).json({ ok: false, message: 'Something went wrong' });
    }
  }
}
