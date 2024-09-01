import prisma from '@/prisma';
import calculateDistance from '@/utils/calculateDistance';
import { Request, Response } from 'express';
import redisClient from '@/redis';

export class ProductController {
  async getAllProducts(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20 } = req.query;

      const dataFromRedis = await redisClient.get('allProducts');
      if (dataFromRedis) {
        return res.status(200).json({
          ok: true,
          message: 'Success get products',
          data: JSON.parse(dataFromRedis),
        });
      }

      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      const totalProducts = await prisma.product.count();

      const totalPages = Math.ceil(totalProducts / limitNumber);

      const products = await prisma.product.findMany({
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        include: {
          product_discounts: true,
          store: true,
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

      await redisClient.set('allProducts', JSON.stringify(formattedResponse));
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
      const dataFromRedis = await redisClient.get('discountProducts');
      if (dataFromRedis) {
        return res.status(200).json({
          ok: true,
          message: 'Success get discount product',
          data: JSON.parse(dataFromRedis),
        });
      }

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
          store: true,
        },
      });

      await redisClient.set('discountProducts', JSON.stringify(products));
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
      const dataFromRedis = await redisClient.get('productsByClosestDistance');
      if (dataFromRedis) {
        return res.status(200).json({
          ok: true,
          message: 'Success get products by closest distance',
          data: JSON.parse(dataFromRedis),
        });
      }

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
        include: {
          store: true,
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

      await redisClient.set(
        'productsByClosestDistance',
        JSON.stringify(productsWithDistance),
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
