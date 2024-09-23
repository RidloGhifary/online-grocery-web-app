import CommonPaginatedResultInterface from '@/interfaces/CommonPaginatedResultInterface';
import prisma from '@/prisma';
import paginate, { numberization } from '@/utils/paginate';
import { productAdminWhereInput } from '@/utils/products/productWhereInput';
import { Prisma, Product, User } from '@prisma/client';

class StockRepository {
  async getAdminProductStockList({
    search,
    order = 'asc',
    orderField = 'product_name',
    limitNumber = 20,
    pageNumber = 1,
    storeId,
    adminId,
  }: {
    search?: string;
    order?: 'asc' | 'desc';
    orderField?: 'product_name' | 'category';
    pageNumber?: number;
    limitNumber?: number;
    storeId?: number | null;
    adminId?: number | null;
  }): Promise<CommonPaginatedResultInterface<Product[]>> {
    let result = {
      ok: false,
      data: {
        data: null,
        pagination: null,
      },
    } as unknown as CommonPaginatedResultInterface<Product[]>;
    try {
      let currentAdmin: Prisma.UserGetPayload<{
        include: {
          store_admins: { include: { store: true } };
          role: {
            include: {
              role: {
                include: {
                  roles_permissions: { include: { permission: true } };
                };
              };
            };
          };
        };
      }> | null = null;

      if (adminId) {
        currentAdmin = await prisma.user.findFirst({
          where: { id: adminId, deleted_at: null },
          include: {
            store_admins: { include: { store: true } },
            role: {
              include: {
                role: {
                  include: {
                    roles_permissions: { include: { permission: true } },
                  },
                },
              },
            },
          },
        });
      }

      const count = await prisma.product.count({
        where: {
          ...(await productAdminWhereInput({ search: search })),
        },
      });

      const safePageNumber = numberization(pageNumber);
      const safeLimitNumber = numberization(limitNumber);
      const res = await prisma.product.findMany({
        where: {
          ...(await productAdminWhereInput({ search: search })),
        },
        skip: (safePageNumber - 1) * safeLimitNumber,
        take: safeLimitNumber,
        include: {
          product_category: true,
          StoreHasProduct: {
            where: {
              store_id:
                currentAdmin &&
                !!currentAdmin.role[0].role?.roles_permissions.find(
                  (e) => e.permission.name === 'super',
                )
                  ? storeId
                  : currentAdmin?.store_admins.find(
                      (e) => e.store.id === storeId,
                    )?.id,
            },
          },
        },
        orderBy: !order
          ? undefined
          : [
              {
                name:
                  orderField && orderField === 'product_name'
                    ? order
                    : undefined,
              },
              {
                product_category: {
                  name:
                    orderField && orderField === 'category' ? order : undefined,
                },
              },
              {
                product_category: {
                  display_name:
                    orderField && orderField === 'category' ? order : undefined,
                },
              },
            ],
      });

      if (count <= 0) {
        throw new Error('Not found 404');
      }

      result.data.data = res;

      result.data.pagination = paginate({
        pageNumber: safePageNumber,
        limitNumber: safeLimitNumber,
        totalData: count,
      });

      result.ok = true;
      result.message = 'Query Success';
    } catch (error) {
      if (error instanceof Error) {
        result.error = error.message;
      }
      result.message = 'Error';
    }
    return result;
  }
}

export const stockRepository = new StockRepository();
