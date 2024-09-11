import { Response, Request } from 'express';
import prisma from '@/prisma';
import {
  addItemSchema,
  updateQuantitySchema,
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
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = user.id;
    const {
      page = 1,
      pageSize = 8,
      sort = 'name',
      order = 'asc',
      search = '',
    } = req.query;

    try {
      const offset = (Number(page) - 1) * Number(pageSize);
      const limit = Number(pageSize);

      const cartItems = await prisma.cart.findMany({
        where: {
          user_id: userId,
          product: {
            name: {
              contains: search.toString(),
            },
          },
        },
        select: {
          id: true,
          product_id: true,
          qty: true,
          user_id: true,
          store_id: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          product: {
            select: {
              name: true,
              price: true,
              image: true,
              description: true,
            },
          },
        },
        skip: offset,
        take: limit,
      });

      const formattedCartItems = cartItems.map((item) => ({
        ...item,
        totalPrice: item.qty * item.product.price,
      }));

      if (sort === 'price') {
        formattedCartItems.sort((a, b) => {
          const priceA = a.totalPrice;
          const priceB = b.totalPrice;
          return order === 'asc' ? priceA - priceB : priceB - priceA;
        });
      } else if (sort === 'name') {
        formattedCartItems.sort((a, b) => {
          const nameA = a.product.name.toLowerCase();
          const nameB = b.product.name.toLowerCase();
          return order === 'asc'
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        });
      }

      const totalItems = await prisma.cart.count({
        where: {
          user_id: userId,
          product: {
            name: {
              contains: search.toString(),
            },
          },
        },
      });

      return res.json({
        data: formattedCartItems,
        totalItems,
        totalPages: Math.ceil(totalItems / Number(pageSize)),
        currentPage: Number(page),
      });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return res
        .status(500)
        .json({ error: 'There is an error fetching items from cart' });
    }
  };

  addItem = async (req: CustomRequest, res: Response) => {
    const user = req.currentUser;
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const validationResult = addItemSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    const { productId, quantity, storeId } = validationResult.data;
    const userId = user.id;

    try {
      const result = await prisma.$transaction(async (prisma) => {
        const currentUserAddress = await prisma.user.findFirst({
          where:{
            id: userId
          },
          include: {
            addresses: {
              where: {
                is_primary: true,
              },
            },
          },
        });
        console.log(currentUserAddress);
        
        const product = await prisma.product.findUnique({
          where: { id: productId },
          include: {
            StoreHasProduct: {
              where: {
                store: {
                  city_id: currentUserAddress?.addresses[0].city_id,
                },
              },
              // include:{
              //   store : true
              // }
            },
          },
        });
        console.log(product);
        
        if (!product) {
          throw new Error('Product not found');
        }

        const totalStockAcrossStores = await prisma.storeHasProduct.aggregate({
          _sum: { qty: true },
          where: { product_id: productId },
        });

        const totalStock = totalStockAcrossStores._sum.qty || 0;

        if (totalStock === 0) {
          throw new Error('Product ran out of stock across all stores');
        }

        if (quantity > totalStock) {
          throw new Error(
            `Remaining stock across all stores is ${totalStock}, cannot add more.`,
          );
        }

        const existingCart = await prisma.cart.findFirst({
          where: {
            user_id: userId,
            product_id: productId,
          },
        });

        if (existingCart) {
          const additionalQuantityNeeded = quantity;

          if (additionalQuantityNeeded > totalStock) {
            throw new Error(
              `Remaining stock across all stores is ${totalStock}, cannot add more.`,
            );
          }

          const updatedCart = await prisma.cart.update({
            where: { id: existingCart.id },
            data: { qty: existingCart.qty + additionalQuantityNeeded },
          });

          return updatedCart;
        } else {
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
        error: error.message || 'Error occurs when adding item to cart',
      });
    }
  };

  updateQuantity = async (req: CustomRequest, res: Response) => {
    const user = req.currentUser;
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
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
          throw new Error('Item not found in the cart');
        }

        const product = await prisma.product.findUnique({
          where: { id: productId },
        });

        if (!product) {
          throw new Error('Product not found');
        }

        const totalStockAcrossStores = await prisma.storeHasProduct.aggregate({
          _sum: { qty: true },
          where: { product_id: productId },
        });

        const totalStock = totalStockAcrossStores._sum.qty || 0;
        const stockAdjustment = quantity - cartItem.qty;

        if (stockAdjustment > totalStock) {
          throw new Error(
            'Current stock across all stores cannot fulfill the request',
          );
        }

        const updatedCart = await prisma.cart.update({
          where: { id: cartItem.id },
          data: { qty: quantity },
        });

        return updatedCart;
      });

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        error: 'There is an error updating items into cart',
      });
    }
  };

  removeItem = async (req: CustomRequest, res: Response) => {
    const user = req.currentUser;
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
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
          throw new Error('Item not found in cart');
        }

        await prisma.cart.delete({
          where: { id: cartItem.id },
        });
      });

      return res.json({ message: 'Successfully removed item from cart' });
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'There was an error removing item from cart' });
    }
  };

  selectForCheckout = async (req: CustomRequest, res: Response) => {
    const user = req.currentUser;
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const validationResult = selectForCheckoutSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    const { productIds, quantities } = validationResult.data;
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
        return res.status(404).json({ error: 'No chosen items for checkout' });
      }

      for (let i = 0; i < productIds.length; i++) {
        const productId = productIds[i];
        const quantity = quantities[i];

        await prisma.cart.updateMany({
          where: {
            user_id: userId,
            product_id: productId,
          },
          data: {
            qty: quantity,
          },
        });
      }

      return res.json(cartItems);
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Error occurred when selecting items for checkout' });
    }
  };
}
