import CommonResultInterface from '@/interfaces/CommonResultInterface';
import { UpdateProductInputInterface } from '@/interfaces/ProductInterface';
import prisma from '@/prisma';
import { productRepository } from '@/repositories/product.repository';
import getCityFromCoordinates from '@/utils/getCityFromCoordinates';
// import { Prisma, Product } from '@prisma/client';
import type { ProductDiscount, Product } from '@prisma/client';
import { Request, Response } from 'express';

interface ProductWithDiscounts extends Product {
  product_discounts: ProductDiscount[];
}

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
          },
        },
        include: {
          product_discounts: true,
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
      const { latitude, longitude } = req.query;

      // const products = await prisma.product.findMany({
      //   where: {
      //     product_discounts: {
      //       some: {
      //         started_at: {
      //           lte: now,
      //         },
      //         end_at: {
      //           gte: now,
      //         },
      //       },
      //     },
      //     StoreHasProduct: {
      //       some: {
      //         qty: {
      //           gt: 0,
      //         },
      //       },
      //     },
      //   },
      //   include: {
      //     product_discounts: {
      //       where: {
      //         started_at: {
      //           lte: now,
      //         },
      //         end_at: {
      //           gte: now,
      //         },
      //       },
      //     },
      //     StoreHasProduct: {
      //       include: {
      //         store: {
      //           include: {
      //             city: true,
      //             province: true,
      //           },
      //         },
      //       },
      //     },
      //   },
      // });

      const results = await productRepository.publicProductList({
        latitude: latitude as string,
        longitude: longitude as string,
      });

      const products =
        results?.data?.data &&
        results?.data?.data.filter((product: any) => {
          const now = new Date();
          const discount = product.product_discounts.find(
            (discount: { started_at: Date; end_at: Date }) =>
              now >= discount.started_at && now <= discount.end_at,
          );
          return discount !== undefined;
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
      const { latitude, longitude, page = '1', limit = '20' } = req.query;

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

      if (latitude && longitude) {
        const result = await productRepository.publicProductList({
          latitude: latitude as string,
          longitude: longitude as string,
        });

        products = result?.data?.data as Product[];

        // const userCity = await getCityFromCoordinates(
        //   userLatitude,
        //   userLongitude,
        // );

        // if (!userCity) {
        //   return res.status(404).json({
        //     ok: false,
        //     message: 'City not found for the given coordinates',
        //   });
        // }

        // products = await prisma.product.findMany({
        //   where: {
        //     StoreHasProduct: {
        //       some: {
        //         qty: {
        //           gt: 0,
        //         },
        //         store: {
        //           city: {
        //             city_name: userCity,
        //           },
        //         },
        //       },
        //     },
        //   },
        //   include: {
        //     product_discounts: true,
        //     product_category: true,
        //     StoreHasProduct: {
        //       include: {
        //         store: {
        //           include: {
        //             city: true,
        //             province: true,
        //           },
        //         },
        //       },
        //     },
        //   },
        //   skip: (pageNumber - 1) * limitNumber,
        //   take: limitNumber,
        // });
      } else {
        // No coordinates provided, get products from the central store
        // products = await prisma.product.findMany({
        //   where: {
        //     StoreHasProduct: {
        //       some: {
        //         qty: {
        //           gt: 0,
        //         },
        //         store: {
        //           store_type: 'central',
        //         },
        //       },
        //     },
        //   },
        //   include: {
        //     product_discounts: true,
        //     product_category: true,
        //     StoreHasProduct: {
        //       include: {
        //         store: {
        //           include: {
        //             city: true,
        //             province: true,
        //           },
        //         },
        //       },
        //     },
        //   },
        //   skip: (pageNumber - 1) * limitNumber,
        //   take: limitNumber,
        // });
        const result = await productRepository.publicProductList({});
        products = result?.data?.data as Product[];
      }

      const totalPages = Math.ceil(products.length / limitNumber);

      const pagination = {
        currentPage: pageNumber,
        totalPages,
        next: pageNumber < totalPages ? pageNumber + 1 : null,
        previous: pageNumber > 1 ? pageNumber - 1 : null,
      };

      res.status(200).json({
        ok: true,
        message: 'Successfully retrieved products based on your location.',
        data: products,
        pagination,
      });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }
  //
  async productList(req: Request, res: Response) {
    const { category, search, order, order_field } = req.query;
    const { page = 1, limit = 20 } = req.query;
    const { latitude, longitude } = req.query;
    const token = req.headers['authorization'];
    const result = await productRepository.publicProductList({
      category: category as string,
      search: search as string,
      order: order as 'asc' | 'desc',
      orderField: order_field as 'product_name' | 'category',
      pageNumber: page as number,
      limitNumber: limit as number,
      latitude: latitude as string,
      longitude: longitude as string,
      token,
    });
    if (!result.ok) {
      return res.status(400).send(result);
    }
    return res.status(200).send(result);
  }

  public async productSingle(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const { slug } = req.params;
    const { latitude, longitude } = req.query;
    const token = req.headers['authorization'];
    if (!slug || slug === '') {
      const response: CommonResultInterface<null> = {
        ok: false,
        error: 'Empty slug',
      };
      return res.status(401).send(response);
    }

    const result = await productRepository.getSingleProduct({
      slug: slug as string,
      latitude: latitude as string,
      longitude: longitude as string,
      token,
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
    // console.log(product);

    const newData = await productRepository.createProduct(product);
    if (!newData.ok) {
      return res.status(400).send(newData);
    }
    return res.status(201).send(newData);
  }

  public async updateProduct(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const product: UpdateProductInputInterface = req.body;
    // console.log(product);

    const updatedData = await productRepository.updateProduct(product);
    if (!updatedData.ok) {
      return res.status(400).send(updatedData);
    }
    return res.status(201).send(updatedData);
  }
  public async deleteProduct(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const { id } = req.params;
    const deletedProduct = await productRepository.deleteProduct(Number(id));
    if (!deletedProduct.ok) {
      return res.status(500).send(deletedProduct);
    }
    return res.status(201).send(deletedProduct);
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
      {
        // field product,
        // StoreHasProduct : {
        // }
        //
      }
      const product = await prisma.product.findUnique({
        where: { id: productId },
        // select: {
        //   id: true,
        //   sku: true,
        //   name: true,
        //   description: true,
        //   // current_stock: true,
        //   unit: true,
        //   price: true,
        //   image: true,
        // },
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
