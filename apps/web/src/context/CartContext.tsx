"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getCartItems } from "@/api/cart/route";

interface CartItem {
  id: number;
  product_id: number;
  qty: number;
  user_id: number;
  store_id: number;
  totalPrice: number;
  product: {
    name: string;
    price: number;
    image: string;
    description: string;
  };
}

interface CartContextProps {
  cartItemCount: number;
  refreshCart: () => void;
  checkoutItems: CartItem[];
  setCheckoutItems: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextProps>({
  cartItemCount: 0,
  refreshCart: () => {},
  checkoutItems: [],
  setCheckoutItems: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  const refreshCart = async () => {
    try {
      const response = await getCartItems();
      const cartItems = response.data.data;
      if (Array.isArray(cartItems)) {
        const totalQuantity = cartItems.reduce(
          (acc: number, item: any) => acc + item.qty,
          0,
        );
        setCartItemCount(totalQuantity);
      } else {
        throw new Error("Unexpected response format: data is not an array");
      }
    } catch (error) {
      console.error("Failed to fetch cart item count:", error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItemCount,
        refreshCart,
        checkoutItems,
        setCheckoutItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
