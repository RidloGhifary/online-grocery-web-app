import { z } from 'zod';

export const createStoreSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(50, { message: 'Name must be less than 50 characters' }),
  image: z.string().url({ message: 'Invalid image url' }).optional(),
  store_type: z.enum(['central', 'branch']),
  province: z.string({ required_error: 'Province is required' }),
  province_id: z.number({ required_error: 'Province is required' }),
  city: z.string({ required_error: 'City is required' }),
  city_id: z.number({ required_error: 'City is required' }),
  address: z
    .string({ required_error: 'Address is required' })
    .max(100, { message: 'Address must be less than 100 characters' }),
  kelurahan: z
    .string({ required_error: 'Kelurahan is required' })
    .max(100, { message: 'Address must be less than 100 characters' }),
  kecamatan: z
    .string({ required_error: 'Kecamatan is required' })
    .max(100, { message: 'Address must be less than 100 characters' }),
});
