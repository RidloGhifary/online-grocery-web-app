"use client";

import React, { useState, useEffect } from "react";
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
import { useCart } from "@/context/CartContext";

interface Props {
  user: UserProps | null;
}

const CheckOutContent: React.FC<Props> = ({ user }) => {
  const { checkoutItems = [] } = useCart();

  const selectedAddressActive = user?.addresses?.find(
    (address) => address?.is_primary,
  );

  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<string>("jne");
  const [deliveryService, setDeliveryService] = useState<number>(0);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [selectedAddress, setSelectedAddress] =
    useState<UserAddressProps | null>(
      selectedAddressActive as UserAddressProps,
    );

  useEffect(() => {
    console.log("Selected items for checkout:", checkoutItems);
  }, [checkoutItems]);

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
          {checkoutItems.length > 0 ? (
            checkoutItems.map((item) => (
              <CartItem
                key={item.product_id}
                item={item}
                showQuantityPrice={true}
                showButtons={false}
                showCheckbox={false}
              />
            ))
          ) : (
            <p>No items selected for checkout.</p>
          )}
        </div>
        {/* Rest of the component */}
      </div>
    </div>
  );
};

export default CheckOutContent;
