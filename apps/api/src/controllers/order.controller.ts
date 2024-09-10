import { Response, Request } from 'express';
import prisma from '@/prisma';
import nodeSchedule from 'node-schedule';
import {
  createOrderSchema,
  querySchema,
  getOrderByIdSchema,
  uploadPaymentProofSchema,
} from '@/validations/order';

export interface CustomRequest extends Request {
  currentUser?: {
    id: number;
    email: string;
  };
}

export class OrderController {
  getOrdersByUser = async (req: CustomRequest, res: Response) => {
    const currentUser = req.currentUser;

    if (!currentUser) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = currentUser.id;

    try {
      const queryValidation = querySchema.safeParse(req.query);
      if (!queryValidation.success) {
        return res.status(400).json({ error: queryValidation.error.errors });
      }

      const { filter, search, sortBy, order, page, limit } =
        queryValidation.data;

      const filterOptions: { [key: string]: number[] | undefined } = {
        all: undefined, // No filtering for 'all'
        ongoing: [1, 2, 3, 4], // Order statuses for ongoing
        completed: [5], // Completed orders
        cancelled: [6], // Cancelled orders
      };

      // Pagination options
      const pageSize = limit;
      const currentPage = page;
      const offset = (currentPage - 1) * pageSize;

      const whereClause: any = {
        customer_id: userId,
      };

      if (req.query.startDate && req.query.endDate) {
        whereClause.createdAt = {
          gte: new Date(req.query.startDate as string),
          lte: new Date(req.query.endDate as string),
        };
      }

      if (filter !== 'all' && filterOptions[filter]) {
        whereClause.order_status_id = { in: filterOptions[filter] };
      }

      if (search) {
        whereClause.OR = [
          { invoice: { contains: search, mode: 'insensitive' } },
          {
            order_details: {
              some: {
                product: { name: { contains: search, mode: 'insensitive' } },
              },
            },
          },
        ];
      }

      const orders = await prisma.order.findMany({
        where: whereClause,
        include: {
          store: {
            select: {
              name: true,
              address: true,
              city: { select: { city_name: true } },
            },
          },
          order_status: {
            select: {
              status: true,
            },
          },
          expedition: {
            select: { name: true, display_name: true },
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
              product: { select: { name: true, image: true } },
            },
          },
        },
        take: pageSize,
        skip: offset,
        orderBy: {
          [sortBy]: order,
        },
      });

      const totalOrders = await prisma.order.count({ where: whereClause });

      const enhancedOrders = orders.map((order) => {
        const totalProductPrice = order.order_details.reduce(
          (total: number, item: any) => {
            return total + item.price * item.qty;
          },
          0,
        );

        const deliveryPrice =
          order.order_details[0].sub_total -
          order.order_details[0].price * order.order_details[0].qty;

        return {
          ...order,
          totalProductPrice,
          deliveryPrice,
        };
      });

      return res.status(200).json({
        orders: enhancedOrders,
        pagination: {
          total: totalOrders,
          page: currentPage,
          pageSize,
          totalPages: Math.ceil(totalOrders / pageSize),
        },
      });
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
          order_status: {
            select: {
              status: true,
            },
          },
          expedition: {
            select: { name: true, display_name: true },
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
              product: { select: { name: true, image: true } },
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
        // createdAt: order.createdAt,
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
          invoice: 'INV-TEMPDATA',
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

      const invoice = `INV-${newOrder.id.toString().padStart(7, '0')}`;

      await prisma.order.update({
        where: { id: newOrder.id },
        data: { invoice },
      });

      const cancelJob = nodeSchedule.scheduleJob(
        newOrder.id.toString(),
        new Date(Date.now() + 1 * 60 * 1000),
        async () => {
          const order = await prisma.order.findUnique({
            where: { id: newOrder.id },
          });

          if (!order?.payment_proof) {
            await prisma.order.update({
              where: { id: newOrder.id },
              data: { order_status_id: 6 },
            });
          }
        },
      );

      return res.status(200).json(newOrder);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  cancelOrder = async (req: CustomRequest, res: Response) => {
    console.log('Received params:', req.params);
    const { id } = req.params;

    console.log('Received order ID:', id);

    try {
      const orderId = parseInt(id);
      if (isNaN(orderId)) {
        return res.status(400).json({ ok: false, message: 'Invalid order ID' });
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order || order.customer_id !== req.currentUser?.id) {
        return res
          .status(404)
          .json({ ok: false, message: 'Order not found or unauthorized' });
      }

      if (order.order_status_id !== 1) {
        return res
          .status(400)
          .json({ ok: false, message: 'Cannot cancel order at this stage' });
      }

      const cancelledOrder = await prisma.order.update({
        where: { id: orderId },
        data: { order_status_id: 6 },
      });

      return res.status(200).json({ ok: true, order: cancelledOrder });
    } catch (error: any) {
      console.error('Order cancellation error:', error);
      return res.status(500).json({
        ok: false,
        message: 'Order cancellation failed',
        error: error.message,
      });
    }
  };

  confirmDelivery = async (req: CustomRequest, res: Response) => {
    const { id } = req.params;

    try {
      const order = await prisma.order.findUnique({
        where: { id: parseInt(id) },
      });

      if (!order || order.customer_id !== req.currentUser?.id) {
        return res
          .status(404)
          .json({ ok: false, message: 'Order not found or unauthorized' });
      }

      if (order.order_status_id !== 4) {
        return res
          .status(400)
          .json({ ok: false, message: 'Order not in delivered stage' });
      }

      await this.updateOrderToDelivered(order.id);

      const completedOrder = await prisma.order.update({
        where: { id: parseInt(id) },
        data: { order_status_id: 5 }, // completed
      });

      // this.autoConfirmDelivery(order.id);

      return res.status(200).json({ ok: true, order: completedOrder });
    } catch (error) {
      return res
        .status(500)
        .json({ ok: false, message: 'Delivery confirmation failed', error });
    }
  };

  autoConfirmDelivery = (orderId: number) => {
    nodeSchedule.scheduleJob(
      orderId.toString(),
      new Date(Date.now() + 1 * 60 * 1000),
      async () => {
        const order = await prisma.order.findUnique({ where: { id: orderId } });

        if (order?.order_status_id === 4) {
          await prisma.order.update({
            where: { id: orderId },
            data: { order_status_id: 5 },
          });
        }
      },
    );
  };

  updateOrderToDelivered = async (orderId: number) => {
    // Update order status to delivered
    await prisma.order.update({
      where: { id: orderId },
      data: { order_status_id: 4 },
    });

    // Schedule auto-confirmation
    this.autoConfirmDelivery(orderId);
  };

  uploadPaymentProof = async (req: CustomRequest, res: Response) => {
    const { id } = req.params;
    const { payment_proof, fileType, fileSize } = req.body;

    const result = uploadPaymentProofSchema.safeParse({
      payment_proof,
      fileType,
      fileSize,
    });

    if (!result.success) {
      console.log('Validation errors:', result.error.format());
      return res
        .status(400)
        .json({ ok: false, message: 'Invalid payment proof format or size' });
    }

    try {
      const order = await prisma.order.findUnique({
        where: { id: parseInt(id) },
      });

      if (!order || order.customer_id !== req.currentUser?.id) {
        return res
          .status(404)
          .json({ ok: false, message: 'Order not found or unauthorized' });
      }

      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(id) },
        data: {
          payment_proof: result.data.payment_proof,
          order_status_id: 2,
        },
      });

      return res.status(200).json({ ok: true, order: updatedOrder });
    } catch (error) {
      console.error('Error updating payment proof:', error);
      return res
        .status(500)
        .json({ ok: false, message: 'Payment proof upload failed', error });
    }
  };
}
// createOrder = async (req: CustomRequest, res: Response) => {
//   try {
//     const validation = createOrderSchema.safeParse(req.body);
//     if (!validation.success) {
//       return res.status(400).json({ error: validation.error.errors });
//     }

//     const {
//       userId,
//       checkoutItems,
//       selectedAddressId,
//       storeId,
//       selectedCourier,
//       selectedCourierPrice,
//     } = validation.data;

//     const currentUser = req.currentUser;
//     if (!currentUser) {
//       return res.status(401).json({ error: 'User not authenticated' });
//     }

//     const orderCount = await prisma.order.count();
//     const invoice = `INV-${orderCount.toString().padStart(7, '0')}`;

//     const storeAdmin = await prisma.storeHasAdmin.findFirst({
//       where: { store_id: storeId },
//       select: { assignee_id: true },
//     });
//     if (!storeAdmin) {
//       return res.status(400).json({ error: 'No admin found for this store' });
//     }

//     const expedition = await prisma.expedition.findFirst({
//       where: { name: selectedCourier },
//       select: { id: true },
//     });
//     if (!expedition) {
//       return res.status(400).json({ message: 'Expedition not found' });
//     }

//     const newOrder = await prisma.order.create({
//       data: {
//         invoice,
//         customer_id: userId,
//         managed_by_id: storeAdmin.assignee_id,
//         store_id: storeId,
//         expedition_id: expedition.id,
//         order_status_id: 1,
//         address_id: selectedAddressId,
//         order_details: {
//           create: checkoutItems.map((item) => ({
//             product_id: item.product_id,
//             qty: item.quantity,
//             store_id: storeId,
//             price: item.price,
//             sub_total: item.price * item.quantity + selectedCourierPrice,
//           })),
//         },
//       },
//     });

//     return res.status(200).json(newOrder);
//   } catch (error) {
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

// uploadPaymentProof = async (req: CustomRequest, res: Response) => {
//   const { id } = req.params;
//   const result = uploadPaymentProofSchema.safeParse(req.body);

//   console.log('Request body:', req.body);

//   if (!result.success) {
//     return res
//       .status(400)
//       .json({ ok: false, message: 'Invalid payment proof' });
//   }

//   try {
//     const order = await prisma.order.findUnique({
//       where: { id: parseInt(id) },
//     });

//     if (!order || order.customer_id !== req.currentUser?.id) {
//       return res
//         .status(404)
//         .json({ ok: false, message: 'Order not found or unauthorized' });
//     }

//     const updatedOrder = await prisma.order.update({
//       where: { id: parseInt(id) },
//       data: {
//         payment_proof: result.data.payment_proof,
//         order_status_id: 2,
//       },
//     });

//     return res.status(200).json({ ok: true, order: updatedOrder });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ ok: false, message: 'Payment proof upload failed', error });
//   }
// };

// getOrdersByUser = async (req: CustomRequest, res: Response) => {
//   const { userId } = req.params;

//   try {
//     const validation = getOrdersByUserSchema.safeParse({ userId });
//     if (!validation.success) {
//       return res.status(400).json({ error: validation.error.errors });
//     }

//     const currentUser = req.currentUser;
//     if (!currentUser || Number(userId) !== currentUser.id) {
//       return res.status(403).json({
//         message: 'You do not have permission to view these orders',
//       });
//     }

//     const orders = await prisma.order.findMany({
//       where: { customer_id: Number(userId) },
//       include: {
//         store: {
//           select: {
//             name: true,
//             address: true,
//             city: { select: { city_name: true } },
//           },
//         },
//         order_status: {
//           select: {
//             status: true,
//           },
//         },
//         expedition: {
//           select: { name: true },
//         },
//         address: {
//           select: {
//             address: true,
//             kecamatan: true,
//             kelurahan: true,
//             city: { select: { city_name: true } },
//           },
//         },
//         order_details: {
//           include: {
//             product: { select: { name: true, image: true } },
//           },
//         },
//       },
//     });

//     const enhancedOrders = orders.map((order) => {
//       const totalProductPrice = order.order_details.reduce((total, item) => {
//         return total + item.price * item.qty;
//       }, 0);

//       const deliveryPrice =
//         order.order_details[0].sub_total -
//         order.order_details[0].price * order.order_details[0].qty;

//       return {
//         ...order,
//         totalProductPrice,
//         deliveryPrice,
//       };
//     });

//     return res.status(200).json({ orders: enhancedOrders });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };
