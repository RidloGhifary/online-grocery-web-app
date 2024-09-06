import CommonResultInterface from '@/interfaces/CommonResultInterface';
import searchFriendlyForLikeQuery from '@/utils/searchFriendlyForLikeQuery';
import prisma from '@/prisma';
import { productRepository } from '@/repositories/product.repository';
import getCityFromCoordinates from '@/utils/getCityFromCoordinates';
import { Product } from '@prisma/client';
import { Request, Response } from 'express';

export class ProductController {
  async getAllProducts(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20 } = req.query;

      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      const totalProducts = await prisma.product.count();

      const totalPages = Math.ceil(totalProducts / limitNumber);

      const products = await prisma.product.findMany({
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        where: {
          StoreHasProduct: {
            some: {
              qty: {
                gt: 0,
              },
            },
          StoreHasProduct: {
            some: {
              qty: {
                gt: 0,
              },
            },
          },
        },
        include: {
          product_discounts: true,
          // store: {
          //   include: {
          //     city: true,
          //     province: true,
          //   },
          // },
          StoreHasProduct: {
            include: {
              store: {
                include: {
                  city: true,
                  province: true,
                },
              },
            },
          },
        },
      });

      const pagination = {
        current_page: pageNumber,
        next: pageNumber < totalPages ? pageNumber + 1 : null,
        back: pageNumber > 1 ? pageNumber - 1 : null,
        total_page: totalPages,
      };

      const formattedResponse = {
        products,
        pagination,
      };

      res.status(200).json({
        ok: true,
        message: 'Success get products',
        data: formattedResponse,
      });
    } catch {
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }

  async getDiscountProduct(req: Request, res: Response) {
    try {
      const now = new Date();

      const products = await prisma.product.findMany({
        where: {
          product_discounts: {
            some: {
              started_at: {
                lte: now,
              },
              end_at: {
                gte: now,
              },
            },
          },
          StoreHasProduct: {
            some: {
              qty: {
                gt: 0,
              },
            },
          StoreHasProduct: {
            some: {
              qty: {
                gt: 0,
              },
            },
          },
        },
        include: {
          product_discounts: {
            where: {
              started_at: {
                lte: now,
              },
              end_at: {
                gte: now,
              },
            },
          },
          StoreHasProduct: {
            include: {
              store: {
                include: {
                  city: true,
                  province: true,
                },
              },
          StoreHasProduct: {
            include: {
              store: {
                include: {
                  city: true,
                  province: true,
                },
              },
            },
          },
        },
      });

      res.status(200).json({
        ok: true,
        message: 'Success get discount product',
        data: products,
      });
    } catch {
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }

  getTotalStockAcrossStores = async (req: Request, res: Response) => {
    const productId = parseInt(req.params.productId, 10);
    if (isNaN(productId) || productId < 1) {
      return res.status(400).json({ error: 'Invalid productId in URL' });
    }

    try {
      // Fetch total stock across all stores for the given product
      const totalStockAcrossStores = await prisma.storeHasProduct.aggregate({
        _sum: { qty: true },
        where: { product_id: productId },
      });

      // Return the total stock
      const totalStock = totalStockAcrossStores._sum.qty || 0;
      return res.json({ totalStock });
    } catch (error) {
      console.error('Error fetching total stock:', error);
      return res.status(500).json({ error: 'Error fetching total stock' });
    }
  };

  async getProductByLocation(req: Request, res: Response) {
    try {
      const { latitude, longitude, page = '1', limit = '10' } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      if (
        isNaN(pageNumber) ||
        isNaN(limitNumber) ||
        pageNumber < 1 ||
        limitNumber < 1
      ) {
        return res
          .status(400)
          .json({ ok: false, message: 'Invalid page or limit' });
      }

      let products: Product[];
      let products: Product[];

      if (latitude && longitude) {
        const userLatitude = parseFloat(latitude as string);
        const userLongitude = parseFloat(longitude as string);

        if (isNaN(userLatitude) || isNaN(userLongitude)) {
          return res
            .status(400)
            .json({ ok: false, message: 'Invalid latitude or longitude' });
        }

        const userCity = await getCityFromCoordinates(
          userLatitude,
          userLongitude,
        );

        if (!userCity) {
          return res.status(404).json({
            ok: false,
            message: 'City not found for the given coordinates',
          });
        }

        const getProducts = await prisma.product.findMany({
          where: {
            // current_stock: { gt: 0 },

            // store: {
            //   city: {
            //     city_name: userCity,
            //   },
            // },
            StoreHasProduct: {
              some: {
                qty: {
                  gt: 0,
                },
                store: {
                  city: {
                    city_name: userCity,
                  },
                },
              },
            },
          },
          include: {
            product_discounts: true,
            // store: {
            //   include: { city: true, province: true },
            // },
            StoreHasProduct: {
              include: {
                store: {
                  include: {
                    city: true,
                  },
                },
              },
            },
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        });

        products = getProducts.map((product) => {
          return {
            ...product,
            StoreHasProduct: product.StoreHasProduct.filter(
              (store) => store.store?.city.city_name === userCity,
            ),
          };
        });
      } else {
        // No coordinates provided, get products from the central store
        products = await prisma.product.findMany({
          where: {
            // current_stock: { gt: 0 },
            // store: {
            //   store_type: 'central',
            // },
            StoreHasProduct: {
              some: {
                qty: {
                  gt: 0,
                },
                store: {
                  store_type: 'central',
                },
              },
            },
          },
          include: {
            product_discounts: true,
            // store: {
            //   include: { city: true, province: true },
            // },
            StoreHasProduct: {
              select: {
                qty: true,
                // store :
              },
            },
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        });
      }

      if (products.length === 0) {
        return res
          .status(404)
          .json({ ok: false, message: 'No products found' });
      }

      res.status(200).json({
        ok: true,
        message: 'Successfully retrieved products based on your location.',
        data: products,
      });
    } catch (error) {
      console.error('Error retrieving products:', error);
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }
  //

  async productList({
    category,
    search,
    order = 'asc',
    orderField = 'product_name',
    pageNumber = 1,
    limitNumber = 20, // Set default limit
  }: {
    category?: string;
    search?: string;
    order?: 'asc' | 'desc';
    orderField?: 'product_name' | 'category';
    pageNumber?: number; // Add pageNumber to the type definition
    limitNumber?: number; // Add limitNumber to the type definition
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
        skip: (pageNumber - 1) * limitNumber, // Skip the rows for pagination
        take: limitNumber, // Take the number of rows specified by limitNumber
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

  public async productSingle(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const { slug } = req.params;

    if (!slug || slug === '') {
      const response: CommonResultInterface<null> = {
        ok: false,
        error: 'Empty slug',
      };
      return res.status(401).send(response);
    }
    const result = await productRepository.getSingleProduct({
      slug: slug as string,
    });
    if (!result.ok) {
      if (!result.data) {
        return res.status(404).send(result);
      }
      return res.status(500).send(result);
    }
    return res.status(200).send(result);
  }
  public async createProduct(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const product: Product = req.body;
    const newData = await productRepository.createProduct(product);
    if (!newData.ok) {
      return res.status(400).send(newData);
    }
    return res.status(201).send(newData);
  }

  getProductById = async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    try {
      {
        // field product,
        // StoreHasProduct : {
        // }
        //
      }
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          StoreHasProduct: true,
        },
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.json(product);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch product' });
    }
  };
}
