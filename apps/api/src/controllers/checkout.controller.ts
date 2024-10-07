import { Response, Request } from 'express';
import prisma from '@/prisma';
import calculateDistance from '@/utils/calculateDistance';
import { checkoutSchema } from '@/validations/checkout';
import { stockMutationSchema } from '@/validations/checkout';
import { createOrderSchema } from '@/validations/checkout';
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

    const selectedStore = await prisma.store.findUnique({
      where: { id: selectedStoreId },
      select: { latitude: true, longtitude: true, city_id: true },
    });

    if (!selectedStore) {
      throw new Error('Selected store not found.');
    }

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
      return null;
    }

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
        productVoucherId,
        deliveryVoucherId,
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

      let totalVoucherDiscount = 0;

      let productVoucher = null;
      if (productVoucherId) {
        productVoucher = await prisma.voucher.findUnique({
          where: { id: productVoucherId },
          include: { product_discount: true },
        });
      }

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
            create: checkoutItems.map((item) => {
              let discountedPrice = item.price;

              if (productVoucher) {
                const productDiscount = productVoucher.product_discount;
                if (productDiscount) {
                  if (productDiscount.discount_type === 'percentage') {
                    discountedPrice =
                      item.price * ((100 - productDiscount.discount) / 100);
                  } else if (productDiscount.discount_type === 'nominal') {
                    discountedPrice = item.price - productDiscount.discount;
                  }
                }
                totalVoucherDiscount +=
                  (item.price - discountedPrice) * item.quantity;
              }

              return {
                product_id: item.product_id,
                qty: item.quantity,
                store_id: storeId,
                price: discountedPrice,
                sub_total: discountedPrice * item.quantity,
              };
            }),
          },
        },
        include: { order_details: true },
      });

      if (productVoucherId && productVoucher) {
        await prisma.usersVoucher.create({
          data: {
            user_id: currentUser.id,
            voucher_id: productVoucherId,
            used_at: new Date(),
          },
        });

        await prisma.orderHasVoucher.create({
          data: {
            order_id: newOrder.id,
            voucher_id: productVoucherId,
            nominal: totalVoucherDiscount,
          },
        });
      }

      const invoice = `INV-${newOrder.id.toString().padStart(7, '0')}`;
      await prisma.order.update({
        where: { id: newOrder.id },
        data: { invoice },
      });

      const orderDetails = newOrder.order_details;

      for (const item of checkoutItems) {
        const productStock = await prisma.storeHasProduct.findFirst({
          where: { store_id: storeId, product_id: item.product_id },
        });

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
          await prisma.storeHasProduct.update({
            where: { id: productStock.id },
            data: { qty: { decrement: item.quantity } },
          });

          await prisma.stocksAdjustment.create({
            data: {
              qty_change: -item.quantity,
              type: 'checkout',
              managed_by_id: storeAdmin.user_id,
              product_id: item.product_id,
              detail: `checkout for product ${item.product_id} in store ${storeId}`,
              destinied_store_id: storeId,
              order_detail_id: orderDetail.id,
            },
          });
        } else if (
          productStock &&
          productStock.qty !== null &&
          productStock.qty < item.quantity
        ) {
          const qtyNeeded = item.quantity - (productStock.qty ?? 0);
          const closestStoreId = await this.findClosestStoreForStockMutation(
            storeId,
            item.product_id,
            qtyNeeded,
          );

          if (closestStoreId) {
            await prisma.storeHasProduct.update({
              where: { id: productStock.id },
              data: { qty: { decrement: productStock.qty ?? 0 } },
            });

            const aidingProductStock = await prisma.storeHasProduct.findFirst({
              where: { store_id: closestStoreId, product_id: item.product_id },
            });

            if (aidingProductStock) {
              await prisma.storeHasProduct.update({
                where: { id: aidingProductStock.id },
                data: { qty: { decrement: qtyNeeded } },
              });

              await prisma.stocksAdjustment.create({
                data: {
                  qty_change: -(productStock.qty ?? 0),
                  type: 'checkout',
                  managed_by_id: storeAdmin.user_id,
                  product_id: item.product_id,
                  detail: `checkout for product ${item.product_id} in store ${storeId}`,
                  destinied_store_id: storeId,
                  order_detail_id: orderDetail.id,
                },
              });

              await prisma.stocksAdjustment.create({
                data: {
                  qty_change: -qtyNeeded,
                  type: 'checkout',
                  managed_by_id: storeAdmin.user_id,
                  product_id: item.product_id,
                  detail: `mutation for order detail of ${orderDetail.id} from store ${closestStoreId} for checkout in store ${storeId}`,
                  from_store_id: closestStoreId,
                  destinied_store_id: storeId,
                  order_detail_id: orderDetail.id,
                  mutation_type: 'pending',
                },
              });
            }
          }
        }
      }

      if (deliveryVoucherId) {
        const finalDeliveryCost = selectedCourierPrice;

        const totalProductSubTotal = orderDetails.reduce(
          (sum, detail) => sum + detail.sub_total,
          0,
        );

        const updatedOrderDetails = orderDetails.map((detail) => {
          const itemDeliveryCost =
            (detail.sub_total / totalProductSubTotal) * finalDeliveryCost;

          const newSubTotal = detail.sub_total + itemDeliveryCost;

          return {
            id: detail.id,
            sub_total: newSubTotal,
          };
        });

        const updatePromises = updatedOrderDetails.map((detail) =>
          prisma.orderDetail.update({
            where: { id: detail.id },
            data: { sub_total: detail.sub_total },
          }),
        );

        await Promise.all(updatePromises);

        await prisma.usersVoucher.create({
          data: {
            user_id: currentUser.id,
            voucher_id: deliveryVoucherId,
            used_at: new Date(),
          },
        });

        await prisma.orderHasVoucher.create({
          data: {
            order_id: newOrder.id,
            voucher_id: deliveryVoucherId,
            nominal: finalDeliveryCost,
          },
        });
      } else {
        const finalDeliveryCost = selectedCourierPrice;

        const updatedOrderDetails = orderDetails.map((detail) => {
          const newSubTotal = detail.sub_total + finalDeliveryCost;
          return {
            id: detail.id,
            sub_total: newSubTotal,
          };
        });

        const updatePromises = updatedOrderDetails.map((detail) =>
          prisma.orderDetail.update({
            where: { id: detail.id },
            data: { sub_total: detail.sub_total },
          }),
        );

        await Promise.all(updatePromises);
      }
      return res.status(200).json(newOrder);
    } catch (error) {
      console.error('Error in createOrder:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  getVouchers = async (req: CustomRequest, res: Response) => {
    try {
      const currentUser = req.currentUser;
      if (!currentUser) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const currentDate = new Date();

      const vouchers = await prisma.voucher.findMany({
        where: {
          started_at: { lte: currentDate },
          end_at: { gte: currentDate },
        },
        include: {
          product: true,
          product_discount: true,
        },
      });

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
              applicableProducts = ['All Products'];
            } else if (product_id) {
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

      return res.status(200).json({ vouchers: processedVouchers });
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: 'Validation Error', errors: error.errors });
      }
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}
