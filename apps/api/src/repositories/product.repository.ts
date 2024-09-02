import CommonResultInterface from '@/interfaces/CommonResultInterface';
import prisma from '@/prisma';
import searchFriendlyForLikeQuery from '@/utils/searchFriendlyForLikeQuery';
import { Product } from '@prisma/client';

class ProductRepository {
  async publicProductList({
    category,
    search,
    order = 'asc',
    orderField = 'product_name',
  }: {
    category?: string;
    search?: string;
    order?: 'asc' | 'desc';
    orderField?: 'product_name' | 'category';
  }): Promise<CommonResultInterface<Product[]>> {
    const searchable = await searchFriendlyForLikeQuery(search);
    const searchableCategory = await searchFriendlyForLikeQuery(category);
    const result: CommonResultInterface<Product[]> = {
      ok: false,
    };
    try {
      const res = await prisma.product.findMany({
        where: {
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
        },
        include: {
          product_category: true,
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
      result.data = res
      result.ok = true
      result.message = 'Query Success'
    } catch (error) {
      result.error = error
      result.message = 'Error'
    }
    return result;
  }
  async getSingleProduct ({slug}:{slug:string}) : Promise<CommonResultInterface<Product>> {
    const result: CommonResultInterface<Product> = {
      ok: false,
    };
    try {
      const res = await prisma.product.findFirstOrThrow({
        where : {
          slug : slug
        }, include: {
          product_category: true,
        },
      })
      result.data = res
      result.ok = true
      result.message = 'Query Success'
    } catch (error) {
      result.error = error
      result.message = 'Error'
    }
    return result
  }
  
}

export const productRepository = new ProductRepository();
