import CommonPaginatedResultInterface from '@/interfaces/CommonPaginatedResultInterface';
import CommonResultInterface from '@/interfaces/CommonResultInterface';
import { ProductCategoryInputInterface } from '@/interfaces/ProductCategoryInterface';
import prisma from '@/prisma';
import paginate, { numberization } from '@/utils/paginate';
import roleWhereInput from '@/utils/role/roleWhereInput';
import { ProductCategory, Role } from '@prisma/client';

class RoleRepository {
  async getRoleList({
    search,
    order = 'asc',
    orderField = 'name',
    limitNumber = 20,
    pageNumber = 1,
  }: {
    search?: string;
    order?: 'asc' | 'desc';
    orderField?: 'name' | 'display_name';
    pageNumber?: number;
    limitNumber?: number;
  }): Promise<CommonPaginatedResultInterface<Role[]>> {
    let result = {
      ok: false,
      data: {
        data: null,
        pagination: null,
      },
    } as unknown as CommonPaginatedResultInterface<Role[]>;
    try {
      const count = await prisma.role.count({
        where: {
          ...(await roleWhereInput({ search: search })),
        },
      });
      const safePageNumber = numberization(pageNumber);
      const safeLimitNumber = numberization(limitNumber);
      const res = await prisma.role.findMany({
        where: { ...(await roleWhereInput({ search: search })) },
        skip: (safePageNumber - 1) * safeLimitNumber,
        take: safeLimitNumber,
        orderBy: !order
          ? undefined
          : [
              {
                name: orderField && orderField === 'name' ? order : undefined,
              },
              {
                display_name:
                  orderField && orderField === 'display_name'
                    ? order
                    : undefined,
              },
            ],
      });

      if (count <= 0) {
        throw new Error('Not found 404');
      }

      result.data.pagination = paginate({
        pageNumber: safePageNumber,
        limitNumber: safeLimitNumber,
        totalData: count,
      });

      result.data.data = res;
      result.ok = true;
      result.message = 'Query Success';
      // console.log(result);
    } catch (error) {
      result.error = error;
      result.message = 'Error';
    }
    return result;
  }

  async createRole(
    productCategory: ProductCategory,
  ): Promise<CommonResultInterface<ProductCategory>> {
    let result: CommonResultInterface<ProductCategory> = {
      ok: false,
    };
    try {
      const [newData] = await prisma.$transaction([
        prisma.productCategory.create({
          data: {
            ...productCategory,
          },
        }),
      ]);
      result.data = newData;
      result.ok = true;
      result.message = 'Success adding data';
    } catch (error) {
      result.error = error;
      return result;
    }
    return result;
  }

  async updateRole(
    productCategory: ProductCategoryInputInterface,
  ): Promise<CommonResultInterface<ProductCategory>> {
    let result: CommonResultInterface<ProductCategory> = {
      ok: false,
    };
    try {
      const categoryId = productCategory.id;
      delete productCategory.id;
      const [newData] = await prisma.$transaction([
        prisma.productCategory.update({
          data: {
            ...productCategory,
          },
          where: {
            id: categoryId,
            deletedAt: null,
          },
        }),
      ]);
      if (!newData) {
        throw new Error('404 not found');
      }
      result.data = newData;
      result.ok = true;
      result.message = 'Success update data';
    } catch (error) {
      result.error = error;
      return result;
    }
    return result;
  }

  async deleteRole(
    productCategoryId?: number,
  ): Promise<CommonResultInterface<boolean>> {
    let result: CommonResultInterface<boolean> = {
      ok: false,
    };
    try {
      const [deleted] = await prisma.$transaction([
        prisma.productCategory.delete({
          where: { id: productCategoryId, deletedAt: null },
        }),
      ]);
      if (!deleted) {
        throw new Error(JSON.stringify(deleted));
      }
      result.ok = true;
      result.message = 'Success delete data';
    } catch (error) {
      result.error = (error as Error).message;
    }
    return result;
  }

  async isProductCategoryIdExist(id?: number): Promise<boolean> {
    // console.log('from category repo');

    return !!(
      (await prisma.productCategory.findFirst({
        select: { id: true, deletedAt: true },
        where: { id: id, deletedAt: null },
      })) && id
    );
  }

  async isProductCategoryIdExistCount(id?: number): Promise<number> {
    return await prisma.productCategory.count({
      where: { id: id, deletedAt: null },
    });
  }

  async isUserHasProductCategoryPermission(
    userId?: number,
    permission?: string,
  ): Promise<boolean> {
    if (!userId || !permission) {
      return false;
    }
    return !!(await prisma.userHasRole.findFirst({
      where: {
        AND: {
          id: userId,
          role: {
            roles_permissions: { some: { permission: { name: permission } } },
          },
        },
        deletedAt: null,
      },
    }));
  }

  async isProductCategoryNameExist(
    name?: string,
    excludeId?: number,
  ): Promise<boolean> {
    return !!(await prisma.productCategory.findFirst({
      where: { name, id: { not: excludeId }, deletedAt: null },
    }));
  }

  async isProductCategoryDisplayNameExist(
    display_name?: string,
    excludeId?: number,
  ): Promise<boolean> {
    return !!(await prisma.productCategory.findFirst({
      where: { display_name, id: { not: excludeId }, deletedAt: null },
    }));
  }
}

export const roleRepository = new RoleRepository();
