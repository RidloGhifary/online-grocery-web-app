import { z } from 'zod';

export const checkoutSchema = z.object({
  addressId: z.number(),
});
