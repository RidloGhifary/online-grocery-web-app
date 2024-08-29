import prisma from '@/prisma';
import {
  updateGenderSchema,
  updatePhoneNumberSchema,
  updateUsernameSchema,
} from '@/validations/user';
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

  async updateUserBiodata(req: Request, res: Response) {
    try {
      const { field } = req.query;

      if (!field) {
        return res
          .status(400)
          .json({ ok: false, message: 'Field is required' });
      }

      if (field === 'username') {
        const validatedRequest = updateUsernameSchema.safeParse(req.body);

        if (!validatedRequest.success) {
          return res.status(400).json({
            ok: false,
            message: validatedRequest.error.issues[0].message,
          });
        }

        const { username } = validatedRequest.data;

        const user = await prisma.user.update({
          where: {
            id: Number(req.currentUser?.id),
          },
          data: {
            username,
          },
        });

        return res
          .status(200)
          .json({ ok: true, message: 'Update user success', data: user });
      } else if (field === 'gender') {
        const validatedRequest = updateGenderSchema.safeParse(req.body);

        if (!validatedRequest.success) {
          return res.status(400).json({
            ok: false,
            message: validatedRequest.error.issues[0].message,
          });
        }

        const { gender } = validatedRequest.data;

        const user = await prisma.user.update({
          where: {
            id: Number(req.currentUser?.id),
          },
          data: {
            gender: gender as 'male' | 'female',
          },
        });

        res
          .status(200)
          .json({ ok: true, message: 'Update user success', data: user });
      } else if (field === 'phone_number') {
        const validatedRequest = updatePhoneNumberSchema.safeParse(req.body);
        if (!validatedRequest.success) {
          return res.status(400).json({
            ok: false,
            message: validatedRequest.error.issues[0].message,
          });
        }

        const { phone_number } = validatedRequest.data;

        const user = await prisma.user.update({
          where: {
            id: Number(req.currentUser?.id),
          },
          data: {
            phone_number,
          },
        });

        res
          .status(200)
          .json({ ok: true, message: 'Update user success', data: user });
      } else {
        return res.status(400).json({ ok: false, message: 'Field not found' });
      }
    } catch {
      res.status(500).json({ ok: false, message: 'Something went wrong' });
    }
  }
}
