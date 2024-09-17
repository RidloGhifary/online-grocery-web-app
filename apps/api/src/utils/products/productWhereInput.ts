import { Prisma } from '@prisma/client';
import searchFriendlyForLikeQuery from '../searchFriendlyForLikeQuery';

export default async function productWhereInput({
  search,
  category,
}: {
  search: string | undefined;
  category: string | undefined;
}): Promise<Prisma.ProductWhereInput> {
  const searchable = await searchFriendlyForLikeQuery(search);
  const searchableCategory = await searchFriendlyForLikeQuery(category);
  const whereQuery = {
    OR: [
      {
        name: {
          contains: searchable,
        },
      },
      {
        description: {
          contains: searchable,
        },
      },
      {
        sku: {
          contains: searchable,
        },
      },
      {
        slug: {
          contains: searchable,
        },
      },
    ],
    AND: [
      {
        product_category: category
          ? {
              name: {
                contains: searchableCategory,
              },
              display_name: {
                contains: searchableCategory,
              },
            }
          : undefined,
      },
    ],
    deletedAt: null,
  } satisfies Prisma.ProductWhereInput;
  return whereQuery;
}


export async function productAdminWhereInput({
  search,
}: {
  search: string | undefined;
}): Promise<Prisma.ProductWhereInput> {
  const searchable = await searchFriendlyForLikeQuery(search);
  const whereQuery = {
    OR: [
      {
        name: {
          contains: searchable,
        },
      },
      {
        description: {
          contains: searchable,
        },
      },
      {
        sku: {
          contains: searchable,
        },
      },
      {
        slug: {
          contains: searchable,
        },
      },
    ],
    deletedAt: null,
  } satisfies Prisma.ProductWhereInput;
  return whereQuery;
}