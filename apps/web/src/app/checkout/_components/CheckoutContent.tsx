"use client";

import React, { useState } from "react";
import {
  mockAddress,
  mockCartItems,
  mockTransactionDetails,
  deliveryOptions,
} from "@/constants/index";
import CheckoutSummary from "@/components/checkoutSummary";
import CartItem from "@/components/cartItems";
import AddressSection from "./addressSection/AddressSection";
import { UserAddressProps, UserProps } from "@/interfaces/user";
import SelectCourier from "./deliverySection/SelectCourier";
import { useQuery } from "@tanstack/react-query";
import { getDeliveryOptions } from "@/actions/delivery";
import DeliveryService from "./deliverySection/DeliveryService";
import DeliveryNotes from "./deliverySection/DeliveryNotes";
import ErrorInfo from "@/components/ErrorInfo";

interface Props {
  user: UserProps | null;
}

const CheckOutContent: React.FC<Props> = ({ user }) => {
  const selectedAddressActive = user?.addresses?.find(
    (address) => address?.is_primary,
  );

  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  // ! SELECTED CARRIER HERE
  const [selectedCourier, setSelectedCourier] = useState<string>("jne");
  // ! SELECTED DELIVERY PRICE HERE
  const [deliveryService, setDeliveryService] = useState<number>(0);
  // ! SELECTED DELIVERY NOTES HERE
  const [deliveryNotes, setDeliveryNotes] = useState("");
  // ! SELECTED ADDRESS HERE
  const [selectedAddress, setSelectedAddress] =
    useState<UserAddressProps | null>(
      selectedAddressActive as UserAddressProps,
    );

  // ! FETCH DELIVERY DATA FROM RAJA ONGKIR
  const {
    data: deliveryData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["deliveryData", selectedCourier, selectedAddress?.city_id],
    queryFn: () =>
      getDeliveryOptions({
        origin: "169", // replace with store city address
        destination: selectedAddress?.city_id!!,
        weight: 1000, // update weight accordingly
        courier: selectedCourier,
      }),
    enabled: !!selectedCourier && !!selectedAddress?.city_id,
  });

  const handleVoucherSelect = (voucher: string) => {
    setSelectedVoucher(voucher);
  };

  return (
    <div className="container mx-auto mb-20 h-screen p-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <AddressSection
            user={user}
            setSelectedAddress={setSelectedAddress}
            selectedAddress={selectedAddress}
          />
          <h2 className="mt-6 text-xl font-bold">Your Orders</h2>
          {/* {mockCartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              showQuantityPrice={true}
              showButtons={false}
              showCheckbox={false}
            />
          ))} */}
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
                />
              )}
            <DeliveryNotes
              deliveryNotes={deliveryNotes}
              onNotesChange={setDeliveryNotes}
            />
          </div>
          {/* <CheckoutSummary
            items={mockCartItems}
            deliveryPrice={
              selectedDeliveryOption ? selectedDeliveryOption.price : 0
            }
            showDeliveryPrice={true}
            buttonText="Proceed to Payment"
            selectedVoucher={selectedVoucher}
            onVoucherSelect={handleVoucherSelect}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default CheckOutContent;
