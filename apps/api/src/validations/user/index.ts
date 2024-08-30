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

export const insertUserAddressSchema = z.object({
  label: z.string({ required_error: 'Label is required' }),
  province: z.string({ required_error: 'Province is required' }),
  province_id: z.number({ required_error: 'Province is required' }),
  city: z.string({ required_error: 'City is required' }),
  city_id: z.number({ required_error: 'City is required' }),
  address: z.string({ required_error: 'Address is required' }),
  kelurahan: z.string({ required_error: 'Kelurahan is required' }),
  kecamatan: z.string({ required_error: 'Kecamatan is required' }),
  is_primary: z.boolean(),
});
