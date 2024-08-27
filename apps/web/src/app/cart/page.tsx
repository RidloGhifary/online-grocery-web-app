'use client'
import React, { useState } from 'react';
import CartItem from '@/components/cartItems';
import { mockCartItems, mockCartItem } from '@/constants/index';
import CheckoutSummary from '@/components/checkoutSummary';

const CartPage: React.FC = () => {
  const [items, setItems] = useState<mockCartItem[]>(mockCartItems);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);

  const handleVoucherSelect = (voucher: string) => {
    setSelectedVoucher(voucher);
  };

  return (
    <div className="min-h-screen mb-20">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl flex justify-center font-bold mb-4">Your Shopping Cart</h1>
        <div className="flex justify-between items-center bg-gray-100 p-4 mb-4 rounded-md shadow-md">
          <div>
            <input
              type="checkbox"
              checked={selectedItems.length === items.length && items.length > 0}
              className="mr-2"
            />
            <span>Select All</span>
          </div>
          <button
            className="btn btn-error"
            disabled={selectedItems.length === 0}
          >
            Delete Selected
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            <div className="bg-white shadow-lg rounded-lg p-6">
              {items.length > 0 ? (
                <>
                  {items.map(item => (
                    <CartItem
                      key={item.id}
                      item={item}
                    />
                  ))}
                </>
              ) : (
                <p className="text-center text-gray-500">Your cart is empty.</p>
              )}
            </div>
          </div>
          <div className="lg:col-span-2">
            <CheckoutSummary 
            buttonText='Proceed to Checkout'
              items={items} 
              selectedVoucher={selectedVoucher} 
              onVoucherSelect={handleVoucherSelect} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
