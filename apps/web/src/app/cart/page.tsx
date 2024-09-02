"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/CartItems";
import { FaRegTrashAlt } from "react-icons/fa";

import {
  getCartItems,
  updateCartItemQuantity,
  removeItemFromCart,
  selectForCheckout,
} from "@/api/cart/route";
import { IoMenu } from "react-icons/io5";
import CheckoutSummary from "@/components/CheckoutSummary";
import { Modal } from "@/components/features-2/ui/Modal";
import MainButton from "@/components/MainButton";

const CartPage: React.FC = () => {
  const [items, setItems] = useState<CartItemData[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [actionToConfirm, setActionToConfirm] = useState<() => void>(() => {});
  const [selectedForCheckout, setSelectedForCheckout] = useState<number[]>([]);
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<string>("name");
  const [order, setOrder] = useState<string>("asc");
  const [search, setSearch] = useState<string>("");
  const [hasMoreItems, setHasMoreItems] = useState<boolean>(true);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const { refreshCart } = useCart();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await getCartItems(page, 8, sort, order, search);
        const cartItems = response.data.data;
        if (Array.isArray(cartItems)) {
          const mappedItems = cartItems.map((item) => ({
            ...item,
            quantity: item.qty,
          }));
          setItems((prevItems) =>
            page === 1 ? mappedItems : [...prevItems, ...mappedItems],
          );
          setHasMoreItems(cartItems.length === 8);
        } else {
          throw new Error("Unexpected response format: data is not an array");
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [page, sort, order, search]);

  const handleVoucherSelect = (voucher: string) => {
    setSelectedVoucher(voucher);
  };

  const handleCheckboxChange = (productId: number) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(productId)
        ? prevSelectedItems.filter((id) => id !== productId)
        : [...prevSelectedItems, productId],
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
      setSelectedForCheckout([]);
    } else {
      const allProductIds = items.map((item) => item.product_id);
      setSelectedItems(allProductIds);
      setSelectedForCheckout(allProductIds);
    }
  };

  const handleProceedToCheckout = async () => {
    try {
      const response = await selectForCheckout(selectedForCheckout);
      const checkoutItems = response.data;
      console.log("Items selected for checkout:", checkoutItems);
      // Proceeding to checkout logic later should be added here...
    } catch (error) {
      console.error("Error selecting items for checkout:", error);
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
      refreshCart();
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
      refreshCart();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      for (const productId of selectedItems) {
        await handleRemoveItem(productId);
      }
      setSelectedItems([]);
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  };

  const confirmDeleteSelected = () => {
    setModalContent("Apakah anda ingin menghapus semua produk terpilih?");
    setActionToConfirm(() => handleDeleteSelected);
    setModalVisible(true);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleSortByName = () => {
    setSort("name");
    setOrder(order === "asc" ? "desc" : "asc");
    setPage(1);
  };

  const handleSortByPrice = () => {
    setSort("price");
    setOrder(order === "asc" ? "desc" : "asc");
    setPage(1);
  };

  const toggleSortModal = () => {
    setModalContent(
      <div className="flex flex-col items-center gap-4">
        <MainButton
          text={`Sort by Name: ${order === "asc" ? "A-Z" : "Z-A"}`}
          onClick={() => {
            handleSortByName();
            setModalVisible(false);
          }}
        />
        <MainButton
          text={`Sort by Price: ${order === "asc" ? "Asc" : "Desc"}`}
          onClick={() => {
            handleSortByPrice();
            setModalVisible(false);
          }}
        />
      </div>,
    );
    setModalVisible(true);
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
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search items..."
            className="input input-bordered mr-4 w-1/2 rounded-xl"
          />
          <div className="flex items-center">
            {/* Sorting Button for Small Screens */}
            <MainButton
              text={<IoMenu />}
              onClick={toggleSortModal}
              className="mx-2 lg:hidden"
            />
            {/* Sorting Buttons for Large Screens */}
            <div className="hidden items-center lg:flex">
              <MainButton
                text={`Sort by Name: ${order === "asc" ? "A-Z" : "Z-A"}`}
                onClick={handleSortByName}
                className="mx-2"
              />
              <MainButton
                text={`Sort by Price: ${order === "asc" ? "Asc" : "Desc"}`}
                onClick={handleSortByPrice}
              />
            </div>
            <MainButton
              text={<FaRegTrashAlt />}
              onClick={confirmDeleteSelected}
              disabled={selectedItems.length === 0}
              variant="error"
            />
          </div>
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
                      isChecked={selectedItems.includes(item.product_id)}
                      onCheckboxChange={handleCheckboxChange}
                      onQuantityChange={handleQuantityChange}
                      onRemoveItem={() => {
                        setModalContent(
                          `Apakah anda ingin menghapus ${item.product.name}?`,
                        );
                        setActionToConfirm(
                          () => () => handleRemoveItem(item.product_id),
                        );
                        setModalVisible(true);
                      }}
                    />
                  ))}
                  {hasMoreItems && (
                    <MainButton
                      text="Load More"
                      onClick={handleLoadMore}
                      className="mt-4 w-full"
                    />
                  )}
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
              buttonText={`Proceed to Checkout (${selectedItems.reduce(
                (total, productId) =>
                  total +
                    items.find((item) => item.product_id === productId)?.qty ||
                  0,
                0,
              )})`}
              items={items.filter((item) =>
                selectedItems.includes(item.product_id),
              )}
              selectedVoucher={selectedVoucher}
              onVoucherSelect={handleVoucherSelect}
              disableButton={selectedItems.length === 0}
              onCheckout={handleProceedToCheckout}
              showDeliveryPrice={false}
            />
          </div>
        </div>
      </div>
      {modalVisible && (
        <Modal
          show={modalVisible}
          onClose={() => setModalVisible(false)}
          actions={[
            <button
              key="cancel"
              className="rounded-lg bg-gray-500 px-4 py-2 text-white"
              onClick={() => setModalVisible(false)}
            >
              Batalkan
            </button>,
            <button
              key="confirm"
              className="rounded-lg bg-red-500 px-4 py-2 text-white"
              onClick={() => {
                if (typeof actionToConfirm === "function") {
                  actionToConfirm();
                }
                setModalVisible(false);
              }}
            >
              Ya
            </button>,
          ]}
        >
          <p>{modalContent}</p>
        </Modal>
      )}
    </div>
  );
};

export default CartPage;
