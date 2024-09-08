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
