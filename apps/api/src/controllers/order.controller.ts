import { Response, Request } from 'express';
import prisma from '@/prisma';
import {
  createOrderSchema,
  getOrdersByUserSchema,
  getOrderByIdSchema,
} from '@/validations/order';

export interface CustomRequest extends Request {
  currentUser?: {
    id: number;
    email: string;
  };
}

export class OrderController {
  getOrdersByUser = async (req: CustomRequest, res: Response) => {
    const { userId } = req.params;

    try {
      const validation = getOrdersByUserSchema.safeParse({ userId });
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const currentUser = req.currentUser;
      if (!currentUser || Number(userId) !== currentUser.id) {
        return res.status(403).json({
          message: 'You do not have permission to view these orders',
        });
      }

      const orders = await prisma.order.findMany({
        where: { customer_id: Number(userId) },
        include: {
          store: {
            select: {
              name: true,
              address: true,
              city: { select: { city_name: true } },
            },
          },
          expedition: {
            select: { name: true },
          },
          address: {
            select: {
              address: true,
              kecamatan: true,
              kelurahan: true,
              city: { select: { city_name: true } },
            },
          },
          order_details: {
            include: {
              product: { select: { name: true } },
            },
          },
        },
      });

      const enhancedOrders = orders.map((order) => {
        const totalProductPrice = order.order_details.reduce((total, item) => {
          return total + item.price * item.qty;
        }, 0);

        const deliveryPrice =
          order.order_details[0].sub_total -
          order.order_details[0].price * order.order_details[0].qty;

        return {
          ...order,
          totalProductPrice,
          deliveryPrice,
        };
      });

      return res.status(200).json({ orders: enhancedOrders });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  getOrderById = async (req: CustomRequest, res: Response) => {
    const { orderId } = req.params;

    try {
      const validation = getOrderByIdSchema.safeParse({ orderId });
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const order = await prisma.order.findUnique({
        where: { id: Number(orderId) },
        include: {
          store: {
            select: {
              name: true,
              address: true,
              city: { select: { city_name: true } },
            },
          },
          expedition: {
            select: { name: true },
          },
          address: {
            select: {
              address: true,
              kecamatan: true,
              kelurahan: true,
              city: { select: { city_name: true } },
            },
          },
          order_details: {
            include: {
              product: { select: { name: true } },
            },
          },
        },
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const currentUser = req.currentUser;
      if (!currentUser || order.customer_id !== currentUser.id) {
        return res.status(403).json({
          message: 'You do not have permission to view this order',
        });
      }

      const totalProductPrice = order.order_details.reduce((total, item) => {
        return total + item.price * item.qty;
      }, 0);

      const deliveryPrice =
        order.order_details[0].sub_total -
        order.order_details[0].price * order.order_details[0].qty;

      return res.status(200).json({
        ...order,
        totalProductPrice,
        deliveryPrice,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  createOrder = async (req: CustomRequest, res: Response) => {
    try {
      const validation = createOrderSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const {
        userId,
        checkoutItems,
        selectedAddressId,
        storeId,
        selectedCourier,
        selectedCourierPrice,
      } = validation.data;

      const currentUser = req.currentUser;
      if (!currentUser) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const orderCount = await prisma.order.count();
      const invoice = `INV-${orderCount.toString().padStart(7, '0')}`;

      const storeAdmin = await prisma.storeHasAdmin.findFirst({
        where: { store_id: storeId },
        select: { assignee_id: true },
      });
      if (!storeAdmin) {
        return res.status(400).json({ error: 'No admin found for this store' });
      }

      const expedition = await prisma.expedition.findFirst({
        where: { name: selectedCourier },
        select: { id: true },
      });
      if (!expedition) {
        return res.status(400).json({ message: 'Expedition not found' });
      }

      const newOrder = await prisma.order.create({
        data: {
          invoice,
          customer_id: userId,
          managed_by_id: storeAdmin.assignee_id,
          store_id: storeId,
          expedition_id: expedition.id,
          order_status_id: 1,
          address_id: selectedAddressId,
          order_details: {
            create: checkoutItems.map((item) => ({
              product_id: item.product_id,
              qty: item.quantity,
              store_id: storeId,
              price: item.price,
              sub_total: item.price * item.quantity + selectedCourierPrice,
            })),
          },
        },
      });

      return res.status(200).json(newOrder);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
