"use client";

import React, { useState, useEffect } from "react";
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
import { createOrder } from "@/api/order/route";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/Modal";
import MainButton from "@/components/MainButton";

interface Props {
  user: UserProps | null;
}

const CheckOutContent: React.FC<Props> = ({ user }) => {
  const { checkoutItems, refreshCart } = useCart();
  const selectedAddressActive = user?.addresses?.find(
    (address) => address?.is_primary,
  );

  const [storeCityId, setStoreCityId] = useState<number | null>(null);
  const [selectedCourierPrice, setSelectedCourierPrice] = useState<number>(0);
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<string>("jne");
  const [deliveryService, setDeliveryService] = useState<number>(0);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [selectedAddress, setSelectedAddress] =
    useState<UserAddressProps | null>(
      selectedAddressActive as UserAddressProps,
    );
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const totalWeight =
    checkoutItems.length > 0
      ? checkoutItems.reduce(
          (acc, item) => acc + item.qty * (item?.product?.unit_in_gram || 10),
          0,
        )
      : 10;
  const router = useRouter();

  useEffect(() => {
    refreshCart();
  }, []);

  // useEffect(() => {
  //   if (checkoutItems.length > 0) {
  //     const weight = checkoutItems.reduce(
  //       (acc, item) => acc + item.qty * item?.product?.unit_in_gram,
  //       0,
  //     );
  //     // setTotalWeight(weight);
  //     console.log("Total weight calculated:", weight);
  //   }
  // }, [checkoutItems]);

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
      setSelectedCourierPrice(initialPrice);
      setDeliveryService(initialPrice);
    }
  }, [deliveryData]);

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
            showDeliveryPrice={true}
            buttonText="Proceed to Payment"
            onCheckout={handleOpenModal}
            showVoucherButton={false}
          />
        </div>
      </div>

      {/* Modal Confirmation */}
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
