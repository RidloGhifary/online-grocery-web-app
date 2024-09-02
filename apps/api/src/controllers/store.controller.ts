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

      const isCitySame = await prisma.store.findFirst({
        where: {
          city: {
            id: city_id,
          },
        },
      });

      if (isCitySame) {
        return res
          .status(400)
          .json({ ok: false, message: 'Store in this city already exists' });
      }

      if (store_type === 'branch') {
        const isUserHasCentralStore = await prisma.store.findFirst({
          where: {
            created_by: Number(req.currentUser?.id),
            store_type: 'central',
          },
        });

        if (!isUserHasCentralStore) {
          return res
            .status(400)
            .json({ ok: false, message: 'User must have a central store' });
        }
      }

      // TODO: SEARCH LATITUDE AND LONGITUDE FROM ADDRESS
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

  async updateStore(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, image, store_type, province, province_id, city, city_id } =
        req.body;

      // Check user permissions
      const { ok, message } = await getUserPermission({
        user_id: req.currentUser?.id,
        role: 'super_admin',
        permission: 'update_store',
      });

      if (!ok) {
        return res.status(400).json({ ok, message });
      }

      // Find the store the user wants to update
      const currentStore = await prisma.store.findUnique({
        where: {
          id: Number(id),
          created_by: Number(req.currentUser?.id),
        },
      });

      // If store is not found
      if (!currentStore) {
        return res.status(404).json({ ok: false, message: 'Store not found' });
      }

      // Check if the city is already taken by another store
      const existingStoreInCity = await prisma.store.findFirst({
        where: {
          city_id: city_id,
          id: {
            not: Number(id),
          },
        },
      });

      if (existingStoreInCity) {
        return res.status(400).json({
          ok: false,
          message: 'A store in the specified city already exists.',
        });
      }

      // Initialize variables for latitude and longitude
      let latitude = currentStore.latitude;
      let longitude = currentStore.longtitude;

      // Check if city or province has changed
      if (
        currentStore.city_id !== city_id ||
        currentStore.province_id !== province_id
      ) {
        // Search for new coordinates
        const storeGeo = await getCoordinates({ city, province });

        if (!storeGeo) {
          return res
            .status(400)
            .json({ ok: false, message: 'Invalid address' });
        }

        latitude = storeGeo.latitude;
        longitude = storeGeo.longtitude;
      }

      // Proceed with the update
      const updatedStore = await prisma.store.update({
        where: { id: Number(id) },
        data: {
          name,
          image,
          store_type,
          province_id,
          city_id,
          latitude,
          longtitude: longitude,
        },
      });

      res.status(200).json({
        ok: true,
        message: 'Store updated successfully',
        data: updatedStore,
      });
    } catch {
      res.status(500).json({ ok: false, message: 'Something went wrong' });
    }
  }

  async deleteStore(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check user permissions
      const { ok, message } = await getUserPermission({
        user_id: req.currentUser?.id,
        role: 'super_admin',
        permission: 'delete_store',
      });

      if (!ok) {
        return res.status(400).json({ ok, message });
      }

      // Find the store the user wants to delete
      const currentStore = await prisma.store.findUnique({
        where: {
          id: Number(id),
          created_by: Number(req.currentUser?.id),
        },
      });

      // If store is not found
      if (!currentStore) {
        return res.status(404).json({ ok: false, message: 'Store not found' });
      }

      // Check if the store is a central store
      if (currentStore.store_type === 'central') {
        // Check if the user has any branch stores
        const branchStores = await prisma.store.findMany({
          where: {
            created_by: Number(req.currentUser?.id),
            store_type: 'branch',
          },
        });

        // If branch stores exist, prevent deletion
        if (branchStores.length > 0) {
          return res.status(400).json({
            ok: false,
            message: 'Cannot delete central store while branch stores exist',
          });
        }
      }

      // If no branch stores exist or store is not central, proceed with deletion
      await prisma.store.delete({
        where: {
          id: Number(id),
        },
      });

      res.status(200).json({ ok: true, message: 'Store deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: 'Something went wrong' });
    }
  }
}
