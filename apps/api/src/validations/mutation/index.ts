import { z } from 'zod';

export const getStockMutationsSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  search: z.string().optional(),
  sort: z.enum(['asc', 'desc']).optional(),
  store_id: z.number().optional(),
});

export const confirmStockMutationSchema = z.object({
  pendingMutationId: z.number({
    required_error: 'Mutation ID is required',
    invalid_type_error: 'Mutation ID must be a number',
  }),
});
