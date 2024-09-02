import prisma from '@/prisma';
import { Request, Response } from 'express';
import getCoordinates from '@/utils/getUserCoordinates';
import getUserPermission from '@/utils/getUserPermission';

export class StoreController {
  async createStore(req: Request, res: Response) {
    try {
      const {
        name,
        image,
        store_type,
        province,
        province_id,
        city,
        city_id,
        address,
        kelurahan,
        kecamatan,
      } = req.body;

      const { ok, message } = await getUserPermission({
        user_id: req.currentUser?.id,
        role: 'super_admin',
        permission: 'create_store',
      });

      if (!ok) {
        return res.status(400).json({ ok, message });
      }

      // TODO: SEARCH LATITUTE AND LONGITUDE FROM ADDRESS
      const storeGeo = await getCoordinates({ city, province });

      if (!storeGeo) {
        return res.status(400).json({ ok: false, message: 'Invalid address' });
      }

      // TODO: CREATE STORE
      await prisma.store.create({
        data: {
          created_by: Number(req.currentUser?.id),
          name,
          image,
          store_type,
          province_id,
          city_id,
          address,
          kelurahan,
          kecamatan,
          latitude: storeGeo.latitude,
          longtitude: storeGeo.longtitude,
        },
      });

      res.status(201).json({ ok: true, message: 'Store created' });
    } catch {
      res.status(500).json({ ok: false, message: 'Something went wrong' });
    }
  }

  async deleteStore(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { ok, message } = await getUserPermission({
        user_id: req.currentUser?.id,
        role: 'super_admin',
        permission: 'delete_store',
      });

      if (!ok) {
        return res.status(400).json({ ok, message });
      }

      // TODO: DELETE STORE
      await prisma.store.delete({
        where: {
          id: Number(id),
        },
      });

      res.status(200).json({ ok: true, message: 'Store deleted' });
    } catch {
      res.status(500).json({ ok: false, message: 'Something went wrong' });
    }
  }
}
