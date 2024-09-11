import { Response, Request } from 'express';
import prisma from '@/prisma';
import calculateDistance from '@/utils/calculateDistance';
import { checkoutSchema } from '@/validations/checkout';

export interface CustomRequest extends Request {
  currentUser?: {
    id: number;
    email: string;
  };
}
export class CheckoutController {
  findNearestStore = async (req: CustomRequest, res: Response) => {
    try {
      const validation = checkoutSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const validatedData = checkoutSchema.parse(req.body);

      // const { productIds, quantities, addressId } = validation.data;
      const { addressId } = validation.data;

      const currentUser = req.currentUser;
      if (!currentUser) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const user = await prisma.user.findUnique({
        where: { id: currentUser.id },
        include: { addresses: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const stores = await prisma.store.findMany({
        include: {
          city: true,
          province: true,
        },
      });

      let selectedAddress = user.addresses.find(
        (address) => address.id === addressId,
      );

      let closestStore;
      if (!selectedAddress) {
        // If no address is provided or user has no address, select the 'central' store
        const centralStore = stores.find(
          (store) => store.store_type === 'central',
        );
        if (!centralStore) {
          return res.status(404).json({ error: 'No central store found' });
        }
        closestStore = centralStore;
      } else {
        closestStore = stores[0];
        let minDistance = Infinity;

        stores.forEach((store) => {
          const distance = calculateDistance(
            selectedAddress.latitude ? Number(selectedAddress.latitude) : 0,
            selectedAddress.longtitude ? Number(selectedAddress.longtitude) : 0,
            Number(store.latitude),
            Number(store.longtitude),
          );

          if (distance < minDistance) {
            minDistance = distance;
            closestStore = store;
          }
        });
      }

      return res.status(200).json({
        message: 'Checkout initiated',
        closestStore: {
          id: closestStore.id,
          name: closestStore.name,
          store_type: closestStore.store_type,
          city_id: closestStore.city_id,
          city_name: closestStore.city.city_name,
          province_name: closestStore.province?.province,
          address: closestStore.address,
          kecamatan: closestStore.kecamatan,
          kelurahan: closestStore.kelurahan,
          latitude: closestStore.latitude,
          longtitude: closestStore.longtitude,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
