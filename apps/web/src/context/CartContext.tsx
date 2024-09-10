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
  const [checkoutItems, setCheckoutItemsState] = useState<CartItem[]>([]);

  // Set checkout items and persist to local storage
  const setCheckoutItems = (items: CartItem[]) => {
    setCheckoutItemsState(items);
    localStorage.setItem("checkoutItems", JSON.stringify(items)); // Persist in local storage
  };

  // Refresh cart item count
  const refreshCart = async () => {
    try {
      const response = await getCartItems();
      console.log("Cart items fetched:", response.data.data);
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

  // Clear localStorage on browser close or navigating away (but not on reload)
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const confirmationMessage = "Are you sure you want to leave this page?";
      // This triggers only when the user is closing the page
      event.preventDefault();
      event.returnValue = confirmationMessage; // For modern browsers
      return confirmationMessage; // For legacy browsers

      // Clear only if the page is being closed, not reloaded
      if (!event.defaultPrevented) {
        localStorage.removeItem("checkoutItems");
      }
    };

    const handlePopState = () => {
      // Clear localStorage when user navigates using back/forward buttons
      localStorage.removeItem("checkoutItems");
    };

    // Attach the listeners
    // window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    // Load checkoutItems from local storage on component mount (page reload)
    refreshCart();
    const savedCheckoutItems = localStorage.getItem("checkoutItems");
    if (savedCheckoutItems) {
      setCheckoutItemsState(JSON.parse(savedCheckoutItems));
    }

    // Clean up the listeners on unmount
    return () => {
      // window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
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
