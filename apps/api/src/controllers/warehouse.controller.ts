import { Response, Request } from 'express';
import prisma from '@/prisma';
import nodeSchedule from 'node-schedule';
import {
  getOrdersForAdminSchema,
  getOrderByIdSchema,
  handlePaymentProofSchema,
  deliverProductSchema,
  cancelOrderSchema,
} from '@/validations/warehouse';

export interface CustomRequest extends Request {
  currentUser?: {
    id: number;
    email: string;
  };
}

type FilterKey =
  | 'all'
  | 'waiting_payment_confirmation'
  | 'processing'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export class WarehouseController {
  getOrdersForAdmin = async (req: CustomRequest, res: Response) => {
    const currentUser = req.currentUser;

    if (!currentUser) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = currentUser.id;

    try {
      const userRoles = await prisma.userHasRole.findMany({
        where: {
          user_id: userId,
          role: {
            name: {
              in: ['super_admin', 'store_admin'],
            },
          },
        },
        include: { role: true },
      });

      const isSuperAdmin = userRoles.some(
        (role) => role?.role?.name === 'super_admin',
      );
      const isStoreAdmin = userRoles.some(
        (role) => role?.role?.name === 'store_admin',
      );

      if (!isSuperAdmin && !isStoreAdmin) {
        return res.status(403).json({ error: 'User is not authorized' });
      }

      const queryValidation = getOrdersForAdminSchema.safeParse(req.query);
      if (!queryValidation.success) {
        return res.status(400).json({ error: queryValidation.error.errors });
      }

      const { filter, search, sortBy, order, page, limit, storeId } =
        queryValidation.data;

      const filterOptions: Record<string, number[]> = {
        all: [2, 3, 4, 5, 6],
        waiting_payment_confirmation: [2],
        processing: [3],
        delivered: [4],
        completed: [5],
        cancelled: [6],
      };

      const pageSize = limit;
      const currentPage = page;
      const offset = (currentPage - 1) * pageSize;

      const whereClause: any = {
        payment_proof: { not: null },
      };

      if (filter && filter !== 'all' && filter in filterOptions) {
        whereClause.order_status_id = {
          in: filterOptions[filter as FilterKey],
        };
      }

      if (req.query.startDate && req.query.endDate) {
        whereClause.createdAt = {
          gte: new Date(req.query.startDate as string),
          lte: new Date(req.query.endDate as string),
        };
      }

      if (isStoreAdmin) {
        const storeAdminInfo = await prisma.storeHasAdmin.findFirst({
          where: { user_id: userId },
        });

        if (!storeAdminInfo) {
          return res
            .status(403)
            .json({ error: 'User is not authorized for any store' });
        }

        whereClause.store_id = storeAdminInfo.store_id;
      } else if (isSuperAdmin && storeId) {
        whereClause.store_id = storeId;
      }

      if (search) {
        whereClause.OR = [
          {
            order_details: {
              some: {
                product: { name: { contains: search || '' } },
              },
            },
          },
          {
            customer: {
              OR: [
                { username: { contains: search || '' } },
                { first_name: { contains: search || '' } },
                { last_name: { contains: search || '' } },
              ],
            },
          },
        ];
      }

      const sortField = sortBy ?? 'createdAt';
      const sortOrder = order ?? 'asc';

      const orders = await prisma.order.findMany({
        where: whereClause,
        include: {
          customer: {
            select: { username: true, first_name: true, last_name: true },
          },
          store: {
            select: {
              name: true,
              address: true,
              kecamatan: true,
              city: { select: { city_name: true } },
            },
          },
          order_status: {
            select: { status: true },
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
            include: { product: { select: { name: true, image: true } } },
          },
        },
        take: pageSize,
        skip: offset,
        orderBy: { [sortField]: sortOrder },
      });

      const totalOrders = await prisma.order.count({ where: whereClause });

      const enhancedOrders = orders.map((order) => {
        const totalProductPrice = order.order_details.reduce(
          (total: number, item: any) => total + item.price * item.qty,
          0,
        );

        const deliveryPrice =
          order.order_details[0].sub_total -
          order.order_details[0].price * order.order_details[0].qty;

        return { ...order, totalProductPrice, deliveryPrice };
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
    const validationResult = getOrderByIdSchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    const { id } = validationResult.data;
    const currentUser = req.currentUser;

    if (!currentUser) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      const order = await prisma.order.findUnique({
        where: { id: Number(id) },
        include: {
          customer: {
            select: { username: true, first_name: true, last_name: true },
          },
          store: {
            select: {
              name: true,
              address: true,
              kecamatan: true,
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
              product: {
                select: { name: true, image: true },
              },
            },
          },
        },
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const storeAdmin = await prisma.storeHasAdmin.findFirst({
        where: { user_id: currentUser.id, store_id: order.store_id },
      });

      const isSuperAdmin = await prisma.userHasRole.findFirst({
        where: {
          user_id: currentUser.id,
          role: { name: 'super_admin' },
        },
      });

      if (
        !isSuperAdmin &&
        (!storeAdmin || storeAdmin.store_id !== order.store_id)
      ) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      const storeProductStock = await prisma.storeHasProduct.findMany({
        where: {
          store_id: order.store_id,
          product_id: {
            in: order.order_details.map((item) => item.product_id),
          },
        },
        select: {
          product_id: true,
          qty: true,
        },
      });

      const enhancedOrderDetails = order.order_details.map((detail) => {
        const productStock = storeProductStock.find(
          (stock) => stock.product_id === detail.product_id,
        );
        return {
          ...detail,
          store_qty: productStock?.qty || 0,
        };
      });

      const totalProductPrice = enhancedOrderDetails.reduce(
        (total, item) => total + item.price * item.qty,
        0,
      );

      const deliveryPrice =
        enhancedOrderDetails[0].sub_total -
        enhancedOrderDetails[0].price * enhancedOrderDetails[0].qty;

      const enhancedOrder = {
        ...order,
        order_details: enhancedOrderDetails,
        totalProductPrice,
        deliveryPrice,
        isStoreAdminOfOrder: !!storeAdmin,
      };

      return res.status(200).json(enhancedOrder);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  handlePaymentProof = async (req: CustomRequest, res: Response) => {
    const validationResult = handlePaymentProofSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    const { orderId, action } = validationResult.data;

    const currentUser = req.currentUser;
    if (!currentUser) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      const order = await prisma.order.findUnique({ where: { id: orderId } });

      if (!order || order.order_status_id !== 2) {
        return res
          .status(400)
          .json({ error: 'Invalid order status or order not found' });
      }

      const storeAdmin = await prisma.storeHasAdmin.findFirst({
        where: { user_id: currentUser.id, store_id: order.store_id },
      });

      const isSuperAdmin = await prisma.userHasRole.findFirst({
        where: { user_id: currentUser.id, role: { name: 'super_admin' } },
      });

      if (
        !isSuperAdmin &&
        (!storeAdmin || storeAdmin.store_id !== order.store_id)
      ) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      let newStatus = action === 'accept' ? 3 : 1;

      if (newStatus === 1) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            order_status_id: newStatus,
            payment_proof: null,
          },
        });

        nodeSchedule.scheduleJob(
          orderId.toString(),
          new Date(Date.now() + 3 * 60 * 1000),
          async () => {
            const orderToCancel = await prisma.order.findUnique({
              where: { id: orderId },
            });

            if (!orderToCancel?.payment_proof) {
              await prisma.order.update({
                where: { id: orderId },
                data: { order_status_id: 6 },
              });
            }
          },
        );
      } else {
        await prisma.order.update({
          where: { id: orderId },
          data: { order_status_id: newStatus },
        });
      }

      return res
        .status(200)
        .json({ message: 'Order status updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  // deliverProduct = async (req: CustomRequest, res: Response) => {
  //   const validationResult = deliverProductSchema.safeParse(req.body);
  //   if (!validationResult.success) {
  //     return res.status(400).json({ error: validationResult.error.errors });
  //   }

  //   const { orderId } = validationResult.data;

  //   const currentUser = req.currentUser;
  //   if (!currentUser) {
  //     return res.status(401).json({ error: 'User not authenticated' });
  //   }

  //   try {
  //     const order = await prisma.order.findUnique({
  //       where: { id: orderId },
  //       include: { order_details: true },
  //     });

  //     if (!order || order.order_status_id !== 3) {
  //       return res
  //         .status(400)
  //         .json({ error: 'Invalid order status or order not found' });
  //     }

  //     const storeAdmin = await prisma.storeHasAdmin.findFirst({
  //       where: { user_id: currentUser.id, store_id: order.store_id },
  //     });

  //     const isSuperAdmin = await prisma.userHasRole.findFirst({
  //       where: { user_id: currentUser.id, role: { name: 'super_admin' } },
  //     });

  //     if (
  //       !isSuperAdmin &&
  //       (!storeAdmin || storeAdmin.store_id !== order.store_id)
  //     ) {
  //       return res.status(403).json({ error: 'Unauthorized access' });
  //     }

  //     for (const detail of order.order_details) {
  //       const storeProduct = await prisma.storeHasProduct.findFirst({
  //         where: { product_id: detail.product_id, store_id: order.store_id },
  //       });

  //       if (
  //         !storeProduct ||
  //         storeProduct.qty === null ||
  //         storeProduct.qty < detail.qty
  //       ) {
  //         return res.status(400).json({
  //           error:
  //             'Requested store has no enough inventory of product in warehouse',
  //         });
  //       }

  //       await prisma.storeHasProduct.update({
  //         where: { id: storeProduct.id },
  //         data: { qty: storeProduct.qty - detail.qty },
  //       });
  //     }

  //     await prisma.order.update({
  //       where: { id: orderId },
  //       data: { order_status_id: 4 },
  //     });

  //     return res
  //       .status(200)
  //       .json({ message: 'Product delivered successfully' });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ error: 'Internal server error' });
  //   }
  // };

  deliverProduct = async (req: CustomRequest, res: Response) => {
    const validationResult = deliverProductSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    const { orderId } = validationResult.data;
    const currentUser = req.currentUser;

    if (!currentUser) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { order_details: true },
      });

      if (!order || order.order_status_id !== 3) {
        return res
          .status(400)
          .json({ error: 'Invalid order status or order not found' });
      }

      const storeAdmin = await prisma.storeHasAdmin.findFirst({
        where: { user_id: currentUser.id, store_id: order.store_id },
      });

      const isSuperAdmin = await prisma.userHasRole.findFirst({
        where: {
          user_id: currentUser.id,
          role: { name: 'super_admin' },
        },
      });

      if (
        !isSuperAdmin &&
        (!storeAdmin || storeAdmin.store_id !== order.store_id)
      ) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      // Process each order detail
      for (const detail of order.order_details) {
        // 1. Fetch original checkout data (where from_store_id is null)
        const checkoutData = await prisma.stocksAdjustment.findFirst({
          where: {
            order_detail_id: detail.id,
            type: 'checkout',
            from_store_id: null, // Original transaction from the store
            destinied_store_id: order.store_id, // Store in the order table
          },
        });

        if (!checkoutData) {
          return res.status(400).json({
            error: `No original checkout data found for order detail ID ${detail.id}`,
          });
        }

        // 2. Check if there is a mutation for this order detail
        const mutationData = await prisma.stocksAdjustment.findMany({
          where: {
            order_detail_id: detail.id,
            // type: 'checkout',
            from_store_id: { not: null }, // Mutation involves a different store
            destinied_store_id: order.store_id, // Matches store from the order
          },
        });

        // a. If mutation exists, check if any of them have 'complete' type
        const completedMutation = mutationData.find(
          (mutation) => mutation.mutation_type === 'complete',
        );

        // If mutation exists and is not completed, block the delivery process
        if (mutationData.length > 0 && !completedMutation) {
          return res.status(400).json({
            error: `Stock mutation for order detail ID ${detail.id} is still pending.`,
          });
        }

        // 3. Log the purchase data to stocksAdjustment
        await prisma.stocksAdjustment.create({
          data: {
            qty_change: 0, // No quantity change, just confirming the delivery
            type: 'purchase', // Log as a purchase type
            managed_by_id: currentUser.id, // ID of the admin executing the delivery
            product_id: detail.product_id, // Product being delivered
            detail: `Products for order detail id ${detail.id} have been sent to customer by store id ${order.store_id}`,
            from_store_id: null, // No from_store_id since it's the original store's purchase
            destinied_store_id: order.store_id, // The store associated with the order
            order_detail_id: detail.id, // Link to the specific order detail
            mutation_type: null, // No mutation type needed for this log
            adjustment_related_id: checkoutData.id, // Referencing the original 'checkout' type data
          },
        });
      }

      // Update order status to 'delivered'
      await prisma.order.update({
        where: { id: orderId },
        data: { order_status_id: 4 },
      });

      return res
        .status(200)
        .json({ message: 'Product delivered successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  cancelOrder = async (req: CustomRequest, res: Response) => {
    const validationResult = cancelOrderSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    const { orderId } = validationResult.data;
    const currentUser = req.currentUser;
    if (!currentUser) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { order_details: true },
      });

      if (!order || order.order_status_id >= 4) {
        return res
          .status(400)
          .json({ error: 'Invalid order status or order not found' });
      }

      // Ensure that the current user has appropriate admin permissions
      const storeAdmin = await prisma.storeHasAdmin.findFirst({
        where: { user_id: currentUser.id, store_id: order.store_id },
      });

      const isSuperAdmin = await prisma.userHasRole.findFirst({
        where: { user_id: currentUser.id, role: { name: 'super_admin' } },
      });

      if (
        !isSuperAdmin &&
        (!storeAdmin || storeAdmin.store_id !== order.store_id)
      ) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      // Process each order detail for stock adjustment
      for (const detail of order.order_details) {
        // Handle the original stock adjustment (from checkout)
        const stockAdjustment = await prisma.stocksAdjustment.findFirst({
          where: { order_detail_id: detail.id, type: 'checkout' },
        });

        if (stockAdjustment && stockAdjustment.destinied_store_id !== null) {
          // Handle returning stock to the original store
          const originalStoreHasProduct =
            await prisma.storeHasProduct.findFirst({
              where: {
                store_id: stockAdjustment.destinied_store_id,
                product_id: detail.product_id,
              },
            });

          if (originalStoreHasProduct) {
            // Update stock for the original store
            await prisma.storeHasProduct.update({
              where: { id: originalStoreHasProduct.id },
              data: {
                qty: { increment: Math.abs(stockAdjustment.qty_change) }, // Ensure positive quantity is added back
              },
            });

            // Log the cancellation in stocksAdjustment
            await prisma.stocksAdjustment.create({
              data: {
                qty_change: Math.abs(stockAdjustment.qty_change),
                type: 'cancel',
                managed_by_id: currentUser.id,
                product_id: detail.product_id,
                detail: `Cancel order for product ID ${detail.product_id} in store ID ${detail.store_id}`,
                destinied_store_id: detail.store_id,
                order_detail_id: detail.id,
                adjustment_related_id: stockAdjustment.id, // Link to the original stock adjustment
              },
            });
          }
        }

        // Handle any mutations (if stock was moved from another store)
        const mutation = await prisma.stocksAdjustment.findFirst({
          where: { order_detail_id: detail.id, mutation_type: 'pending' },
        });

        if (mutation && mutation.from_store_id !== null) {
          // Return stock to the aiding store involved in the mutation
          const aidingStoreHasProduct = await prisma.storeHasProduct.findFirst({
            where: {
              store_id: mutation.from_store_id,
              product_id: detail.product_id,
            },
          });

          if (aidingStoreHasProduct) {
            // Update stock for the aiding store
            await prisma.storeHasProduct.update({
              where: { id: aidingStoreHasProduct.id },
              data: {
                qty: { increment: Math.abs(mutation.qty_change) }, // Return the mutation quantity
              },
            });

            // Log the cancellation of the mutation in stocksAdjustment
            await prisma.stocksAdjustment.create({
              data: {
                qty_change: mutation.qty_change * -1, // Negative value for reverting the mutation
                type: 'cancel',
                managed_by_id: currentUser.id,
                product_id: mutation.product_id,
                detail: `Cancel mutation of order detail ID ${detail.id} for checkout in store ${detail.store_id}, return product to store ID ${mutation.from_store_id}`,
                from_store_id: mutation.destinied_store_id, // Swap destination and source
                destinied_store_id: mutation.from_store_id, // Swap destination and source
                order_detail_id: detail.id,
                mutation_type: 'abort',
                adjustment_related_id: mutation.id, // Link to the original mutation adjustment
              },
            });
          }
        }
      }

      // Finally, update the order status to "cancelled"
      await prisma.order.update({
        where: { id: orderId },
        data: { order_status_id: 6 },
      });

      return res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  // cancelOrder = async (req: CustomRequest, res: Response) => {
  //   const validationResult = cancelOrderSchema.safeParse(req.body);
  //   if (!validationResult.success) {
  //     return res.status(400).json({ error: validationResult.error.errors });
  //   }

  //   const { orderId } = validationResult.data;
  //   const currentUser = req.currentUser;
  //   if (!currentUser) {
  //     return res.status(401).json({ error: 'User not authenticated' });
  //   }

  //   try {
  //     const order = await prisma.order.findUnique({
  //       where: { id: orderId },
  //       include: { order_details: true },
  //     });

  //     if (!order || order.order_status_id >= 4) {
  //       return res
  //         .status(400)
  //         .json({ error: 'Invalid order status or order not found' });
  //     }

  //     const storeAdmin = await prisma.storeHasAdmin.findFirst({
  //       where: { user_id: currentUser.id, store_id: order.store_id },
  //     });

  //     const isSuperAdmin = await prisma.userHasRole.findFirst({
  //       where: { user_id: currentUser.id, role: { name: 'super_admin' } },
  //     });

  //     if (
  //       !isSuperAdmin &&
  //       (!storeAdmin || storeAdmin.store_id !== order.store_id)
  //     ) {
  //       return res.status(403).json({ error: 'Unauthorized access' });
  //     }

  //     for (const orderDetail of order.order_details) {
  //       const stockAdjustments = await prisma.stocksAdjustment.findMany({
  //         where: { order_detail_id: orderDetail.id, type: 'checkout' },
  //       });

  //       if (stockAdjustments.length > 0) {
  //         for (const adjustment of stockAdjustments) {
  //           await prisma.stocksAdjustment.create({
  //             data: {
  //               qty_change: adjustment.qty_change,
  //               type: 'cancel',
  //               managed_by_id: currentUser.id,
  //               product_id: adjustment.product_id,
  //               detail: `Return for order_detail_id ${orderDetail.id} cancellation`,
  //               from_store_id: adjustment.destinied_store_id,
  //               destinied_store_id: adjustment.from_store_id,
  //               order_detail_id: orderDetail.id,
  //             },
  //           });

  //           await prisma.storeHasProduct.updateMany({
  //             where: {
  //               store_id: adjustment.from_store_id,
  //               product_id: adjustment.product_id,
  //             },
  //             data: {
  //               qty: {
  //                 increment: adjustment.qty_change,
  //               },
  //             },
  //           });
  //         }
  //       }
  //     }

  //     await prisma.order.update({
  //       where: { id: orderId },
  //       data: { order_status_id: 6 },
  //     });

  //     return res.status(200).json({ message: 'Order cancelled successfully' });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ error: 'Internal server error' });
  //   }
  // };
}
