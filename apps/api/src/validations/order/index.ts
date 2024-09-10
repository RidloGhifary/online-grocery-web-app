import { z } from 'zod';

export const createOrderSchema = z.object({
  userId: z.number(),
  checkoutItems: z.array(
    z.object({
      product_id: z.number(),
      quantity: z.number(),
      price: z.number(),
    }),
  ),
  selectedAddressId: z.number(),
  storeId: z.number(),
  selectedCourier: z.string(),
  selectedCourierPrice: z.number(),
});

export const getOrdersByUserSchema = z.object({
  userId: z.coerce.number(),
});

export const querySchema = z.object({
  filter: z.enum(['all', 'ongoing', 'completed', 'cancelled']).default('all'),
  search: z.string().optional(),
  sortBy: z.enum(['invoice', 'createdAt']).default('invoice'),
  order: z.enum(['asc', 'desc']).default('asc'),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(12),
});

export const getOrderByIdSchema = z.object({
  orderId: z.coerce.number(),
});

export const cancelOrderSchema = z.object({
  orderId: z.coerce.number(),
});

export const uploadPaymentProofSchema = z.object({
  payment_proof: z.string(),
});
