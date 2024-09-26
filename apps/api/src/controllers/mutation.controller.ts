import { Response, Request } from 'express';
import prisma from '@/prisma';
import {
  getStockMutationsSchema,
  confirmStockMutationSchema,
} from '@/validations/mutation';

export interface CustomRequest extends Request {
  currentUser?: {
    id: number;
    email: string;
  };
}

export class MutationController {
  getPendingStockMutations = async (req: CustomRequest, res: Response) => {
    const currentUser = req.currentUser;
    if (!currentUser) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = currentUser.id;

    const {
      page = 1,
      search = '',
      sort = 'desc',
      store_id,
    } = getStockMutationsSchema.parse(req.query);

    try {
      const userRoles = await prisma.userHasRole.findMany({
        where: {
          user_id: userId,
          role: {
            name: { in: ['super_admin', 'store_admin'] },
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

      let storeId: number | undefined;

      if (isStoreAdmin) {
        const storeAdminInfo = await prisma.storeHasAdmin.findFirst({
          where: { user_id: userId },
        });
        if (!storeAdminInfo) {
          return res
            .status(403)
            .json({ error: 'User is not authorized for any store' });
        }
        storeId = storeAdminInfo.store_id;
      }

      if (isSuperAdmin && store_id) {
        storeId = store_id;
      }

      const queryConditions: any = {
        mutation_type: 'pending',
        ...(storeId && { destinied_store_id: storeId }),
        ...(search && {
          order_detail: {
            product: {
              name: { contains: search },
            },
          },
        }),
      };

      const stockMutations = await prisma.stocksAdjustment.findMany({
        where: {
          ...queryConditions,
          NOT: { adjustment_related_id: { not: null } },
        },
        include: {
          order_detail: {
            include: {
              product: true,
            },
          },
          from_store: {
            include: {
              city: true,
            },
          },
          destinied_store: {
            include: {
              city: true,
            },
          },
        },
        orderBy: { createdAt: sort },
        skip: (page - 1) * 8,
        take: 8,
      });

      const enrichedStockMutations = await Promise.all(
        stockMutations.map(async (mutation) => {
          const fromStore = mutation.from_store;
          const destiniedStore = mutation.destinied_store;

          let fromStoreCityName = null;
          let destiniedStoreCityName = null;

          if (fromStore) {
            const city = await prisma.city.findUnique({
              where: { id: fromStore.city_id },
            });
            fromStoreCityName = city?.city_name || null;
          }

          if (destiniedStore) {
            const city = await prisma.city.findUnique({
              where: { id: destiniedStore.city_id },
            });
            destiniedStoreCityName = city?.city_name || null;
          }

          return {
            ...mutation,
            from_store: {
              ...fromStore,
              city_name: fromStoreCityName,
            },
            destinied_store: {
              ...destiniedStore,
              city_name: destiniedStoreCityName,
            },
          };
        }),
      );

      return res.json({ stockMutations: enrichedStockMutations });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  };

  confirmStockMutation = async (req: CustomRequest, res: Response) => {
    const currentUser = req.currentUser;

    if (!currentUser) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { pendingMutationId } = confirmStockMutationSchema.parse(req.body);

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

      const pendingMutation = await prisma.stocksAdjustment.findUnique({
        where: { id: pendingMutationId },
      });

      if (!pendingMutation || pendingMutation.mutation_type !== 'pending') {
        return res
          .status(404)
          .json({ error: 'Pending stock mutation not found' });
      }

      if (isStoreAdmin) {
        const storeAdminInfo = await prisma.storeHasAdmin.findFirst({
          where: { user_id: userId },
        });

        if (
          !storeAdminInfo ||
          storeAdminInfo.store_id !== pendingMutation.destinied_store_id
        ) {
          return res
            .status(403)
            .json({ error: 'User not authorized for this store' });
        }
      }

      const completeMutation = await prisma.stocksAdjustment.create({
        data: {
          qty_change: 0,
          type: pendingMutation.type,
          managed_by_id: userId,
          product_id: pendingMutation.product_id,
          detail: `Completed mutation for order detail ${pendingMutation.order_detail_id}, product has arrived at store ${pendingMutation.destinied_store_id} sent by store ${pendingMutation.from_store_id}`,
          from_store_id: pendingMutation.from_store_id,
          destinied_store_id: pendingMutation.destinied_store_id,
          order_detail_id: pendingMutation.order_detail_id,
          mutation_type: 'complete',
          adjustment_related_id: pendingMutation.id,
        },
      });

      return res
        .status(200)
        .json({ message: 'Stock mutation confirmed', completeMutation });
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  };
}
