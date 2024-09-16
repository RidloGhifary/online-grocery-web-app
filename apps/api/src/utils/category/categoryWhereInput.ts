import { Prisma } from '@prisma/client';
import searchFriendlyForLikeQuery from '../searchFriendlyForLikeQuery';

export default async function categoryWhereInput({
  search,
}: {
  search: string | undefined;
}): Promise<Prisma.ProductCategoryWhereInput> {
  const searchable = await searchFriendlyForLikeQuery(search);
  const whereQuery = {
    OR: [
      {
        name: {
          contains: searchable,
        },
      },
      {
        display_name: {
          contains: searchable,
        },
      },
    ],
    deletedAt: null,
  } satisfies Prisma.ProductCategoryWhereInput;
  return whereQuery;
}
