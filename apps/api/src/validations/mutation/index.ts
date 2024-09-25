import { z } from 'zod';

export const getStockMutationsSchema = z.object({
  page: z.number().min(1).optional(),
  search: z.string().optional(),
  sort: z.enum(['asc', 'desc']).optional(),
  store_id: z.number().optional(),
});

export const confirmStockMutationSchema = z.object({
  pendingMutationId: z.number().min(1),
});
