import prisma from '@/prisma';
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

      res.status(200).json({
        ok: true,
        message:
          'Successfully retrieved products sorted by distance from your location.',
        data: productsWithDistance,
      });
    } catch {
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }
}
