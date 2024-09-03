"use client";
import React, { useState } from "react";
import {
  mockAddress,
  mockCartItems,
  mockTransactionDetails,
  deliveryOptions,
} from "@/constants/index";
import CheckoutSummary from "@/components/CheckoutSummary";
import CartItem from "@/components/CartItems";
import AddressCard from "./components/AddressCard";
import DeliveryService from "./components/DeliveryService";

const CheckoutPage: React.FC = () => {
  const [selectedDeliveryService, setSelectedDeliveryService] = useState("JNE");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);

  const handleDeliverySelect = (service: string) => {
    setSelectedDeliveryService(service);
  };

  const handleVoucherSelect = (voucher: string) => {
    setSelectedVoucher(voucher);
  };

  const selectedDeliveryOption = deliveryOptions.find(
    (option) => option.id === selectedDeliveryService,
  );

  return (
    <div className="container mx-auto mb-20 h-screen p-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <AddressCard address={mockAddress} />
          <button className="btn btn-primary mt-4">Change Address</button>
          <h2 className="mt-6 text-xl font-bold">Your Orders</h2>
          {mockCartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              showQuantityPrice={true}
              showButtons={false}
              showCheckbox={false}
            />
          ))}
        </div>
        <div className="lg:col-span-2">
          <div className="mb-4 rounded-md bg-white p-4 shadow-md">
            <DeliveryService
              selectedDeliveryService={selectedDeliveryService}
              onSelect={handleDeliverySelect}
              deliveryNotes={deliveryNotes}
              onNotesChange={setDeliveryNotes}
            />
          </div>
          <CheckoutSummary
            items={mockCartItems}
            deliveryPrice={
              selectedDeliveryOption ? selectedDeliveryOption.price : 0
            }
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

export default CheckoutPage;
