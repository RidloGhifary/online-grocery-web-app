"use client";
import React, { useState, useEffect } from "react";
import CartItem from "@/components/CartItems";
import {
  getCartItems,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
} from "@/api/cart/route";
import CheckoutSummary from "@/components/CheckoutSummary";

interface CartItemData {
  id: number;
  product_id: number;
  quantity: number;
  qty: number;
  user_id: number;
  store_id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface GetCartItemsResponse {
  data: CartItemData[];
}

const CartPage: React.FC = () => {
  const [items, setItems] = useState<CartItemData[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response: GetCartItemsResponse = await getCartItems();
        const cartItems = response.data;
        const mappedItems = cartItems.map((item) => ({
          ...item,
          quantity: item.qty,
        }));
        setItems(mappedItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const handleVoucherSelect = (voucher: string) => {
    setSelectedVoucher(voucher);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item.id));
    }
  };

  const handleQuantityChange = async (productId: number, quantity: number) => {
    try {
      await updateCartItemQuantity(productId, quantity);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === productId ? { ...item, qty: quantity } : item,
        ),
      );
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      await removeItemFromCart(productId);
      setItems((prevItems) =>
        prevItems.filter((item) => item.product_id !== productId),
      );
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      for (const id of selectedItems) {
        await handleRemoveItem(id);
      }
      setSelectedItems([]);
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  };

  const cartIsEmpty = items.length === 0;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="mb-4 flex justify-center text-2xl font-bold">
          Your Shopping Cart
        </h1>
        <div className="mb-4 flex items-center justify-between rounded-md bg-gray-100 p-4 shadow-md">
          <div>
            <input
              type="checkbox"
              checked={
                selectedItems.length === items.length && items.length > 0
              }
              onChange={handleSelectAll}
              className="mr-2"
            />
            <span>Select All</span>
          </div>
          <button
            className="btn btn-error"
            disabled={selectedItems.length === 0}
            onClick={handleDeleteSelected}
          >
            Delete Selected
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-lg bg-white p-6">
              {items.length > 0 ? (
                <>
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      showCheckbox={true}
                      isChecked={selectedItems.includes(item.id)}
                      onCheckboxChange={handleCheckboxChange}
                      onQuantityChange={handleQuantityChange}
                      onRemoveItem={handleRemoveItem}
                    />
                  ))}
                </>
              ) : (
                <p className="text-center text-gray-500">
                  Your cart is empty. Please add some items.
                </p>
              )}
            </div>
          </div>
          <div className="lg:col-span-2">
            <CheckoutSummary
              buttonText="Proceed to Checkout"
              items={items}
              selectedVoucher={selectedVoucher}
              onVoucherSelect={handleVoucherSelect}
              disableButton={cartIsEmpty}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
