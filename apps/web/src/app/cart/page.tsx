'use client'
import React, {useState} from 'react';
import CartItem from './components/cartItems';
import { mockCartItems, mockCartItem } from '@/constants/index';
import CheckoutSummary from './components/checkoutSummary';

const CartPage: React.FC = () => {
  const [items, setItems] = useState<mockCartItem[]>(mockCartItems);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  return (
    <div className="min-h-screen">
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
        <div className="bg-white shadow-lg rounded-lg p-6">
        {items.length > 0 ? (
            <>
              {items.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                />
              ))}
              <CheckoutSummary items={items} />
            </>
          ) : (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;