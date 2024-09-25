import CommonPaginatedResultInterface from '@/interfaces/CommonPaginatedResultInterface';
import CommonResultInterface from '@/interfaces/CommonResultInterface';
import prisma from '@/prisma';
import paginate, { numberization } from '@/utils/paginate';
import productWhereInput, { productAdminWhereInput } from '@/utils/products/productWhereInput';
import slugify from '@/utils/slugify';
import { Product } from '@prisma/client';
import tokenValidation from '@/utils/tokenValidation';
import { userRepository } from './user.repository';
import { UpdateProductInputInterface } from '@/interfaces/ProductInterface';
import getCityByGeoIndo from '@/utils/getCityByGeoIndo';
import searchFriendlyForLikeQuery from '@/utils/searchFriendlyForLikeQuery';

class ProductRepository {
  async publicProductList({
    category,
    search,
    order = 'asc',
    orderField = 'product_name',
    limitNumber = 20,
    pageNumber = 1,
    token,
    latitude = null,
    longitude = null,
  }: {
    category?: string;
    search?: string;
    order?: 'asc' | 'desc';
    orderField?: 'product_name' | 'category';
    pageNumber?: number;
    limitNumber?: number;
    latitude?: number | null | string;
    longitude?: number | null | string;
    token?: string;
  }): Promise<CommonPaginatedResultInterface<Product[]>> {
    let result = {
      ok: false,
      data: {
        data: null,
        pagination: null,
      },
    } as unknown as CommonPaginatedResultInterface<Product[]>;
  
    const tokenRes = tokenValidation(token).data!;
    let theCityName: string | null = null;
  
    if (latitude && longitude) {
      // If latitude and longitude are provided, get the city name
      const cityName = await getCityByGeoIndo(latitude, longitude);
      console.log('City name:', cityName);
      theCityName = cityName;
  
      if (theCityName) {
        // Clean the city name to remove "Kabupaten/kabupaten/Kota/kota"
        theCityName = theCityName.replace(/(Kabupaten|kabupaten|Kota|kota)/gi, '').trim();
      }
    } else {
      // Default to Jakarta Pusat if no latitude/longitude
      theCityName = 'Jakarta Pusat';
    }
  
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
          StoreHasProduct: {
            where: {
              store: {
                city: {
                  city_name: {
                    contains: await searchFriendlyForLikeQuery(theCityName!),
                  },
                },
              },
            },
            include: {
              store: {
                include: {
                  city: true,
                },
              },
            },
          },
        },
        orderBy: !order
          ? undefined
          : [
              {
                name: orderField === 'product_name' ? order : undefined,
              },
              {
                product_category: {
                  name: orderField === 'category' ? order : undefined,
                },
              },
              {
                product_category: {
                  display_name: orderField === 'category' ? order : undefined,
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
    latitude = null,
    longitude = null,
  }: {
    slug: string;
    token?: string;
    citiId?: number;
    latitude?: number | null | string;
    longitude?: number | null | string;
  }): Promise<CommonResultInterface<Product>> {
    const result: CommonResultInterface<Product> = {
      ok: false,
    };
  
    const tokenRes = tokenValidation(token).data!;
    let theCityName: string | null = null;
  
    if (tokenRes) {
      if (latitude && longitude) {
        // If latitude and longitude are provided, get the city name
        const cityName = await getCityByGeoIndo(latitude, longitude);
        console.log('City name:', cityName);
  
        if (cityName) {
          // Clean the city name to remove "Kabupaten/kabupaten/Kota/kota"
          theCityName = cityName.replace(/(Kabupaten|kabupaten|Kota|kota)/gi, '').trim();
  
          const cityFromDB = await prisma.city.findFirst({ where: { city_name: theCityName } });
          console.log('City from DB:', cityFromDB);
  
          if (cityFromDB) {
            citiId = cityFromDB.id; // Use the city ID from the database
          } else {
            citiId = undefined; // If city not found in DB, set to undefined
          }
        }
      } else {
        // Default to Jakarta Pusat if no latitude/longitude
        citiId = 152; // Jakarta Pusat
      }
    }
  
    try {
      const res = await prisma.product.findFirst({
        where: {
          slug: slug,
        },
        include: {
          product_category: true,
          StoreHasProduct: citiId ? {
            where: {
              store: {
                city_id: citiId,
                store_type: !latitude && !longitude && tokenRes ? 'central' : undefined,
              },
            },
            include: {
              store: {
                include: {
                  city: true,
                },
              },
            },
          } : false,
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
      userLoggedIn.data?.role[0].role?.roles_permissions.filter(
        (e) =>
          e.permission.name == 'super' ||
          userLoggedIn.data?.role[0].role?.name == 'super_admin',
      )[0].permission.name == 'super';

    const isAdmin =
      userLoggedIn.data?.role[0].role?.roles_permissions.filter(
        (e) => e.permission.name == 'admin_access',
      )[0].permission.name == 'admin_access';
      console.log('product repooo');
      
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
      const [newData] = await prisma.$transaction([
        prisma.product.create({
          data: {
            ...product,
          },
          include: {
            product_category: true,
          },
        })
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
      const [updatedData] = await prisma.$transaction([
        prisma.product.update({
          data: {
            ...product,
          },
          where: {
            id: product_id,
            deletedAt:null
          },
        })
      ])
      if (!updatedData) {
        throw new Error('404 not found');
      }
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
      const [deleted] = await prisma.$transaction([prisma.product.delete({ where: { id: productId, deletedAt:null } })]);
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
        deletedAt:null
      },
    }));
  }

  async isProductNameExist(
    name?: string,
    excludeId?: number,
  ): Promise<boolean> {
    return !!(await prisma.product.findFirst({
      where: { name, id: { not: excludeId },deletedAt:null },
    }));
  }

  async isSKUExist(sku?: string, excludeId?: number): Promise<boolean> {
    return !!(await prisma.product.findFirst({
      where: { sku, id: { not: excludeId },deletedAt:null },
    }));
  }

  async getAdminProductList({
    search,
    order = 'asc',
    orderField = 'product_name',
    limitNumber = 20,
    pageNumber = 1,
    adminId
  }: {
    search?: string;
    order?: 'asc' | 'desc';
    orderField?: 'product_name' | 'category';
    pageNumber?: number;
    limitNumber?: number;
    adminId?:number|null
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
}

export const productRepository = new ProductRepository();
