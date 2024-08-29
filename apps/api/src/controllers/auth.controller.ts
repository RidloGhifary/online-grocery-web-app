import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from '@/prisma';

import getUserByEmail from '@/utils/getUserByEmail';
import createReferralCode from '@/utils/createReferralCode';
import { sendVerificationEmail } from '@/utils/send-mail/sendMailVerification';
import getUserCoordinates from '@/utils/getUserCoordinates';
import {
  loginSchema,
  registerSchema,
  verifyAccountSchema,
} from '@/validations/auth';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const validatedRequest = loginSchema.safeParse(req.body);

      if (!validatedRequest.success) {
        return res.status(400).json({
          ok: false,
          message: validatedRequest.error.issues[0].message,
        });
      }

      const { email, password } = req.body;

      const user = await getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ ok: false, message: 'User not found' });
      }

      if (!user.validated_at) {
        return res
          .status(401)
          .json({ ok: false, message: 'Invalid credentials' });
      }

      if (user.is_google_linked) {
        return res.status(401).json({
          ok: false,
          message: 'Account already used by another provider',
        });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password!);

      if (!isPasswordMatch) {
        return res
          .status(401)
          .json({ ok: false, message: 'Invalid credentials' });
      }

      const token = jwt.sign(user, process.env.JWT_SECRET!, {
        expiresIn: '1d',
      });

      res.status(200).json({ ok: true, message: 'Login success', token });
    } catch {
      res.status(500).json({ ok: false, message: 'Something went wrong' });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const validatedRequest = registerSchema.safeParse(req.body);

      if (!validatedRequest.success) {
        return res.status(400).json({
          ok: false,
          message: validatedRequest.error.issues[0].message,
        });
      }

      const user = await getUserByEmail(req.body.email);

      if (user) {
        return res
          .status(400)
          .json({ ok: false, message: 'User already exists' });
      }

      // TODO: SEND EMAIL VERIFICATION
      const token = jwt.sign(req.body, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });

      await sendVerificationEmail({ email: req.body.email, key: token });

      res.status(201).json({ ok: true, message: 'Verification email sent' });
    } catch {
      res.status(500).json({ ok: false, message: 'Something went wrong' });
    }
  }

  async verifyAccount(req: Request, res: Response) {
    try {
      const validatedRequest = verifyAccountSchema.safeParse(req.body);

      if (!validatedRequest.success) {
        return res.status(400).json({
          ok: false,
          message: validatedRequest.error.issues[0].message,
        });
      }

      const { key, password } = req.body;

      const decodedData: JwtPayload = jwt.verify(
        decodeURIComponent(key),
        process.env.JWT_SECRET!,
      ) as JwtPayload;

      if (decodedData.exp && decodedData.exp < Date.now() / 1000) {
        return res.status(400).json({ ok: false, message: 'Expired token' });
      }

      const {
        first_name,
        last_name,
        email,
        province,
        province_id,
        city,
        city_id,
        address,
        kelurahan,
        kecamatan,
      } = decodedData;

      const referral = createReferralCode(first_name);
      const hashedPassword = await bcrypt.hash(password, 10);

      // TODO: CREATE NEW USER
      const newUser = await prisma.user.create({
        data: {
          username: `${first_name} ${last_name}`,
          first_name,
          last_name,
          password: hashedPassword,
          email,
          validated_at: new Date(),
          is_google_linked: false,
          referral,
        },
      });

      // TODO: CREATE NEW USER ADDRESS
      const userGeo = await getUserCoordinates({ city, province });
      if (!userGeo) {
        return res.status(400).json({ ok: false, message: 'Invalid address' });
      }

      const cityData = await prisma.city.findUnique({
        where: {
          id: city_id,
        },
      });

      if (!cityData) {
        return res.status(400).json({ ok: false, message: 'Invalid city' });
      }

      await prisma.usersAddress.create({
        data: {
          user_id: newUser.id,
          city_id: cityData.id,
          is_primary: true,
          address,
          kelurahan,
          kecamatan,
          postal_code: cityData.postal_code,
          latitude: userGeo.latitude,
          longtitude: userGeo.longtitude,
        },
      });

      res.status(200).json({ ok: true, message: 'Account verified' });
    } catch {
      res.status(500).json({ ok: false, message: 'Something went wrong' });
    }
  }
}
