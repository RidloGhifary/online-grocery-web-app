import { Prisma } from '@prisma/client';
import searchFriendlyForLikeQuery from '../searchFriendlyForLikeQuery';

export default async function roleWhereInput({
  search,
}: {
  search: string | undefined;
}): Promise<Prisma.RoleWhereInput> {
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
  } satisfies Prisma.RoleWhereInput;
  return whereQuery;
}
