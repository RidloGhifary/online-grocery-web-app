"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getCartItems } from "@/api/cart/route";

interface CartContextProps {
  cartItemCount: number;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextProps>({
  cartItemCount: 0,
  refreshCart: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItemCount, setCartItemCount] = useState<number>(0);

  const refreshCart = async () => {
    try {
      const response = await getCartItems();
      const cartItems = response.data;
      const totalQuantity = cartItems.reduce(
        (acc: number, item: any) => acc + item.qty,
        0,
      );
      setCartItemCount(totalQuantity);
    } catch (error) {
      console.error("Failed to fetch cart item count:", error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartItemCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};
