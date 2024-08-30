import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import prisma from '@/prisma';
import getUserByEmail from '@/utils/getUserByEmail';
import { sendMailChangeEmail } from '@/utils/send-mail/sendMailChangeEmail';
import {
  changeEmailSchema,
  forgotPasswordSendMailSchema,
  forgotPasswordVerifySchema,
} from '@/validations/credential';
import { sendResetPasswordEmail } from '@/utils/send-mail/sendMailResetPassword';

export class CredentialController {
  async changeEmail(req: Request, res: Response) {
    try {
      const validatedRequest = changeEmailSchema.safeParse(req.body);

      if (!validatedRequest.success) {
        return res.status(400).json({
          ok: false,
          message: validatedRequest.error.issues[0].message,
        });
      }

      const { email } = validatedRequest.data;

      console.log(req.currentUser);

      if (!req.currentUser) {
        return res.status(400).json({ ok: false, message: 'User not found' });
      }

      const currentUser = await prisma.user.findFirst({
        where: {
          email: req.currentUser?.email,
        },
      });

      if (!currentUser) {
        return res.status(400).json({ ok: false, message: 'User not found' });
      }

      if (currentUser.is_google_linked) {
        return res
          .status(400)
          .json({ ok: false, message: 'Google account cannot be changed' });
      }

      if (email === currentUser.email) {
        return res.status(400).json({
          ok: false,
          message: 'New email cannot be same as old email',
        });
      }

      const payload = { currentEmail: currentUser.email, newEmail: email };

      console.log(
        '🚀 ~ CredentialController ~ changeEmail ~ payload:',
        payload,
      );
      const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });
      console.log('🚀 ~ CredentialController ~ changeEmail ~ token:', token);

      // TODO: Send email
      await sendMailChangeEmail({ email, key: token });

      res
        .status(200)
        .json({ ok: true, message: 'Verification new email sent' });
    } catch {
      res.status(500).json({ ok: false, message: 'Something went wrong' });
    }
  }

  async storeChangeEmailToken(req: Request, res: Response) {
    try {
      const { key } = req.query;

      const decodedKey: JwtPayload = jwt.verify(
        decodeURIComponent(key as string),
        process.env.JWT_SECRET!,
      ) as JwtPayload;

      const { currentEmail, newEmail } = decodedKey;

      const user = await prisma.user.update({
        where: {
          email: currentEmail,
        },
        data: {
          email: newEmail,
          validated_at: new Date(),
        },
      });

      const token = jwt.sign(user, process.env.JWT_SECRET!, {
        expiresIn: '1d',
      });

      res
        .status(200)
        .json({ ok: true, message: 'Email changed successfully', token });
    } catch {
      res.status(500).json({ ok: false, message: 'Something went wrong' });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { key } = req.query;

      if (key) {
        const validatedRequest = forgotPasswordVerifySchema.safeParse(req.body);

        if (!validatedRequest.success) {
          return res.status(400).json({
            ok: false,
            message: validatedRequest.error.issues[0].message,
          });
        }

        const decodedKey: JwtPayload = jwt.verify(
          decodeURIComponent(key as string),
          process.env.JWT_SECRET!,
        ) as JwtPayload;

        const user = await getUserByEmail(decodedKey.email);

        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
          where: {
            email: user?.email,
          },
          data: {
            password: hashedPassword,
          },
        });

        res.status(200).json({ ok: true, message: 'Password changed' });
      } else {
        const validatedRequest = forgotPasswordSendMailSchema.safeParse(
          req.body,
        );

        if (!validatedRequest.success) {
          return res.status(400).json({
            ok: false,
            message: validatedRequest.error.issues[0].message,
          });
        }

        const user = await getUserByEmail(validatedRequest.data.email);

        if (!user) {
          return res.status(400).json({
            ok: false,
            message: 'User not found',
          });
        }

        if (!user?.validated_at) {
          return res.status(400).json({
            ok: false,
            message: 'Your account is not verified',
          });
        }

        if (user?.is_google_linked) {
          return res.status(400).json({
            ok: false,
            message: 'Your account is linked with Google',
          });
        }

        const key = jwt.sign(
          { email: validatedRequest.data.email },
          process.env.JWT_SECRET!,
          {
            expiresIn: '1d',
          },
        );

        // TODO: SEND EMAIL RESET PASSWORD
        await sendResetPasswordEmail({
          email: validatedRequest.data.email,
          key,
          path: 'reset-password',
        });

        res.status(200).json({ ok: true, message: 'Email sent' });
      }
    } catch {
      res.status(500).json({ ok: false, message: 'Something went wrong' });
    }
  }
}
