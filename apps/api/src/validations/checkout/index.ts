import { z } from 'zod';

export const checkoutSchema = z.object({
  addressId: z.number(),
});

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
  productVoucherId: z.number().nullable(),
  deliveryVoucherId: z.number().nullable(),
  note: z.string().optional(),
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
