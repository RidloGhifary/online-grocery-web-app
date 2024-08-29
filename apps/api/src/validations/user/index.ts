import { z } from 'zod';

export const updateUsernameSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(50, { message: 'Username must be less than 50 characters' }),
});

export const updateGenderSchema = z.object({
  gender: z.enum(['male', 'female']),
});

export const updatePhoneNumberSchema = z.object({
  phone_number: z.string().regex(/\+?([ -]?\d+)+|\(\d+\)([ -]\d+)/g, {
    message: 'Invalid phone number',
  }),
});
