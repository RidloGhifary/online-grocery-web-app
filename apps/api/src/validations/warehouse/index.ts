import { z } from 'zod';

export const getOrdersForAdminSchema = z.object({
  filter: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'createdAt', 'invoice']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  storeId: z.coerce.number().optional(),
});

export const getOrderByIdSchema = z.object({
  id: z.coerce.number().nonnegative(),
});

export const handlePaymentProofSchema = z.object({
  orderId: z.coerce.number().nonnegative(),
  action: z.enum(['accept', 'decline']),
});

export const deliverProductSchema = z.object({
  orderId: z.coerce.number().nonnegative(),
});

export const cancelOrderSchema = z.object({
  orderId: z.coerce.number().nonnegative(),
});
