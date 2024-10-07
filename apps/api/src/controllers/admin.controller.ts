import { Request, Response } from 'express';
import prisma from '@/prisma';
import { adminRepository } from '@/repositories/admin.repository';
import { User } from '@prisma/client';
import { UserInputInterface } from '@/interfaces/UserInterface';

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

  async getAllAdmin (req: Request, res: Response) :  Promise<Response|void> {
    const { search, order, order_field } = req.query;
    const { page = 1, limit = 20 } = req.query;
    const data = await adminRepository.getAllAdmin({
      search: search as string,
      order: order as 'asc' | 'desc',
      orderField: order_field as 'name' ,
      pageNumber : page as number,
      limitNumber : limit as number
    })
    if (!data.ok) {
      return res.status(400).send(data);
    }
    return res.status(200).send(data);
  }

  async getAllCustomer (req: Request, res: Response) :  Promise<Response|void> {
    const { search, order, order_field } = req.query;
    const { page = 1, limit = 20 } = req.query;
    const data = await adminRepository.getAllCustomer({
      search: search as string,
      order: order as 'asc' | 'desc',
      orderField: order_field as 'name' ,
      pageNumber : page as number,
      limitNumber : limit as number
    })
    // console.log('customer controller');
    
    // console.log(data);
    
    if (!data.ok) {
      return res.status(400).send(data);
    }
    return res.status(200).send(data);
  }

  public async createAdmin(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const admin: User = req.body;
    // console.log(admin);
    
    const newData = await adminRepository.createAdmin(admin);
    if (!newData.ok) {
      return res.status(400).send(newData);
    }
    return res.status(201).send(newData);
  }
  
  public async updateAdmin(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const admin: UserInputInterface = req.body;
    // console.log(admin);
    
    const updatedData = await adminRepository.updateAdmin(admin);
    if (!updatedData.ok) {
      return res.status(400).send(updatedData);
    }
    return res.status(201).send(updatedData);
  }

  public async deleteAdmin(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const {id}  = req.params
    const admin = await adminRepository.deleteAdmin(Number(id))
    if (!admin.ok) {
      return res.status(500).send(admin);
    }
    return res.status(201).send(admin);
  }

}
