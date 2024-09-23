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
import { Modal } from "@/components/Modal";
import MainButton from "@/components/MainButton";

interface Props {
  user: UserProps | null;
}

type SelectedVoucher = {
  id: number;
  discountAmount: number;
  discountType: string;
  type: "product" | "delivery";
};

interface Voucher {
  id: string;
  code: string;
  voucher_type: string;
  discount_type: string;
  discount_amount: number;
}

const CheckOutContent: React.FC<Props> = ({ user }) => {
  const { checkoutItems, refreshCart } = useCart();
  const selectedAddressActive = user?.addresses?.find(
    (address) => address?.is_primary,
  );

  const [storeCityId, setStoreCityId] = useState<number | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedCourierPrice, setSelectedCourierPrice] = useState<number>(0);
  const [selectedCourier, setSelectedCourier] = useState<string>("jne");
  const [deliveryService, setDeliveryService] = useState<number>(0);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [selectedProductVoucher, setSelectedProductVoucher] =
    useState<SelectedVoucher | null>(null);
  const [selectedDeliveryVoucher, setSelectedDeliveryVoucher] =
    useState<SelectedVoucher | null>(null);
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

  console.log(checkoutItems);

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
        if (response.data && response.data.vouchers) {
          const allVouchers = response.data.vouchers;
          console.log(allVouchers);
          setVouchers(allVouchers);
        }
      } catch (error) {
        console.error("Error fetching vouchers", error);
      }
    };

    fetchVouchers();
  }, []);

  console.log(vouchers);

  useEffect(() => {
    if (checkoutItems) {
      const initialSubtotal = checkoutItems.reduce(
        (acc, item) => acc + item.qty * item.product.price,
        0,
      );
      console.log("Initial Subtotal:", initialSubtotal);
      setSubtotal(initialSubtotal);
    }
  }, [checkoutItems]);

  const handleProductVoucherSelect = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedVoucher = vouchers.find(
      (voucher) => voucher.id == e.target.value,
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
      (voucher) => voucher.id == e.target.value,
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
      console.log(checkoutItems);
      let newSubtotal = checkoutItems.reduce(
        (acc, item) => acc + item.qty * item.product.price,
        0,
      );
      console.log(`the pre-calculation subtotal is: ${newSubtotal}`);
      const discount = parseInt(selectedProductVoucher?.discountAmount) || 0;
      console.log(discount);
      const discountType = selectedProductVoucher?.discountType || "nominal";
      console.log(discountType);
      if (discountType === "percentage") {
        newSubtotal = newSubtotal * (1 - discount / 100);
      } else if (discountType === "nominal") {
        newSubtotal = Math.max(0, newSubtotal - discount);
      }
      console.log(`post-calculation subtotal is: ${newSubtotal}`);
      setSubtotal(newSubtotal);
    }
  }, [selectedProductVoucher, checkoutItems]);

  useEffect(() => {
    if (selectedDeliveryVoucher && selectedCourierPrice > 0) {
      console.log("Selected Delivery Voucher:", selectedDeliveryVoucher);

      const discount = parseInt(selectedDeliveryVoucher?.discountAmount) || 0;
      const discountType =
        selectedDeliveryVoucher?.discountType || "percentage";
      console.log(`Delivery discount: ${discount}, Type: ${discountType}`);

      if (discountType === "free") {
        setDeliveryTotal(0);
      } else if (discountType === "percentage") {
        const discountedDelivery = selectedCourierPrice * (1 - discount / 100);
        setDeliveryTotal(Math.max(0, discountedDelivery));
        console.log(
          `Post-calculation delivery total is: ${discountedDelivery}`,
        );
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
        selectedCourierPrice,
        note: deliveryNotes,
      };

      const response = await createOrder(orderData);

      if (response.status === 200) {
        router.push(`/user/orders`);
      } else {
        console.log("Failed to create order: ", response.data);
      }
    } catch (error: any) {
      console.error("Error creating order: ", error);
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
    <div className="container mx-auto mb-20 h-screen p-4">
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
            <strong>Subtotal:</strong>{" "}
            {convertRupiah(
              checkoutItems.reduce(
                (acc, item) => acc + item.qty * item.product.price,
                0,
              ),
            )}
          </p>
          <p>
            <strong>Delivery Price:</strong>{" "}
            {convertRupiah(selectedCourierPrice)}
          </p>
          <p>
            <strong>Total:</strong>{" "}
            {convertRupiah(
              checkoutItems.reduce(
                (acc, item) => acc + item.qty * item.product.price,
                0,
              ) + selectedCourierPrice,
            )}
          </p>
        </div>
        <div className="modal-action flex justify-center">
          <MainButton
            onClick={() => setIsModalOpen(false)}
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
    </div>
  );
};

export default CheckOutContent;
