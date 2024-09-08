import { Response, Request } from 'express';
import prisma from '@/prisma';
import { createOrderSchema } from '@/validations/order';

export interface CustomRequest extends Request {
  currentUser?: {
    id: number;
    email: string;
  };
}

export class OrderController {
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
