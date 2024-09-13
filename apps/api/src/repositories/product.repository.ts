import CommonPaginatedResultInterface from '@/interfaces/CommonPaginatedResultInterface';
import CommonResultInterface from '@/interfaces/CommonResultInterface';
import prisma from '@/prisma';
import paginate, { numberization } from '@/utils/paginate';
import productWhereInput from '@/utils/products/productWhereInput';
import slugify from '@/utils/slugify';
import { Product } from '@prisma/client';
import tokenValidation from '@/utils/tokenValidation';
import { userRepository } from './user.repository';
import { UpdateProductInputInterface } from '@/interfaces/ProductInterface';

class ProductRepository {
  async publicProductList({
    category,
    search,
    order = 'asc',
    orderField = 'product_name',
    limitNumber = 20,
    pageNumber = 1,
  }: {
    category?: string;
    search?: string;
    order?: 'asc' | 'desc';
    orderField?: 'product_name' | 'category';
    pageNumber?: number;
    limitNumber?: number;
  }): Promise<CommonPaginatedResultInterface<Product[]>> {
    let result = {
      ok: false,
      data: {
        data: null,
        pagination: null,
      },
    } as unknown as CommonPaginatedResultInterface<Product[]>;
    try {
      const count = await prisma.product.count({
        where: {
          ...(await productWhereInput({ search: search, category: category })),
        },
      });

      const safePageNumber = numberization(pageNumber);
      const safeLimitNumber = numberization(limitNumber);
      const res = await prisma.product.findMany({
        where: {
          ...(await productWhereInput({ search: search, category: category })),
        },
        skip: (safePageNumber - 1) * safeLimitNumber,
        take: safeLimitNumber,
        include: {
          product_category: true,
          StoreHasProduct: true,
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

  async getSingleProduct({
    slug,
    token,
    citiId,
  }: {
    slug: string;
    token?: string;
    citiId?: number;
  }): Promise<CommonResultInterface<Product>> {
    const result: CommonResultInterface<Product> = {
      ok: false,
    };

    const userLoggedIn =
      await userRepository.getUserWithRoleAndPermission(token);
    let userId: number | undefined = undefined;
    if (userLoggedIn.ok && !userLoggedIn.error && userLoggedIn.data) {
      userId = userLoggedIn.data.id;
    }

    const tokenRes = tokenValidation(token).data!;
    if (!tokenRes) {
      citiId = 152; //Jakarta Pusat
    }
    const isSuper =
      userLoggedIn.data?.role[0].role.roles_permissions.filter(
        (e) =>
          e.permission.name == 'super' ||
          userLoggedIn.data?.role[0].role.name == 'super_admin',
      )[0].permission.name == 'super';

    const isAdmin =
      userLoggedIn.data?.role[0].role.roles_permissions.filter(
        (e) => e.permission.name == 'admin_access',
      )[0].permission.name == 'admin_access';

    try {
      const res = await prisma.product.findFirst({
        where: {
          slug: slug,
        },
        include: {
          product_category: true,
          StoreHasProduct: {
            include: {
              store: isSuper
                ? true
                : {
                    where: {
                      city_id: citiId,
                    },
                    include: {
                      city: true,
                    },
                  },
            },
          },
        },
      });
      if (!res) {
        result.error = 'not found';
        return result;
      }
      result.data = res;
      result.ok = true;
      result.message = 'Query Success';
    } catch (error) {
      result.error = error;
      result.message = 'Error';
    }
    return result;
  }

  async getSingleProductAdmin({
    slug,
    token,
    // citiId,
  }: {
    slug: string;
    token?: string;
    // citiId?: number;
  }): Promise<CommonResultInterface<Product>> {
    const result: CommonResultInterface<Product> = {
      ok: false,
    };

    const userLoggedIn =
      await userRepository.getUserWithRoleAndPermission(token);
    let userId: number | undefined = undefined;
    if (userLoggedIn.ok && !userLoggedIn.error && userLoggedIn.data) {
      userId = userLoggedIn.data.id;
    }

    const tokenRes = tokenValidation(token).data!;
    // if (!tokenRes) {
    //   citiId = 152; //Jakarta Pusat
    // }
    const isSuper =
      userLoggedIn.data?.role[0].role.roles_permissions.filter(
        (e) =>
          e.permission.name == 'super' ||
          userLoggedIn.data?.role[0].role.name == 'super_admin',
      )[0].permission.name == 'super';

    const isAdmin =
      userLoggedIn.data?.role[0].role.roles_permissions.filter(
        (e) => e.permission.name == 'admin_access',
      )[0].permission.name == 'admin_access';

    try {
      const res = await prisma.product.findFirst({
        where: {
          slug: slug,
        },
        include: {
          product_category: true,
          StoreHasProduct: {
            include: {
              store: isSuper
                ? true
                : {
                    where: {
                      store_admins: {
                        some: {
                          user_id: userLoggedIn.data?.id,
                        },
                      },
                    },
                    include: {
                      city: true,
                      store_admins: true,
                    },
                  },
            },
          },
        },
      });
      if (!res) {
        result.error = 'not found';
        return result;
      }
      result.data = res;
      result.ok = true;
      result.message = 'Query Success';
    } catch (error) {
      result.error = error;
      result.message = 'Error';
    }
    return result;
  }

  async createProduct(
    product: Product,
  ): Promise<CommonResultInterface<Product>> {
    let result: CommonResultInterface<Product> = {
      ok: false,
    };
    try {
      product.slug = slugify(product.name);
      // product.image
      if (Array.isArray(product.image)) {
        product.image = JSON.stringify(product.image);
      }
      const newData = await prisma.product.create({
        data: {
          ...product,
        },
        include: {
          product_category: true,
        },
      });
      result.data = newData;
      result.ok = true;
      result.message = 'Success adding data';
    } catch (error) {
      result.error = error;
      return result;
    }
    return result;
  }

  async updateProduct(
    product: UpdateProductInputInterface,
  ): Promise<CommonResultInterface<UpdateProductInputInterface>> {
    let result: CommonResultInterface<UpdateProductInputInterface> = {
      ok: false,
    };
    try {
      if (product.slug) {
        product.slug = slugify(product.name!);
      }
      if (Array.isArray(product.image)) {
        product.image = JSON.stringify(product.image);
      }
      const product_id = product.id;
      delete product.id;
      const updatedData = await prisma.product.update({
        data: {
          ...product,
        },
        where: {
          id: product_id,
        },
      });
      result.data = updatedData;
      result.ok = true;
      result.message = 'Success update data';
    } catch (error) {
      result.error = error;
      return result;
    }
    return result;
  }

  async deleteProduct(
    productId?: number,
  ): Promise<CommonResultInterface<boolean>> {
    let result: CommonResultInterface<boolean> = {
      ok: false,
    };
    try {
      const deleted = await prisma.product.delete({ where: { id: productId } });
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

  async isProductIdExist(productId?: number): Promise<number> {
    return await prisma.product.count({
      where: { AND: { id: productId, deletedAt: null } },
    });
  }

  async isUserHasProductPermission(
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
      },
    }));
  }

  async isProductNameExist(
    name?: string,
    excludeId?: number,
  ): Promise<boolean> {
    return !!(await prisma.product.findFirst({
      where: { name, id: { not: excludeId } },
    }));
  }

  async isSKUExist(sku?: string, excludeId?: number): Promise<boolean> {
    return !!(await prisma.product.findFirst({
      where: { sku, id: { not: excludeId } },
    }));
  }
}

export const productRepository = new ProductRepository();
