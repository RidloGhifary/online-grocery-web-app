import { z } from 'zod';

export const checkoutSchema = z.object({
  addressId: z.number(),
});

export const stockMutationSchema = z.object({
  selectedStoreId: z.number(),
  productId: z.number(),
  qtyNeeded: z.number().min(1),
});

export const getVouchersSchema = z.object({
  currentUser: z.object({
    id: z.number(),
    email: z.string().email(),
  }),
});

export const getVoucherByIdSchema = z.object({
  voucherId: z.string().uuid('Invalid Voucher ID format'),
});
