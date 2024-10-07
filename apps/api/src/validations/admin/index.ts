import { z } from 'zod';
import { $Enums } from '@prisma/client';
import { adminRepository } from '@/repositories/admin.repository';

// Assuming $Enums.GENDER is an enum like this, modify according to your actual enum
const GenderEnum = z.nativeEnum($Enums.GENDER); // Adjust this if necessary

export const adminCreateSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Username is required' })
    .refine(
      async (username) => !(await adminRepository.isUsernameExist(username)),
      { message: 'Username already exists, it must be unique' },
    ),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .refine(async (email) => !(await adminRepository.isEmailExist(email)), {
      message: 'Email already exists, it must be unique',
    }),
  phone_number: z
    .string()
    .nullable()
    .optional()
    .refine(async (phone) => !(await adminRepository.isPhoneExist(phone!)), {
      message: 'Phone already exists, it must be unique',
    }),
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  gender: GenderEnum,
  password: z.string(),
  middle_name: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  role_id: z.number().int(),
});

export const adminUpdateSchema = z
  .object({
    id: z.number().positive('Identifier must be valid'),
    username: z.string().min(1, { message: 'Username is required' }).optional(),
    email: z.string().email({ message: 'Invalid email address' }).optional(),
    phone_number: z.string().nullable().optional(),
    first_name: z
      .string()
      .min(1, { message: 'First name is required' })
      .optional(),
    last_name: z
      .string()
      .min(1, { message: 'Last name is required' })
      .optional(),
    gender: GenderEnum.optional(),
    password: z.string().nullable().optional(),
    middle_name: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    role_id: z.number().positive('Identifier must be valid').optional(),
  })
  .superRefine(async (data, ctx) => {
    const { id, username, email, phone_number } = data;
    if (username) {
      const isUsernameExist = await adminRepository.isUsernameExist(
        username,
        id,
      );
      if (isUsernameExist) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['username'],
          message: 'Username already exists, it must be unique',
        });
      }
    }
    if (email) {
      const isEmailExist = await adminRepository.isEmailExist(email, id);
      if (isEmailExist) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['email'],
          message: 'Email already exists, it must be unique',
        });
      }
    }
    if (phone_number) {
      const isPhoneExist = await adminRepository.isPhoneExist(phone_number, id);
      if (isPhoneExist) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['phone_number'],
          message: 'Phone number already exists, it must be unique',
        });
      }
    }
  });

  
export const deleteAdminSchema = z.object({
  id: z.string().refine((val) => !isNaN(Number(val)), {
    message: 'id must be a valid number',
  }).transform((val) => Number(val)),
}).superRefine(async (data, ctx) => {
  const { id } = data;
  const isAdminExist = await adminRepository.isAdminIDExist(id)
  if (!isAdminExist) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['id'],
      message: "Admin did not exist or already deleted",
    });
  }
});