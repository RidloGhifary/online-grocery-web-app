"use client";

import React, { useState, useEffect } from "react";
import { getVouchers } from "@/api/checkout/route";
import convertRupiah from "@/utils/convertRupiah";
import { useCart } from "@/context/CartContext";
import CheckoutSummary from "@/components/CheckoutSummary";
import CartItem from "@/components/CartItems";
import AddressSection from "./addressSection/AddressSection";
import { UserAddressProps, UserProps } from "@/interfaces/user";
import SelectCourier from "./deliverySection/SelectCourier";
import { useQuery } from "@tanstack/react-query";
import { getDeliveryOptions } from "@/actions/delivery";
import DeliveryService from "./deliverySection/DeliveryService";
import DeliveryNotes from "./deliverySection/DeliveryNotes";
import ErrorInfo from "@/components/ErrorInfo";
import { getNearestStore } from "@/api/checkout/route";
import { createOrder } from "@/api/checkout/route";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/features-2/ui/Modal";
import MainButton from "@/components/MainButton";

interface Props {
  user: UserProps | null;
}

const CheckOutContent: React.FC<Props> = ({ user }) => {
  const { checkoutItems, refreshCart } = useCart();
  const selectedAddressActive = user?.addresses?.find(
    (address) => address?.is_primary,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [storeCityId, setStoreCityId] = useState<number | null>(null);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [selectedCourierPrice, setSelectedCourierPrice] = useState<number>(0);
  const [selectedCourier, setSelectedCourier] = useState<string>("jne");
  const [deliveryService, setDeliveryService] = useState<number>(0);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [selectedProductVoucher, setSelectedProductVoucher] = useState<
    any | null
  >(null);
  const [selectedDeliveryVoucher, setSelectedDeliveryVoucher] = useState<
    any | null
  >(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [deliveryTotal, setDeliveryTotal] = useState<number>(0);

  const [selectedAddress, setSelectedAddress] =
    useState<UserAddressProps | null>(
      selectedAddressActive as UserAddressProps,
    );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    refreshCart();
  }, []);

  const totalWeight =
    checkoutItems.length > 0
      ? checkoutItems.reduce(
          (acc, item) => acc + item.qty * (item?.product?.unit_in_gram || 10),
          0,
        )
      : 10;
  const router = useRouter();

  const { data: nearestStoreData, error: nearestStoreError } = useQuery({
    queryKey: ["nearestStore", selectedAddress?.id],
    queryFn: () => getNearestStore(selectedAddress?.id as number),
    enabled: !!selectedAddress?.id,
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (nearestStoreData) {
      setStoreCityId(nearestStoreData.data.closestStore.city_id);
    }
  }, [nearestStoreData]);

  const {
    data: deliveryData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "deliveryData",
      selectedCourier,
      selectedAddress?.city_id,
      storeCityId,
      checkoutItems,
      totalWeight,
    ],
    queryFn: () =>
      getDeliveryOptions({
        origin: storeCityId ? storeCityId.toString() : "154",
        destination: selectedAddress?.city_id!!,
        weight: totalWeight,
        courier: selectedCourier,
      }),
    enabled:
      !!checkoutItems &&
      !!selectedCourier &&
      !!selectedAddress?.city_id &&
      !!totalWeight,
  });

  useEffect(() => {
    if (deliveryData) {
      const initialPrice =
        deliveryData?.data?.results[0]?.costs[0]?.cost[0]?.value;
      if (initialPrice) {
        setSelectedCourierPrice(initialPrice);
        setDeliveryService(initialPrice);
      }
    }
  }, [deliveryData]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await getVouchers();
        if (response.data && Array.isArray(response.data.vouchers)) {
          const allVouchers = response.data.vouchers.map((v: any) => ({
            id: v.id,
            voucher: v.voucher,
            voucher_type: v.voucher_type,
            discount_type: v.discount_type,
            product_discount: v.product_discount
              ? {
                  discount: v.product_discount.discount,
                  discount_type: v.product_discount.discount_type,
                }
              : undefined,
            type: v.type,
            discountAmount: v.discountAmount,
            discountType: v.discountType,
            delivery_discount: v.delivery_discount,
            is_delivery_free: v.is_delivery_free,
            discount_amount: v.discount_amount,
            product: v.product ? { name: v.product.name } : undefined,
            description: v.description,
          }));

          setVouchers(allVouchers);
        } else {
          console.error("Invalid voucher data format", response.data);
          setErrorMessage("Invalid voucher data format.");
        }
      } catch (error) {
        console.error("Error fetching vouchers", error);
        setErrorMessage("Error fetching vouchers. Please try again later.");
      }
    };

    fetchVouchers();
  }, []);

  useEffect(() => {
    if (checkoutItems) {
      const initialSubtotal = checkoutItems.reduce(
        (acc, item) => acc + item.qty * item.product.price,
        0,
      );
      setSubtotal(initialSubtotal);
    }
  }, [checkoutItems]);

  const handleProductVoucherSelect = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedVoucher = vouchers.find(
      (voucher) => voucher.id.toString() == e.target.value,
    );

    if (selectedVoucher) {
      const discount = selectedVoucher.product_discount?.discount || 0;
      const discountType =
        selectedVoucher.product_discount?.discount_type || "nominal";

      setSelectedProductVoucher({
        id: selectedVoucher.id,
        voucher: selectedVoucher.voucher,
        discountAmount: discount,
        discountType: discountType,
        type: "product",
      });
    }
  };

  const handleDeliveryVoucherSelect = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedVoucher = vouchers.find(
      (voucher) => voucher.id.toString() == e.target.value,
    );

    if (selectedVoucher) {
      const discount = selectedVoucher.delivery_discount || 0;
      const discountType =
        selectedVoucher.voucher_type === "delivery_free"
          ? "free"
          : "percentage";

      setSelectedDeliveryVoucher({
        id: selectedVoucher.id,
        discountAmount: discount,
        discountType: discountType,
        type: "delivery",
      });
    }
  };

  useEffect(() => {
    if (selectedProductVoucher && checkoutItems) {
      let newSubtotal = checkoutItems.reduce((acc, item) => {
        let discountedPrice = item.product.price;

        if (selectedProductVoucher) {
          const discount = selectedProductVoucher?.discountAmount || 0;
          const discountType =
            selectedProductVoucher?.discountType || "nominal";

          if (discountType === "percentage") {
            discountedPrice = item.product.price * ((100 - discount) / 100);
          } else if (discountType === "nominal") {
            discountedPrice = Math.max(0, item.product.price - discount);
          }
        }

        return acc + discountedPrice * item.qty;
      }, 0);

      setSubtotal(newSubtotal);
    }
  }, [selectedProductVoucher, checkoutItems]);

  // useEffect(() => {
  //   if (selectedProductVoucher && checkoutItems) {
  //     let newSubtotal = checkoutItems.reduce(
  //       (acc, item) => acc + item.qty * item.product.price,
  //       0,
  //     );
  //     const discount = selectedProductVoucher?.discountAmount || 0;
  //     const discountType = selectedProductVoucher?.discountType || "nominal";
  //     if (discountType === "percentage") {
  //       newSubtotal = newSubtotal * ((100 - discount) / 100);
  //     } else if (discountType === "nominal") {
  //       newSubtotal = Math.max(0, newSubtotal - discount);
  //     }
  //     setSubtotal(newSubtotal);
  //   }
  // }, [selectedProductVoucher, checkoutItems]);

  useEffect(() => {
    if (selectedDeliveryVoucher && selectedCourierPrice > 0) {
      const discount = selectedDeliveryVoucher?.discountAmount || 0;
      const discountType =
        selectedDeliveryVoucher?.discountType || "percentage";

      if (discountType === "free") {
        setDeliveryTotal(0);
      } else if (discountType === "percentage") {
        const discountedDelivery = selectedCourierPrice * (1 - discount / 100);
        setDeliveryTotal(Math.max(0, discountedDelivery));
      }
    } else if (selectedCourierPrice > 0) {
      setDeliveryTotal(selectedCourierPrice);
    }
  }, [selectedDeliveryVoucher, selectedCourierPrice]);

  const handleCreateOrder = async () => {
    try {
      const orderData = {
        userId: user?.id as number,
        checkoutItems: checkoutItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.qty,
          price: item.product.price,
        })),
        selectedAddressId: selectedAddress?.id as number,
        storeId: nearestStoreData?.data?.closestStore.id as number,
        selectedCourier,
        selectedCourierPrice: deliveryTotal,
        note: deliveryNotes,
        productVoucherId: selectedProductVoucher
          ? selectedProductVoucher.id
          : null,
        deliveryVoucherId: selectedDeliveryVoucher
          ? selectedDeliveryVoucher.id
          : null,
      };

      const response = await createOrder(orderData);

      if (response.status === 200) {
        router.push(`/user/orders`);
      } else {
        console.error("Failed to create order: ", response.data);
        setErrorMessage("Failed to create order. Please try again.");
      }
    } catch (error: any) {
      console.error("Error creating order: ", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Error creating order. Please try again.",
      );
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    handleCreateOrder();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto mb-20 h-[150vh] lg:h-screen p-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {nearestStoreData && nearestStoreData.data && (
            <p className="mt-4 text-lg font-semibold">
              Your order will be sent from{" "}
              {nearestStoreData.data.closestStore.name} in{" "}
              {nearestStoreData.data.closestStore.city_name}.
            </p>
          )}
          <AddressSection
            user={user}
            setSelectedAddress={setSelectedAddress}
            selectedAddress={selectedAddress}
          />
          <h2 className="mt-6 text-xl font-bold">Your Orders</h2>
          {checkoutItems.map((item) => (
            <CartItem
              key={item.product_id}
              item={item}
              showQuantityPrice={true}
              showButtons={false}
              showCheckbox={false}
            />
          ))}
        </div>
        <div className="lg:col-span-2">
          {error && (
            <ErrorInfo error="Something went wrong, try again later!" />
          )}
          <div className="space-y-4 rounded-md bg-white p-4 shadow-md">
            <SelectCourier
              selectedCourier={selectedCourier}
              setSelectedCourier={setSelectedCourier}
            />
            {isLoading && (
              <p className="rounded-md border p-3 text-center">
                Wait a second...
              </p>
            )}
            {!isLoading &&
              deliveryData &&
              deliveryData?.data?.status?.description === "OK" && (
                <DeliveryService
                  deliveryService={deliveryService}
                  setDeliveryService={setDeliveryService}
                  deliveryData={deliveryData?.data?.results[0]?.costs}
                  setSelectedCourierPrice={setSelectedCourierPrice}
                />
              )}
            <DeliveryNotes
              deliveryNotes={deliveryNotes}
              onNotesChange={setDeliveryNotes}
            />
          </div>
          <CheckoutSummary
            items={checkoutItems}
            deliveryPrice={selectedCourierPrice}
            selectedProductVoucher={selectedProductVoucher}
            selectedDeliveryVoucher={selectedDeliveryVoucher}
            showDeliveryPrice={true}
            buttonText="Proceed to Payment"
            onCheckout={handleOpenModal}
            onProductVoucherSelect={handleProductVoucherSelect}
            onDeliveryVoucherSelect={handleDeliveryVoucherSelect}
            subtotal={subtotal}
            deliveryTotal={deliveryTotal}
            productVouchers={vouchers.filter(
              (v) =>
                v.voucher_type === "buy_n_get_n" ||
                v.voucher_type === "product_discount",
            )}
            deliveryVouchers={vouchers.filter(
              (v) =>
                v.voucher_type === "delivery_discount" ||
                v.voucher_type === "delivery_free",
            )}
          />
        </div>
      </div>
      <Modal
        show={isModalOpen}
        closeButton={false}
        onClose={() => setIsModalOpen(false)}
      >
        <div>
          <h2 className="mb-4 text-center text-lg font-semibold">
            Confirm Your Order
          </h2>
          <p>
            <strong>Delivery Address:</strong> {selectedAddress?.address},{" "}
            {selectedAddress?.city?.city_name},{selectedAddress?.postal_code}.
          </p>
          <p>
            <strong>From Store:</strong>{" "}
            {nearestStoreData?.data?.closestStore.name},{" "}
            {nearestStoreData?.data?.closestStore.city_name}.
          </p>
          <h3 className="font-semibold">Your Items:</h3>
          <ul>
            {checkoutItems.map((item) => (
              <li key={item.product_id}>
                {item.product.name} x {item.qty}
              </li>
            ))}
          </ul>
          <p>
            <strong>Courier:</strong>{" "}
            <span className="uppercase">{selectedCourier}</span>
          </p>
          <p>
            <strong>Subtotal:</strong> {convertRupiah(subtotal)}
          </p>
          <p>
            <strong>Delivery Price:</strong> {convertRupiah(deliveryTotal)}
          </p>
          <p>
            <strong>Total:</strong> {convertRupiah(subtotal + deliveryTotal)}
          </p>
        </div>
        <div className="modal-action flex justify-center">
          <MainButton
            onClick={() => {
              setIsModalOpen(false);
            }}
            text="Cancel"
            variant="danger"
          />
          <MainButton
            onClick={handleModalConfirm}
            text="Yes"
            variant="primary"
          />
        </div>
      </Modal>
      {errorMessage && (
        <div className="mt-auto mb-4 text-center text-red-600 font-semibold">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default CheckOutContent;
