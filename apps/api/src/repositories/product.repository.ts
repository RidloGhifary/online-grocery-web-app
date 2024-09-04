import CommonResultInterface from '@/interfaces/CommonResultInterface';
import prisma from '@/prisma';
import searchFriendlyForLikeQuery from '@/utils/searchFriendlyForLikeQuery';
import slugify from '@/utils/slugify';
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
      result.data = res;
      result.ok = true;
      result.message = 'Query Success';
    } catch (error) {
      result.error = error;
      result.message = 'Error';
    }
    return result;
  }
  async getSingleProduct({
    slug,
  }: {
    slug: string;
  }): Promise<CommonResultInterface<Product>> {
    const result: CommonResultInterface<Product> = {
      ok: false,
    };
    try {
      const res = await prisma.product.findFirst({
        where: {
          slug: slug,
        },
        include: {
          product_category: true,
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
}

export const productRepository = new ProductRepository();
