import { Response, Request } from 'express';
import prisma from '@/prisma';

export class ProductController {
  getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await prisma.product.findMany({
        select: {
          id: true,
          sku: true,
          name: true,
          description: true,
          current_stock: true,
          unit: true,
          price: true,
          image: true,
          store_id: true,
        },
      });
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
  };

  getProductById = async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          sku: true,
          name: true,
          description: true,
          current_stock: true,
          unit: true,
          price: true,
          image: true,
          store_id: true,
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
