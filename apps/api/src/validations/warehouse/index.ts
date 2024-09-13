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
