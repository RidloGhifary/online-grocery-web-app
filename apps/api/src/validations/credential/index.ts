import { z } from 'zod';

export const changeEmailSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export const forgotPasswordSendMailSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export const forgotPasswordVerifySchema = z.object({
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});
