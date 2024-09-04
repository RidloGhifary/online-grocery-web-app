import { Prisma } from "@prisma/client";

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include : {
    product_category : true
  }
}>