import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string(),
});

export const registerSchema = z.object({
  first_name: z
    .string()
    .min(3, { message: 'First name must be at least 3 characters' })
    .max(50, { message: 'First name must be less than 50 characters' }),
  last_name: z
    .string()
    .min(3, { message: 'First name must be at least 3 characters' })
    .max(50, { message: 'First name must be less than 50 characters' }),
  province: z.string({ required_error: 'Province is required' }),
  province_id: z.number({ required_error: 'Province is required' }),
  city: z.string({ required_error: 'City is required' }),
  city_id: z.number({ required_error: 'City is required' }),
  address: z.string({ required_error: 'Address is required' }),
  kelurahan: z.string({ required_error: 'Kelurahan is required' }),
  kecamatan: z.string({ required_error: 'Kecamatan is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

export const loginWithGoogleSchema = z.object({
  google_token: z.string().optional(),
});

export const verifyAccountSchema = z.object({
  key: z.string({ required_error: 'Key is required' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

export const forgotPasswordSendMailSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export const forgotPasswordVerifySchema = z.object({
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});
