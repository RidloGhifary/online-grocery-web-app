import CommonResultInterface from '@/interfaces/CommonResultInterface';
import prisma from '@/prisma';
import { productRepository } from '@/repositories/product.repository';
import calculateDistance from '@/utils/calculateDistance';
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
          current_stock: {
            gt: 0,
          },
        },
        include: {
          product_discounts: true,
          store: {
            include: {
              city: true,
              province: true,
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
          current_stock: {
            gt: 0,
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
          store: {
            include: {
              city: true,
              province: true,
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

  async getProductByClosestDistance(req: Request, res: Response) {
    try {
      const { latitude, longitude } = req.query;

      if (!latitude || !longitude) {
        return res
          .status(400)
          .json({ ok: false, message: 'Latitude and longitude are required' });
      }

      // Convert query parameters to numbers
      const userLatitude = parseFloat(latitude as string);
      const userLongitude = parseFloat(longitude as string);

      const products = await prisma.product.findMany({
        where: {
          current_stock: {
            gt: 0,
          },
        },
        include: {
          product_discounts: true,
          store: {
            include: {
              city: true,
              province: true,
            },
          },
        },
      });

      const productsWithDistance = products.map((product) => {
        if (product.store) {
          const distance = calculateDistance(
            userLatitude,
            userLongitude,
            product.store.latitude.toNumber() || 0,
            product.store.longtitude.toNumber() || 0,
          );
          return { ...product, distance };
        }
        return product;
      });

      // Sort by distance
      productsWithDistance.sort(
        (a: any, b: any) => (a.distance || 0) - (b.distance || 0),
      );

      // Limit products to 60
      const limitedProducts = productsWithDistance.slice(0, 60);

      res.status(200).json({
        ok: true,
        message:
          'Successfully retrieved products sorted by distance from your location.',
        data: limitedProducts,
      });
    } catch {
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }
  async productList(req: Request, res: Response) {
    const { category, search, order, order_field } = req.query;
    const result = await productRepository.publicProductList({
      category: category as string,
      search: search as string,
      order: order as 'asc' | 'desc',
      orderField: order_field as 'product_name' | 'category',
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
    const {slug} = req.params
    if (!slug) {
      const response : CommonResultInterface<null> = {
        ok : false,
        error : 'Empty slug'
      }
      return res.status(401).send(response)
    }
    const result = await productRepository.getSingleProduct({slug : slug as string})
    if (!result.ok) {
      if (!result.data) {
        return res.status(404).send(result)
      }
      return res.status(500).send(result)
    }
    return res.status(200).send(result)
  }
}
