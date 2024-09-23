import { Response, Request } from 'express';
import prisma from '@/prisma';
import calculateDistance from '@/utils/calculateDistance';
import { checkoutSchema } from '@/validations/checkout';
import { stockMutationSchema } from '@/validations/checkout';
import { createOrderSchema } from '@/validations/order';
import { getVouchersSchema } from '@/validations/checkout';
import { getVoucherByIdSchema } from '@/validations/checkout';
import nodeSchedule from 'node-schedule';
import { ZodError } from 'zod';

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

  findClosestStoreForStockMutation = async (
    selectedStoreId: number,
    productId: number,
    qtyNeeded: number,
  ): Promise<number | null> => {
    // Validate the inputs using the Zod schema
    const validation = stockMutationSchema.safeParse({
      selectedStoreId,
      productId,
      qtyNeeded,
    });

    if (!validation.success) {
      throw new Error(
        'Invalid input data: ' + JSON.stringify(validation.error.errors),
      );
    }

    // Fetch the selected store's coordinates and city_id
    const selectedStore = await prisma.store.findUnique({
      where: { id: selectedStoreId },
      select: { latitude: true, longtitude: true, city_id: true },
    });

    if (!selectedStore) {
      throw new Error('Selected store not found.');
    }

    // Fetch all stores in the same city (excluding the selected store) that have enough stock for the product
    const storesWithEnoughStock = await prisma.storeHasProduct.findMany({
      where: {
        product_id: productId,
        qty: { gte: qtyNeeded },
        store: {
          city_id: selectedStore.city_id,
          id: { not: selectedStoreId },
        },
      },
      select: {
        store: {
          select: {
            id: true,
            latitude: true,
            longtitude: true,
          },
        },
        qty: true,
      },
    });

    if (storesWithEnoughStock.length === 0) {
      return null; // No store found with enough stock
    }

    // Convert latitude/longitude from Decimal to number for distance calculation
    const selectedStoreLatitude = selectedStore.latitude.toNumber();
    const selectedStoreLongitude = selectedStore.longtitude.toNumber();

    let closestStore = storesWithEnoughStock[0].store;

    if (!closestStore || !closestStore.latitude || !closestStore.longtitude) {
      return null;
    }

    let minDistance = calculateDistance(
      selectedStoreLatitude,
      selectedStoreLongitude,
      closestStore.latitude.toNumber(),
      closestStore.longtitude.toNumber(),
    );

    storesWithEnoughStock.forEach(({ store }) => {
      if (store && store.latitude && store.longtitude) {
        const distance = calculateDistance(
          selectedStoreLatitude,
          selectedStoreLongitude,
          store.latitude.toNumber(),
          store.longtitude.toNumber(),
        );

        if (distance < minDistance) {
          closestStore = store;
          minDistance = distance;
        }
      }
    });

    return closestStore?.id || null;
  };

  createOrder = async (req: CustomRequest, res: Response) => {
    try {
      const validation = createOrderSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const {
        userId,
        checkoutItems,
        selectedAddressId,
        storeId,
        selectedCourier,
        selectedCourierPrice,
        note,
      } = validation.data;

      const currentUser = req.currentUser;
      if (!currentUser) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const storeAdmin = await prisma.storeHasAdmin.findFirst({
        where: { store_id: storeId },
        select: { user_id: true },
      });

      if (!storeAdmin) {
        return res.status(400).json({ error: 'No admin found for this store' });
      }

      const expedition = await prisma.expedition.findFirst({
        where: { name: selectedCourier },
        select: { id: true },
      });

      if (!expedition) {
        return res.status(400).json({ message: 'Expedition not found' });
      }

      // Create the order and order details
      const newOrder = await prisma.order.create({
        data: {
          invoice: 'INV-TEMPDATA',
          customer_id: userId,
          managed_by_id: storeAdmin.user_id,
          store_id: storeId,
          expedition_id: expedition.id,
          order_status_id: 1,
          address_id: selectedAddressId,
          note,
          order_details: {
            create: checkoutItems.map((item) => ({
              product_id: item.product_id,
              qty: item.quantity,
              store_id: storeId,
              price: item.price,
              sub_total: item.price * item.quantity + selectedCourierPrice,
            })),
          },
        },
        include: {
          order_details: true, // Include the created OrderDetails
        },
      });

      // Update the invoice with the correct order id
      const invoice = `INV-${newOrder.id.toString().padStart(7, '0')}`;
      await prisma.order.update({
        where: { id: newOrder.id },
        data: { invoice },
      });

      // Fetch the created OrderDetails for further processing
      const orderDetails = newOrder.order_details; // OrderDetails included above

      // Process each checkout item for stock adjustment or mutation
      for (const item of checkoutItems) {
        const productStock = await prisma.storeHasProduct.findFirst({
          where: {
            store_id: storeId,
            product_id: item.product_id,
          },
        });

        // Find the corresponding OrderDetail for the current item
        const orderDetail = orderDetails.find(
          (detail) =>
            detail.product_id === item.product_id &&
            detail.store_id === storeId,
        );

        if (!orderDetail) {
          return res
            .status(400)
            .json({ error: 'Order detail not found for this item' });
        }

        if (
          productStock &&
          productStock.qty !== null &&
          productStock.qty >= item.quantity
        ) {
          // Regular stock adjustment: enough stock in the selected store
          await prisma.storeHasProduct.update({
            where: { id: productStock.id }, // Use 'id' as unique identifier
            data: {
              qty: { decrement: item.quantity },
            },
          });

          await prisma.stocksAdjustment.create({
            data: {
              qty_change: -item.quantity,
              type: 'checkout',
              managed_by_id: storeAdmin.user_id,
              product_id: item.product_id,
              detail: `checkout for product ${item.product_id} in store ${storeId}`,
              destinied_store_id: storeId,
              order_detail_id: orderDetail.id, // Use the OrderDetail ID
            },
          });
        } else if (
          productStock &&
          productStock.qty !== null &&
          productStock.qty < item.quantity
        ) {
          // Stock mutation: not enough stock in the selected store, find a nearby store
          const qtyNeeded = item.quantity - (productStock.qty ?? 0); // Handle nullable qty
          const closestStoreId = await this.findClosestStoreForStockMutation(
            storeId,
            item.product_id,
            qtyNeeded,
          );

          if (closestStoreId) {
            // Decrement available stock in the original store
            await prisma.storeHasProduct.update({
              where: { id: productStock.id }, // Use 'id' instead of 'store_id_product_id'
              data: {
                qty: { decrement: productStock.qty ?? 0 },
              },
            });

            // Decrement stock in the closest aiding store
            const aidingProductStock = await prisma.storeHasProduct.findFirst({
              where: {
                store_id: closestStoreId,
                product_id: item.product_id,
              },
            });

            if (aidingProductStock) {
              await prisma.storeHasProduct.update({
                where: { id: aidingProductStock.id }, // Use unique 'id'
                data: {
                  qty: { decrement: qtyNeeded },
                },
              });

              // Log stock adjustment for the original store
              await prisma.stocksAdjustment.create({
                data: {
                  qty_change: -(productStock.qty ?? 0),
                  type: 'checkout',
                  managed_by_id: storeAdmin.user_id,
                  product_id: item.product_id,
                  detail: `checkout for product ${item.product_id} in store ${storeId}`,
                  destinied_store_id: storeId,
                  order_detail_id: orderDetail.id, // Use the OrderDetail ID
                },
              });

              // Log stock mutation from the closest aiding store
              await prisma.stocksAdjustment.create({
                data: {
                  qty_change: -qtyNeeded,
                  type: 'checkout',
                  managed_by_id: storeAdmin.user_id,
                  product_id: item.product_id,
                  detail: `mutation for order detail of ${orderDetail.id} from store ${closestStoreId} for checkout in store ${storeId}`,
                  from_store_id: closestStoreId,
                  destinied_store_id: storeId,
                  order_detail_id: orderDetail.id, // Use the OrderDetail ID
                  mutation_type: 'pending',
                },
              });
            }
          }
        }
      }

      return res.status(200).json(newOrder);
    } catch (error) {
      console.error('Error in createOrder:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  getVouchers = async (req: CustomRequest, res: Response) => {
    try {
      // Validate the request using Zod
      const currentUser = req.currentUser;
      if (!currentUser) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get the current date
      const currentDate = new Date();

      // Retrieve all vouchers that are active within the current date
      const vouchers = await prisma.voucher.findMany({
        where: {
          started_at: { lte: currentDate },
          end_at: { gte: currentDate },
        },
        include: {
          product: true, // Include related product if needed
          product_discount: true, // Include related product discount if needed
        },
      });

      // Process vouchers based on their types
      const processedVouchers = vouchers.map((voucher) => {
        const {
          voucher_type,
          is_all_get,
          product_id,
          buy_n_qty,
          get_n_qty,
          product_discount,
          delivery_discount,
          is_delivery_free,
        } = voucher;

        let applicableProducts: string[] = [];

        switch (voucher_type) {
          case 'buy_n_get_n':
            if (is_all_get) {
              // Apply to all products in the cart
              applicableProducts = ['All Products'];
            } else if (product_id) {
              // Apply to a specific product
              applicableProducts = [`Product ID: ${product_id}`];
            }
            break;

          case 'product_discount':
            if (is_all_get) {
              applicableProducts = ['All Products'];
            } else if (product_id) {
              applicableProducts = [`Product ID: ${product_id}`];
            }

            const discountValue = product_discount?.discount ?? 0;
            const discountType = product_discount?.discount_type ?? '';

            if (discountType === 'nominal') {
              return {
                ...voucher,
                discount: `${discountValue} off per product`,
              };
            } else if (discountType === 'percentage') {
              return {
                ...voucher,
                discount: `${discountValue}% off`,
              };
            }
            break;

          case 'delivery_free':
            return {
              ...voucher,
              deliveryPrice: 0,
              description: 'Free delivery for this order',
            };

          case 'delivery_discount':
            const deliveryDiscount = delivery_discount ?? 0;
            return {
              ...voucher,
              deliveryDiscount: `${deliveryDiscount}% off delivery`,
            };

          default:
            return voucher;
        }

        return {
          ...voucher,
          applicableProducts,
        };
      });

      // Send the processed vouchers to the client
      return res.status(200).json({ vouchers: processedVouchers });
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: 'Validation Error', errors: error.errors });
      }
      console.error(error); // Log the unknown error for debugging
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  getVoucherById = async (req: CustomRequest, res: Response) => {
    try {
      // Ensure voucherId is a number
      const voucherId = parseInt(req.params.voucherId, 10);

      // Get current user (assumes this middleware is already in place)
      const currentUser = req.currentUser;
      if (!currentUser) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Fetch voucher by ID, ensuring it belongs to the user or is available for all
      const voucher = await prisma.voucher.findFirst({
        where: {
          id: voucherId, // Directly pass voucherId here
          OR: [
            { is_all_get: true }, // Available for all users
            { product_id: { not: null } }, // Adjust according to logic
          ],
          started_at: {
            lte: new Date(), // Ensure voucher has started
          },
          end_at: {
            gte: new Date(), // Ensure voucher has not expired
          },
        },
        include: {
          product_discount: true, // Correct field name (from Prisma schema)
        },
      });

      if (!voucher) {
        return res.status(404).json({ error: 'Voucher not found' });
      }

      return res.status(200).json({ voucher });
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: 'Validation Error', errors: error.errors });
      }
      console.error(error); // Log unknown error
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}
