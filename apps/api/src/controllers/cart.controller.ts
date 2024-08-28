import { Request, Response } from 'express';
import prisma from '@/prisma';

interface CustomRequest extends Request {
  user?: {
    id: number;
  };
}

export class CartController {
  addItem = async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Pengguna tidak terauthentikasi' });
    }

    const { productId, quantity, storeId } = req.body;
    const userId = req.user.id;

    try {
      const existingCart = await prisma.cart.findFirst({
        where: {
          user_id: userId,
          product_id: productId,
        },
      });

      if (existingCart) {
        const updatedCart = await prisma.cart.update({
          where: { id: existingCart.id },
          data: { qty: existingCart.qty + quantity },
        });
        return res.json(updatedCart);
      } else {
        const newCartItem = await prisma.cart.create({
          data: {
            product_id: productId,
            qty: quantity,
            user_id: userId,
            store_id: storeId,
          },
        });
        return res.json(newCartItem);
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Terjadi error saat menambahkan item kedalam keranjang',
      });
    }
  };

  updateQuantity = async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Pengguna tidak terauthentikasi' });
    }

    const { productId, quantity } = req.body;
    const userId = req.user.id;

    try {
      const cartItem = await prisma.cart.findFirst({
        where: {
          user_id: userId,
          product_id: productId,
        },
      });

      if (cartItem) {
        const updatedCart = await prisma.cart.update({
          where: { id: cartItem.id },
          data: { qty: quantity },
        });
        return res.json(updatedCart);
      } else {
        return res
          .status(404)
          .json({ error: 'Item tidak ditemukan dalam keranjang' });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Terjadi error saat memperbarui jumlah item dalam keranjang',
      });
    }
  };

  removeItem = async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Pengguna tidak terauthentikasi' });
    }

    const { productId } = req.body;
    const userId = req.user.id;

    try {
      const cartItem = await prisma.cart.findFirst({
        where: {
          user_id: userId,
          product_id: productId,
        },
      });

      if (cartItem) {
        await prisma.cart.delete({
          where: { id: cartItem.id },
        });
        return res.json({ message: 'Item berhasil dihapus dari keranjang' });
      } else {
        return res
          .status(404)
          .json({ error: 'Item tidak ditemukan dalam keranjang' });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Terjadi error saat menghapus item dari keranjang',
      });
    }
  };

  selectForCheckout = async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Pengguna tidak terauthentikasi' });
    }

    const { productIds } = req.body;
    const userId = req.user.id;

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
      return res.status(500).json({
        error: 'Terjadi error saat memilih item untuk checkout',
      });
    }
  };
}
