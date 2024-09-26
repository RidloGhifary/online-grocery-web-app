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
        all: undefined,
        ongoing: [1, 2, 3, 4],
        completed: [5],
        cancelled: [6],
      };

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
          customer: {
            select: { username: true, first_name: true, last_name: true },
          },
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
              id: true,
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

      let remainingTime = null;
      if (order.cancelAt) {
        const now = new Date();
        const cancelAtTime = new Date(order.cancelAt);
        remainingTime = cancelAtTime.getTime() - now.getTime();

        if (order.order_status_id !== 1 && remainingTime > 0) {
          await prisma.order.update({
            where: { id: Number(orderId) },
            data: { cancelAt: null },
          });
          remainingTime = null;
        }

        if (
          remainingTime !== null &&
          remainingTime <= 0 &&
          order.order_status_id === 1
        ) {
          await prisma.order.update({
            where: { id: Number(orderId) },
            data: { order_status_id: 6 },
          });

          const updatedOrder = await prisma.order.findUnique({
            where: { id: Number(orderId) },
            include: {
              customer: {
                select: { username: true, first_name: true, last_name: true },
              },
              store: {
                select: {
                  name: true,
                  address: true,
                  city: { select: { city_name: true } },
                },
              },
              order_status: {
                select: { status: true, id: true },
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

          return res.status(200).json({
            ...updatedOrder,
            totalProductPrice,
            deliveryPrice,
            remainingTime: null,
          });
        }
      }

      let remainingCompletionTime = null;
      if (order.completeAt) {
        const now = new Date();
        const completeAtTime = new Date(order.completeAt);
        remainingCompletionTime = completeAtTime.getTime() - now.getTime();

        if (order.order_status_id !== 4 && remainingCompletionTime > 0) {
          await prisma.order.update({
            where: { id: Number(orderId) },
            data: { completeAt: null },
          });
          remainingCompletionTime = null;
        }

        if (
          remainingCompletionTime !== null &&
          remainingCompletionTime <= 0 &&
          order.order_status_id === 4
        ) {
          await prisma.order.update({
            where: { id: Number(orderId) },
            data: { order_status_id: 5 },
          });

          const updatedOrder = await prisma.order.findUnique({
            where: { id: Number(orderId) },
            include: {
              customer: {
                select: { username: true, first_name: true, last_name: true },
              },
              store: {
                select: {
                  name: true,
                  address: true,
                  city: { select: { city_name: true } },
                },
              },
              order_status: {
                select: { status: true, id: true },
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

          return res.status(200).json({
            ...updatedOrder,
            totalProductPrice,
            deliveryPrice,
            remainingCompletionTime: null,
          });
        }
      }

      if (order.order_status_id === 1 && !order.cancelAt) {
        const cancelationTime = new Date(Date.now() + 3 * 60 * 1000);
        await prisma.order.update({
          where: { id: Number(orderId) },
          data: { cancelAt: cancelationTime },
        });

        const cancelJob = nodeSchedule.scheduleJob(
          orderId.toString(),
          cancelationTime,
          async () => {
            const order = await prisma.order.findUnique({
              where: { id: Number(orderId) },
            });

            if (!order?.payment_proof) {
              await prisma.order.update({
                where: { id: Number(orderId) },
                data: { order_status_id: 6 },
              });
            }
          },
        );

        remainingTime = cancelationTime.getTime() - Date.now();
      }

      if (order.order_status_id === 4 && !order.completeAt) {
        const completionTime = new Date(Date.now() + 3 * 60 * 1000);
        await prisma.order.update({
          where: { id: Number(orderId) },
          data: { completeAt: completionTime },
        });

        const completionJob = nodeSchedule.scheduleJob(
          orderId.toString(),
          completionTime,
          async () => {
            const order = await prisma.order.findUnique({
              where: { id: Number(orderId) },
            });

            if (order?.order_status_id === 4) {
              await prisma.order.update({
                where: { id: Number(orderId) },
                data: { order_status_id: 5 },
              });
            }
          },
        );

        remainingCompletionTime = completionTime.getTime() - Date.now();
      }

      return res.status(200).json({
        ...order,
        totalProductPrice,
        deliveryPrice,
        cancelAt: order.cancelAt,
        completeAt: order.completeAt,
        remainingTime: remainingTime ? Math.max(remainingTime, 0) : null,
        remainingCompletionTime: remainingCompletionTime
          ? Math.max(remainingCompletionTime, 0)
          : null,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  ensureNumber(value: number | null): number {
    return value ?? 0;
  }

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
        include: { order_details: true },
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

      for (const detail of order.order_details) {
        const stockAdjustment = await prisma.stocksAdjustment.findFirst({
          where: { order_detail_id: detail.id, type: 'checkout' },
        });

        if (stockAdjustment && stockAdjustment.destinied_store_id !== null) {
          console.log('Updating original store stock...');

          const storeHasProduct = await prisma.storeHasProduct.findFirst({
            where: {
              store_id: stockAdjustment.destinied_store_id,
              product_id: detail.product_id,
            },
          });

          if (storeHasProduct) {
            console.log(
              'Restoring stock for the original store:',
              storeHasProduct.id,
            );

            await prisma.storeHasProduct.update({
              where: { id: storeHasProduct.id },
              data: {
                qty: { increment: Math.abs(stockAdjustment.qty_change) },
              },
            });

            await prisma.stocksAdjustment.create({
              data: {
                qty_change: Math.abs(stockAdjustment.qty_change),
                type: 'cancel',
                managed_by_id: order.managed_by_id,
                product_id: detail.product_id,
                detail: `cancel order for product id ${detail.product_id} in store id ${detail.store_id}`,
                destinied_store_id: detail.store_id,
                order_detail_id: detail.id,
                adjustment_related_id: stockAdjustment.id,
              },
            });
          } else {
            console.error('Original store stock not found for update.');
          }
        }

        const mutation = await prisma.stocksAdjustment.findFirst({
          where: { order_detail_id: detail.id, mutation_type: 'pending' },
        });

        if (mutation && mutation.from_store_id !== null) {
          console.log('Updating mutation store stock...');

          const aidingStoreHasProduct = await prisma.storeHasProduct.findFirst({
            where: {
              store_id: mutation.from_store_id,
              product_id: detail.product_id,
            },
          });

          if (aidingStoreHasProduct) {
            console.log(
              'Restoring stock for the aiding store:',
              aidingStoreHasProduct.id,
            );

            await prisma.storeHasProduct.update({
              where: { id: aidingStoreHasProduct.id },
              data: { qty: { increment: Math.abs(mutation.qty_change) } },
            });

            await prisma.stocksAdjustment.create({
              data: {
                qty_change: mutation.qty_change * -1,
                type: 'cancel',
                managed_by_id: mutation.managed_by_id,
                product_id: mutation.product_id,
                detail: `aborted mutation of order detail ${detail.id} for checkout in store ${detail.store_id}, return product to store id ${mutation.from_store_id}`,
                from_store_id: mutation.destinied_store_id,
                destinied_store_id: mutation.from_store_id,
                order_detail_id: detail.id,
                mutation_type: 'abort',
                adjustment_related_id: mutation.id,
              },
            });
          } else {
            console.error('Mutation store stock not found for update.');
          }
        }
      }

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
        data: { order_status_id: 5 },
      });

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
    await prisma.order.update({
      where: { id: orderId },
      data: { order_status_id: 4 },
    });
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
          cancelAt: null,
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
