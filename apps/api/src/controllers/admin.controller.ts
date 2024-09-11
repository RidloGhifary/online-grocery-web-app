import { Request, Response } from 'express';
import prisma from '@/prisma';

export class AdminController {
  async getAllAdmins(req: Request, res: Response) {
    try {
      const admins = await prisma.userHasRole.findMany({
        where: {
          role: {
            name: 'store_admin',
          },
        },
        include: {
          user: {
            include: {
              store_admins: {
                include: {
                  store: true,
                },
              },
            },
          },
        },
      });
      res.status(200).json({ ok: true, message: 'Success', data: admins });
    } catch {
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }

  async getAvailableAdmin(req: Request, res: Response) {
    try {
      const availableAdmins = await prisma.user.findMany({
        where: {
          role: {
            some: {
              role: {
                name: 'store_admin',
              },
            },
          },
          store_admins: {
            none: {},
          },
        },
      });

      res
        .status(200)
        .json({ ok: true, message: 'Success', data: availableAdmins });
    } catch {
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }

  async assignAdminToStore(req: Request, res: Response) {
    try {
      const { user_id, store_id } = req.params;
      if (!user_id || !store_id) {
        return res.status(400).json({ ok: false, message: 'Invalid request' });
      }

      const [isUserWithStoreAdmin, isStoreExists] = await Promise.all([
        prisma.userHasRole.findFirst({
          where: {
            user_id: Number(user_id),
            role: {
              name: 'store_admin',
            },
          },
        }),
        prisma.store.findFirst({
          where: {
            id: Number(store_id),
          },
        }),
      ]);

      if (!isUserWithStoreAdmin || !isStoreExists) {
        return res.status(400).json({ ok: false, message: 'Invalid request' });
      }

      const [isAlreadyAssigned, isStoreHasAdmin] = await Promise.all([
        prisma.storeHasAdmin.findFirst({
          where: {
            store_id: Number(store_id),
            user_id: Number(user_id),
          },
        }),
        prisma.storeHasAdmin.findFirst({
          where: {
            store_id: Number(store_id),
          },
        }),
      ]);

      if (isAlreadyAssigned || isStoreHasAdmin) {
        return res.status(400).json({
          ok: false,
          message: isAlreadyAssigned
            ? 'User already assigned to store'
            : 'Store already has admin',
        });
      }

      await prisma.storeHasAdmin.create({
        data: {
          store_id: Number(store_id),
          user_id: Number(user_id),
          assignee_id: Number(req.currentUser?.id),
        },
      });

      res.status(200).json({ ok: true, message: 'Success' });
    } catch {
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }

  async unassignAdminToStore(req: Request, res: Response) {
    try {
      const { user_id, store_id } = req.params;

      if (!user_id || !store_id) {
        return res.status(400).json({ ok: false, message: 'Invalid request' });
      }

      const isAlreadyAssigned = await prisma.storeHasAdmin.findFirst({
        where: {
          store_id: Number(store_id),
          user_id: Number(user_id),
        },
      });

      if (!isAlreadyAssigned) {
        return res
          .status(400)
          .json({ ok: false, message: 'User not assigned to store' });
      }

      await prisma.storeHasAdmin.delete({
        where: {
          id: isAlreadyAssigned.id,
        },
      });

      res.status(200).json({ ok: true, message: 'Success' });
    } catch {
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }

  async switchAdminStore(req: Request, res: Response) {
    try {
      const { admin_1_id, admin_2_id } = req.params;

      if (!admin_1_id || !admin_2_id) {
        return res.status(400).json({ ok: false, message: 'Invalid request' });
      }

      // TODO : Retrieve the current assignments
      const admin1Assignment = await prisma.storeHasAdmin.findFirst({
        where: {
          user_id: Number(admin_1_id),
        },
      });

      const admin2Assignment = await prisma.storeHasAdmin.findFirst({
        where: {
          user_id: Number(admin_2_id),
        },
      });

      if (!admin1Assignment || !admin2Assignment) {
        return res.status(400).json({
          ok: false,
          message: 'One or both admins are not assigned to any store',
        });
      }

      // TODO : Switch the store assignments
      await prisma.$transaction([
        prisma.storeHasAdmin.update({
          where: { id: admin1Assignment.id },
          data: { store_id: admin2Assignment.store_id },
        }),
        prisma.storeHasAdmin.update({
          where: { id: admin2Assignment.id },
          data: { store_id: admin1Assignment.store_id },
        }),
      ]);

      res
        .status(200)
        .json({ ok: true, message: 'Store assignments switched successfully' });
    } catch (error) {
      console.error('Error switching store assignments:', error);
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }
}
