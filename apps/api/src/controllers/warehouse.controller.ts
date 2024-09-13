import { Response, Request } from 'express';
import prisma from '@/prisma';
import { getOrdersForAdminSchema } from '@/validations/warehouse';

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

      // Pagination options
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

      // Date range filtering
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

      // Ensuring sortBy is defined
      const sortField = sortBy ?? 'createdAt'; // default to 'createdAt' if sortBy is undefined
      const sortOrder = order ?? 'asc'; // default to 'asc' if order is undefined

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
}
