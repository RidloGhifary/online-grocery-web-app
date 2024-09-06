import CommonPaginatedResultInterface from '@/interfaces/CommonPaginatedResultInterface';
import CommonResultInterface from '@/interfaces/CommonResultInterface';
import prisma from '@/prisma';
import paginate, { numberization } from '@/utils/paginate';
import searchFriendlyForLikeQuery from '@/utils/searchFriendlyForLikeQuery';
import slugify from '@/utils/slugify';
import { Product } from '@prisma/client';

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
    const searchable = await searchFriendlyForLikeQuery(search);
    const searchableCategory = await searchFriendlyForLikeQuery(category);
    let result = {
      ok: false,
      data :{
        data : null,
        pagination : null
      }
    } as unknown as CommonPaginatedResultInterface<Product[]> 
    try {
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
      };
      const count = await prisma.product.count({
        where: { ...whereQuery },
      });
      console.log('count : ', count);
      
      const safePageNumber = numberization(pageNumber);
      const safeLimitNumber = numberization(limitNumber);
      const res = await prisma.product.findMany({
        where: { ...whereQuery },
        skip : (safePageNumber - 1 ) * safeLimitNumber,
        take: safeLimitNumber , 
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
      
      if (count <= 0 ) {
        throw new Error("Not found 404");
      } 

      result.data.data = res;
      
      result.data.pagination = paginate({
        pageNumber : safePageNumber,
        limitNumber : safeLimitNumber,
        totalData : count
      })

      
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
