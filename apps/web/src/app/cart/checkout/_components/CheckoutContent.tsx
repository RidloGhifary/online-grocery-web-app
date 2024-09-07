"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import CheckoutSummary from "@/components/checkoutSummary";
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

  useEffect(() => {
    refreshCart();
  }, []);

  console.log(
    "Query enabled:",
    !!selectedAddress?.id,
    checkoutItems.length > 0,
  );

  const { data: nearestStoreData, error: nearestStoreError } = useQuery({
    queryKey: ["nearestStore", selectedAddress?.id],
    queryFn: () => getNearestStore(selectedAddress?.id as number),
    enabled: !!selectedAddress?.id, // Only fetch if the address exists
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (nearestStoreData) {
      console.log("nearestStoreData exists:", nearestStoreData);
      setStoreCityId(nearestStoreData.data.closestStore.city_id);
    } else {
      console.log("nearestStoreData is null or undefined.");
    }
  }, [nearestStoreData]);

  const {
    data: deliveryData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["deliveryData", selectedCourier, selectedAddress?.city_id],
    queryFn: () =>
      getDeliveryOptions({
        origin: storeCityId ? storeCityId.toString() : "154",
        destination: selectedAddress?.city_id!!,
        weight: 1000,
        courier: selectedCourier,
      }),
    enabled: !!selectedCourier && !!selectedAddress?.city_id,
  });

  useEffect(() => {
    if (deliveryData) {
      console.log("Delivery Data: ", deliveryData);
    }
  }, [deliveryData]);

  useEffect(() => {
    if (deliveryData && deliveryData?.data?.results[0]?.costs.length > 0) {
      const initialPrice =
        deliveryData?.data?.results[0]?.costs[0]?.cost[0]?.value;
      setSelectedCourierPrice(initialPrice);
      setDeliveryService(initialPrice);
    }
  }, [deliveryData]);

  const handleVoucherSelect = (voucher: string) => {
    setSelectedVoucher(voucher);
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
            selectedVoucher={selectedVoucher}
            onVoucherSelect={handleVoucherSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckOutContent;
