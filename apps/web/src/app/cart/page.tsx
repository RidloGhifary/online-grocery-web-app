'use client'
import React, {useState} from 'react';
import CartItem from './components/cartItems';
import { mockCartItems, mockCartItem } from '@/constants/mockCartItems';
import CheckoutSummary from './components/checkoutSummary';

const CartPage: React.FC = () => {
  const [items, setItems] = useState<mockCartItem[]>(mockCartItems);
  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl flex justify-center font-bold mb-4">Your Shopping Cart</h1>
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