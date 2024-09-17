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
        (role) => role.role.name === 'super_admin',
      );
      const isStoreAdmin = userRoles.some(
        (role) => role.role.name === 'store_admin',
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
        where: { user_id: currentUser.id, role: { name: 'super_admin' } },
      });

      if (
        !isSuperAdmin &&
        (!storeAdmin || storeAdmin.store_id !== order.store_id)
      ) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      for (const detail of order.order_details) {
        const storeProduct = await prisma.storeHasProduct.findFirst({
          where: { product_id: detail.product_id, store_id: order.store_id },
        });

        if (
          !storeProduct ||
          storeProduct.qty === null ||
          storeProduct.qty < detail.qty
        ) {
          return res.status(400).json({
            error:
              'Requested store has no enough inventory of product in warehouse',
          });
        }

        await prisma.storeHasProduct.update({
          where: { id: storeProduct.id },
          data: { qty: storeProduct.qty - detail.qty },
        });
      }

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

      for (const orderDetail of order.order_details) {
        const stockAdjustments = await prisma.stocksAdjustment.findMany({
          where: { order_detail_id: orderDetail.id, type: 'increment' },
        });

        if (stockAdjustments.length > 0) {
          for (const adjustment of stockAdjustments) {
            await prisma.stocksAdjustment.create({
              data: {
                qty_change: adjustment.qty_change,
                type: 'decreement',
                managed_by_id: currentUser.id,
                product_id: adjustment.product_id,
                detail: `Return for order_detail_id ${orderDetail.id} cancellation`,
                from_store_id: adjustment.destinied_store_id,
                destinied_store_id: adjustment.from_store_id,
                order_detail_id: orderDetail.id,
              },
            });

            await prisma.storeHasProduct.updateMany({
              where: {
                store_id: adjustment.from_store_id,
                product_id: adjustment.product_id,
              },
              data: {
                qty: {
                  increment: adjustment.qty_change,
                },
              },
            });
          }
        }
      }

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

  //   cancelOrder = async (req: CustomRequest, res: Response) => {
  //     const validationResult = cancelOrderSchema.safeParse(req.body);
  //     if (!validationResult.success) {
  //       return res.status(400).json({ error: validationResult.error.errors });
  //     }

  //     const { orderId } = validationResult.data;

  //     const currentUser = req.currentUser;
  //     if (!currentUser) {
  //       return res.status(401).json({ error: 'User not authenticated' });
  //     }

  //     try {
  //       const order = await prisma.order.findUnique({ where: { id: orderId } });

  //       if (!order || order.order_status_id >= 4) {
  //         return res
  //           .status(400)
  //           .json({ error: 'Invalid order status or order not found' });
  //       }

  //       const storeAdmin = await prisma.storeHasAdmin.findFirst({
  //         where: { user_id: currentUser.id, store_id: order.store_id },
  //       });

  //       const isSuperAdmin = await prisma.userHasRole.findFirst({
  //         where: { user_id: currentUser.id, role: { name: 'super_admin' } },
  //       });

  //       if (
  //         !isSuperAdmin &&
  //         (!storeAdmin || storeAdmin.store_id !== order.store_id)
  //       ) {
  //         return res.status(403).json({ error: 'Unauthorized access' });
  //       }

  //       await prisma.order.update({
  //         where: { id: orderId },
  //         data: { order_status_id: 6 },
  //       });

  //       return res.status(200).json({ message: 'Order cancelled successfully' });
  //     } catch (error) {
  //       console.error(error);
  //       return res.status(500).json({ error: 'Internal server error' });
  //     }
  //   };
}

// handlePaymentProof = async (req: CustomRequest, res: Response) => {
//   const validationResult = handlePaymentProofSchema.safeParse(req.body);
//   if (!validationResult.success) {
//     return res.status(400).json({ error: validationResult.error.errors });
//   }

//   const { orderId, action } = validationResult.data;

//   const currentUser = req.currentUser;
//   if (!currentUser) {
//     return res.status(401).json({ error: 'User not authenticated' });
//   }

//   try {
//     const order = await prisma.order.findUnique({ where: { id: orderId } });

//     if (!order || order.order_status_id !== 2) {
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

//     let newStatus = action === 'accept' ? 3 : 1;

//     await prisma.order.update({
//       where: { id: orderId },
//       data: { order_status_id: newStatus },
//     });

//     return res
//       .status(200)
//       .json({ message: 'Order status updated successfully' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

// getOrderById = async (req: CustomRequest, res: Response) => {
//   const validationResult = getOrderByIdSchema.safeParse(req.params);
//   if (!validationResult.success) {
//     return res.status(400).json({ error: validationResult.error.errors });
//   }

//   const { id } = validationResult.data;
//   const currentUser = req.currentUser;

//   if (!currentUser) {
//     return res.status(401).json({ error: 'User not authenticated' });
//   }

//   try {
//     const order = await prisma.order.findUnique({
//       where: { id: Number(id) },
//       include: {
//         customer: {
//           select: { username: true, first_name: true, last_name: true },
//         },
//         store: {
//           select: {
//             name: true,
//             address: true,
//             kecamatan: true,
//             city: { select: { city_name: true } },
//           },
//         },
//         order_status: {
//           select: { status: true, id: true },
//         },
//         expedition: {
//           select: { name: true, display_name: true },
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
//           include: { product: { select: { name: true, image: true } } },
//         },
//       },
//     });

//     if (!order) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     const storeAdmin = await prisma.storeHasAdmin.findFirst({
//       where: { user_id: currentUser.id, store_id: order.store_id },
//     });

//     const isSuperAdmin = await prisma.userHasRole.findFirst({
//       where: {
//         user_id: currentUser.id,
//         role: { name: 'super_admin' },
//       },
//     });

//     if (
//       !isSuperAdmin &&
//       (!storeAdmin || storeAdmin.store_id !== order.store_id)
//     ) {
//       return res.status(403).json({ error: 'Unauthorized access' });
//     }

//     const totalProductPrice = order.order_details.reduce(
//       (total, item) => total + item.price * item.qty,
//       0,
//     );

//     const deliveryPrice =
//       order.order_details[0].sub_total -
//       order.order_details[0].price * order.order_details[0].qty;

//     const enhancedOrder = {
//       ...order,
//       totalProductPrice,
//       deliveryPrice,
//       isStoreAdminOfOrder: !!storeAdmin,
//     };

//     return res.status(200).json(enhancedOrder);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };
