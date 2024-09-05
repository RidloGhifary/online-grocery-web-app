import { z } from 'zod';

const getCartItemsSchema = z.object({});

export const addItemSchema = z.object({
  productId: z
    .number()
    .min(1, { message: 'Product ID must be a positive number' }),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
  storeId: z.number().min(1, { message: 'Store ID must be a positive number' }),
});

export const updateQuantitySchema = z.object({
  quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
});

export const removeItemSchema = z.object({});

export const selectForCheckoutSchema = z
  .object({
    productIds: z.array(
      z.number().min(1, { message: 'Product ID must be a positive number' }),
    ),
    quantities: z.array(
      z.number().min(1, { message: 'Quantity must be at least 1' }),
    ),
  })
  .refine((data) => data.productIds.length === data.quantities.length, {
    message: 'Each productId must have a corresponding quantity',
    path: ['quantities'],
  });
