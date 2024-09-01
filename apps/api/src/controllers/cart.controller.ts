import { Response, Request } from 'express';
import prisma from '@/prisma';
import {
  addItemSchema,
  updateQuantitySchema,
  removeItemSchema,
  selectForCheckoutSchema,
} from '@/validations/cart';

export interface CustomRequest extends Request {
  currentUser?: {
    id: number;
    email: string;
  };
}

export class CartController {
  getCartItems = async (req: CustomRequest, res: Response) => {
    const user = req.currentUser;
    if (!user) {
      return res.status(401).json({ error: 'Pengguna tidak terauthentikasi' });
    }
    const userId = user.id;
    try {
      const cartItems = await prisma.cart.findMany({
        where: { user_id: userId },
        include: {
          product: {
            select: {
              name: true,
              price: true,
              image: true,
              description: true,
            },
          },
        },
      });
      return res.json(cartItems);
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Terjadi error saat mengambil item dari keranjang' });
    }
  };

  addItem = async (req: CustomRequest, res: Response) => {
    const user = req.currentUser;
    if (!user) {
      return res.status(401).json({ error: 'Pengguna tidak terauthentikasi' });
    }

    const validationResult = addItemSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    const { productId, quantity, storeId } = validationResult.data;
    const userId = user.id;

    try {
      const result = await prisma.$transaction(async (prisma) => {
        const product = await prisma.product.findUnique({
          where: { id: productId },
        });

        if (!product) {
          throw new Error('Produk tidak ditemukan');
        }

        if (product.current_stock === 0) {
          throw new Error(
            'Produk saat ini habis, tidak bisa ditambahkan ke keranjang',
          );
        }

        const existingCart = await prisma.cart.findFirst({
          where: {
            user_id: userId,
            product_id: productId,
          },
        });

        const additionalQuantityNeeded = quantity;

        if (existingCart) {
          if (additionalQuantityNeeded > product.current_stock) {
            throw new Error(
              `Jumlah stok produk yang tersedia hanya ${product.current_stock}, tidak bisa menambahkan lebih banyak.`,
            );
          }

          const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
              current_stock: product.current_stock - additionalQuantityNeeded,
            },
          });

          const updatedCart = await prisma.cart.update({
            where: { id: existingCart.id },
            data: { qty: existingCart.qty + additionalQuantityNeeded },
          });

          return updatedCart;
        } else {
          if (quantity > product.current_stock) {
            throw new Error(
              `Jumlah stok produk yang tersedia hanya ${product.current_stock}, tidak bisa menambahkan lebih banyak.`,
            );
          }

          const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: { current_stock: product.current_stock - quantity },
          });

          const newCartItem = await prisma.cart.create({
            data: {
              product_id: productId,
              qty: quantity,
              user_id: userId,
              store_id: storeId,
            },
          });

          return newCartItem;
        }
      });

      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({
        error:
          error.message ||
          'Terjadi error saat menambahkan item ke dalam keranjang',
      });
    }
  };

  updateQuantity = async (req: CustomRequest, res: Response) => {
    const user = req.currentUser;
    if (!user) {
      return res.status(401).json({ error: 'Pengguna tidak terauthentikasi' });
    }

    const productId = parseInt(req.params.productId, 10);
    if (isNaN(productId) || productId < 1) {
      return res.status(400).json({ error: 'Invalid productId in URL' });
    }

    const validationResult = updateQuantitySchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    const { quantity } = validationResult.data;
    const userId = user.id;

    try {
      const result = await prisma.$transaction(async (prisma) => {
        const cartItem = await prisma.cart.findFirst({
          where: {
            user_id: userId,
            product_id: productId,
          },
        });

        if (!cartItem) {
          throw new Error('Item tidak ditemukan dalam keranjang');
        }

        const product = await prisma.product.findUnique({
          where: { id: productId },
        });

        if (!product) {
          throw new Error('Produk tidak ditemukan');
        }

        const stockAdjustment = quantity - cartItem.qty;

        if (product.current_stock < stockAdjustment) {
          throw new Error('Stok produk tidak mencukupi untuk perubahan ini');
        }

        await prisma.product.update({
          where: { id: productId },
          data: { current_stock: { decrement: stockAdjustment } },
        });

        const updatedCart = await prisma.cart.update({
          where: { id: cartItem.id },
          data: { qty: quantity },
        });

        return updatedCart;
      });

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        error: 'Terjadi error saat memperbarui jumlah item dalam keranjang',
      });
    }
  };

  // CartController.ts
  removeItem = async (req: CustomRequest, res: Response) => {
    const user = req.currentUser;
    if (!user) {
      return res.status(401).json({ error: 'Pengguna tidak terauthentikasi' });
    }

    const productId = parseInt(req.params.productId, 10);
    if (isNaN(productId) || productId < 1) {
      return res.status(400).json({ error: 'Invalid productId in URL' });
    }

    try {
      await prisma.$transaction(async (prisma) => {
        const cartItem = await prisma.cart.findFirst({
          where: {
            user_id: user.id,
            product_id: productId,
          },
        });

        if (!cartItem) {
          throw new Error('Item tidak ditemukan dalam keranjang');
        }

        await prisma.product.update({
          where: { id: productId },
          data: { current_stock: { increment: cartItem.qty } },
        });

        await prisma.cart.delete({
          where: { id: cartItem.id },
        });
      });

      return res.json({ message: 'Item berhasil dihapus dari keranjang' });
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Terjadi error saat menghapus item dari keranjang' });
    }
  };

  selectForCheckout = async (req: CustomRequest, res: Response) => {
    const user = req.currentUser;
    if (!user) {
      return res.status(401).json({ error: 'Pengguna tidak terauthentikasi' });
    }

    const validationResult = selectForCheckoutSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    const { productIds } = validationResult.data;
    const userId = user.id;

    try {
      const cartItems = await prisma.cart.findMany({
        where: {
          user_id: userId,
          product_id: {
            in: productIds,
          },
        },
      });

      if (cartItems.length === 0) {
        return res
          .status(404)
          .json({ error: 'Tidak ada item yang dipilih untuk checkout' });
      }

      return res.json(cartItems);
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Terjadi error saat memilih item untuk checkout' });
    }
  };
}
