"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/CartItems";
import { FaRegTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>("");
  const [actionToConfirm, setActionToConfirm] = useState<() => void>(() => {});
  const [selectedForCheckout, setSelectedForCheckout] = useState<
    { product_id: number; qty: number }[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<string>("name");
  const [order, setOrder] = useState<string>("asc");
  const [search, setSearch] = useState<string>("");
  const [hasMoreItems, setHasMoreItems] = useState<boolean>(true);
  const [isSortModal, setIsSortModal] = useState(false);
  const { setCheckoutItems, refreshCart } = useCart();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await getCartItems(page, 8, sort, order, search);
        const formattedCartItems = response.data.data;
        if (Array.isArray(formattedCartItems)) {
          const mappedItems = formattedCartItems.map((item) => ({
            ...item,
            quantity: item.qty,
            product: item.product || {},
          }));
          setItems((prevItems) =>
            page === 1 ? mappedItems : [...prevItems, ...mappedItems],
          );
          setHasMoreItems(formattedCartItems.length === 8);
        } else {
          throw new Error("Unexpected response format: data is not an array");
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setErrorMessage("Error fetching cart items");
      }
    };

    fetchCartItems();
  }, [page, sort, order, search]);

  const handleCheckboxChange = (productId: number) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(productId)
        ? prevSelectedItems.filter((id) => id !== productId)
        : [...prevSelectedItems, productId],
    );

    setSelectedForCheckout((prevSelectedForCheckout) => {
      const isAlreadySelected = prevSelectedForCheckout.some(
        (item) => item.product_id === productId,
      );

      if (isAlreadySelected) {
        return prevSelectedForCheckout.filter(
          (item) => item.product_id !== productId,
        );
      } else {
        const selectedItem = items.find(
          (item) => item.product_id === productId,
        );
        return selectedItem
          ? [
              ...prevSelectedForCheckout,
              { product_id: selectedItem.product_id, qty: selectedItem.qty },
            ]
          : prevSelectedForCheckout;
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
      setSelectedForCheckout([]);
    } else {
      const allSelectedItems = items.map((item) => ({
        product_id: item.product_id,
        qty: item.qty,
      }));
      setSelectedItems(allSelectedItems.map((item) => item.product_id));
      setSelectedForCheckout(allSelectedItems);
    }
  };

  const handleProceedToCheckout = async () => {
    try {
      if (selectedForCheckout.length === 0) {
        console.error("No items selected for checkout");
        setErrorMessage("No items selected for checkout");
        return;
      }

      const response = await selectForCheckout(
        selectedForCheckout.map((item) => item.product_id),
        selectedForCheckout.map((item) => item.qty),
      );

      const itemsFromBackend = response.data;

      setCheckoutItems(
        selectedForCheckout.map((item) => {
          const backendItem = Array.isArray(itemsFromBackend)
            ? itemsFromBackend.find(
                (backendItem: CartItem) =>
                  backendItem.product_id === item.product_id,
              )
            : undefined;

          const cartItemProduct = items.find(
            (cartItem) => cartItem.product_id === item.product_id,
          )?.product;

          return {
            ...item,
            id: backendItem ? backendItem.id : 0,
            user_id: backendItem ? backendItem.user_id : 0,
            store_id: backendItem ? backendItem.store_id : 0,
            totalPrice: backendItem ? backendItem.totalPrice : 0,
            product: cartItemProduct
              ? {
                  ...cartItemProduct,
                  image: cartItemProduct.image || "",
                }
              : {
                  name: "Unknown",
                  unit_in_gram: 0,
                  price: 0,
                  image: "",
                  description: "No description available",
                },
            totalWeight: backendItem ? backendItem.unit_in_gram : 0,
          };
        }),
      );

      router.push("/cart/checkout");
    } catch (error) {
      console.error("Error selecting items for checkout:", error);
      setErrorMessage("Error selecting items for checkout");
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

      setSelectedForCheckout((prevSelectedForCheckout) =>
        prevSelectedForCheckout.map((item) =>
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
      setErrorMessage("Error removing item from cart");
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
    setModalContent("Do you want to delete all selected items?");
    setActionToConfirm(() => handleDeleteSelected);
    setModalVisible(true);
    setIsSortModal(false);
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
          text={`Sort by Name`}
          onClick={() => {
            handleSortByName();
            setModalVisible(false);
          }}
        />
        <MainButton
          text={`Sort by Price`}
          onClick={() => {
            handleSortByPrice();
            setModalVisible(false);
          }}
        />
      </div>,
    );
    setModalVisible(true);
    setIsSortModal(true);
  };

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
            <MainButton
              text={<IoMenu />}
              onClick={toggleSortModal}
              className="mx-2 lg:hidden"
            />
            <div className="hidden items-center lg:flex">
              <MainButton
                text={`Sort by Name`}
                onClick={handleSortByName}
                className="mx-2"
              />
              <MainButton text={`Sort by Price`} onClick={handleSortByPrice} />
            </div>
            <MainButton
              text={<FaRegTrashAlt />}
              onClick={confirmDeleteSelected}
              disabled={selectedItems.length === 0}
              className="ml-2"
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
                      onRemoveItem={() => handleRemoveItem(item.product_id)}
                      setModalContent={setModalContent}
                      setActionToConfirm={setActionToConfirm}
                      setModalVisible={setModalVisible}
                      setIsSortModal={setIsSortModal}
                    />
                  ))}
                  {hasMoreItems && (
                    <MainButton
                      text="Load More"
                      variant="secondary"
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
                  (items.find((item) => item.product_id === productId)?.qty ||
                    0),
                0,
              )})`}
              items={selectedItems
                .map((id) => items.find((item) => item.product_id === id))
                .filter((item): item is CartItem => item !== undefined)}
              disableButton={selectedItems.length === 0}
              onCheckout={handleProceedToCheckout}
              showDeliveryPrice={false}
              showVoucherButton={false}
              subtotal={0}
              deliveryTotal={0}
              selectedProductVoucher={null}
              selectedDeliveryVoucher={null}
              showTotal={false}
              customSubtotalCalculator={() =>
                selectedItems.reduce(
                  (total, productId) =>
                    total +
                    (items.find((item) => item.product_id === productId)?.qty ||
                      0) *
                      (items.find((item) => item.product_id === productId)
                        ?.product?.price || 0),
                  0,
                )
              }
            />
          </div>
        </div>
      </div>
      {modalVisible && (
        <Modal
          show={modalVisible}
          hideCloseButton={true}
          onClose={() => setModalVisible(false)}
          actions={
            !isSortModal
              ? [
                  <MainButton
                    key="cancel"
                    text="Cancel"
                    variant="static"
                    onClick={() => setModalVisible(false)}
                    className="rounded-lg px-4 py-2"
                  />,
                  <MainButton
                    key="confirm"
                    text="Yes"
                    variant="danger"
                    onClick={() => {
                      if (typeof actionToConfirm === "function") {
                        actionToConfirm();
                      }
                      setModalVisible(false);
                    }}
                    className="rounded-lg px-4 py-2"
                  />,
                ]
              : undefined
          }
        >
          <p>{modalContent}</p>
        </Modal>
      )}
      {errorMessage && (
        <div className="mt-auto mb-4 text-center text-red-600 font-semibold">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default CartPage;
