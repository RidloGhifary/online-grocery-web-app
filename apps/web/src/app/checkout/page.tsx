'use client'
import React, { useState } from 'react';
import { mockAddress, mockCartItems } from '@/constants/index';

const CheckoutPage: React.FC = () => {
  const [selectedDeliveryService, setSelectedDeliveryService] = useState('JNE');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('DANA');
  const handlePaymentChange = (method: string) => {
    setSelectedPaymentMethod(method);
  };
  const [deliveryNotes, setDeliveryNotes] = useState('');

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <div className="bg-white p-4 mb-4 shadow-md rounded-md">
            <h2 className="text-xl font-bold">Delivery Address</h2>
            <p>{mockAddress.name}</p>
            <p>{mockAddress.addressLine1}</p>
            <p>{mockAddress.addressLine2}</p>
            <p>{mockAddress.city}, {mockAddress.state} {mockAddress.postalCode}</p>
          </div>
          {mockCartItems.map(item => (
            <div key={item.id} className="bg-white p-4 mb-4 shadow-md rounded-md">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
          <div className="bg-white p-4 mb-4 shadow-md rounded-md">
            <label htmlFor="deliveryService" className="block font-semibold">Delivery Service</label>
            <select
              id="deliveryService"
              value={selectedDeliveryService}
              onChange={(e) => setSelectedDeliveryService(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="JNE">JNE</option>
              <option value="POS Indonesia">POS Indonesia</option>
              <option value="TIKI">TIKI</option>
            </select>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white p-4 shadow-md rounded-md">
            <h2 className="text-xl font-bold">Total Price</h2>
            <p>${
              mockCartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
            }</p>
            <label htmlFor="deliveryNotes" className="block font-semibold mt-4">Delivery Notes</label>
            <textarea
              id="deliveryNotes"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              className="textarea textarea-bordered w-full"
              placeholder="Any special instructions?"
            ></textarea>
          </div>
          <div className="lg:mt-4 lg:static fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 lg:bg-transparent">
            <button className="btn btn-primary w-full">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
