import { Prisma } from '@prisma/client';
import searchFriendlyForLikeQuery from '../searchFriendlyForLikeQuery';

export async function getAllUserWhereInput({
  search,
}: {
  search: string | undefined;
}): Promise<Prisma.UserWhereInput> {
  const searchable = await searchFriendlyForLikeQuery(search);
  const whereQuery = {
    OR: [
      {
        first_name: {
          contains: searchable,
        },
      },
      {
        last_name: {
          contains: searchable,
        },
      },
      {
        email: {
          contains: searchable,
        },
      },
      {
        middle_name: {
          contains: searchable,
        },
      },
      {
        username: {
          contains: searchable,
        },
      },
      {
        phone_number: {
          contains: searchable,
        },
      },
      {
        addresses: {
          some: {
            OR: [
              {
                address: {
                  contains: searchable,
                },
              },
              {
                kecamatan: {
                  contains: searchable,
                },
              },
              {
                kelurahan: {
                  contains: searchable,
                },
              },
              {
                postal_code : {
                  contains: searchable,
                },
              },
              {
                city :{
                  OR :[
                    {
                      city_name : {
                        contains: searchable,
                      },
                    },
                    {
                      province : {
                        OR :[
                          {
                            province : {
                              contains: searchable,
                            },
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ],
          },
        },
      },
    ],
    // deleted_at: null,
  } satisfies Prisma.UserWhereInput;
  return whereQuery;
}
