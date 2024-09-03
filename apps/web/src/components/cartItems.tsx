import React from "react";
import MainButton from "./MainButton";
import { useCart } from "@/context/CartContext";
import { convertToRupiah } from "@/utils/ConvertRupiah";

interface Product {
  name: string;
  price: number;
  image: string | null;
  description: string;
}

interface CartItem {
  id: number;
  product_id: number;
  qty: number;
  store_id: number;
  user_id: number;
  product: Product;
}

interface CartItemProps {
  item: CartItem;
  showQuantityPrice?: boolean;
  showButtons?: boolean;
  showCheckbox?: boolean;
  isChecked?: boolean;
  onCheckboxChange?: (id: number) => void;
  onQuantityChange?: (id: number, quantity: number) => void;
  onRemoveItem?: (id: number) => void;
  setModalContent: (content: string) => void;
  setActionToConfirm: (action: () => void) => void;
  setModalVisible: (visible: boolean) => void;
  setIsSortModal: (isSortModal: boolean) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  showQuantityPrice = false,
  showButtons = true,
  showCheckbox = true,
  isChecked = false,
  onCheckboxChange,
  onQuantityChange,
  onRemoveItem,
  setModalContent,
  setActionToConfirm,
  setModalVisible,
  setIsSortModal,
}) => {
  const { refreshCart } = useCart();

  const handleDecrement = () => {
    if (onQuantityChange && item.qty > 1) {
      onQuantityChange(item.product_id, item.qty - 1);
      refreshCart();
    }
  };

  const handleIncrement = () => {
    if (onQuantityChange) {
      onQuantityChange(item.product_id, item.qty + 1);
      refreshCart();
    }
  };

  const handleRemoveClick = () => {
    setModalContent(`Do you want to delete ${item.product.name}?`);
    setActionToConfirm(
      () => () => onRemoveItem && onRemoveItem(item.product_id),
    );
    setModalVisible(true);
    setIsSortModal(false);
  };

  return (
    <div className="mb-4 flex flex-col items-center rounded-lg p-4 shadow-md lg:flex-row lg:items-center">
      {showCheckbox && (
        <div className="mb-4 flex flex-shrink-0 items-center justify-center lg:mb-0 lg:mr-4 lg:justify-start">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() =>
              onCheckboxChange && onCheckboxChange(item.product_id)
            }
            className="lg:mr-4"
          />
        </div>
      )}
      <div className="flex w-full flex-col items-center lg:flex-row">
        <img
          src={item.product.image || "/path/to/placeholder-image.jpg"}
          alt={item.product.name}
          className="mb-4 h-24 w-24 rounded-md object-cover lg:mb-0 lg:mr-4"
        />
        <div className="flex-grow text-center lg:text-left">
          <h2 className="text-xl font-semibold">{item.product.name}</h2>
          <p className="text-gray-500">{item.product.description}</p>
          <div className="mt-2 flex items-center justify-center lg:justify-start">
            {showButtons ? (
              <>
                <MainButton
                  text="-"
                  variant="primary"
                  onClick={handleDecrement}
                />
                <span className="mx-2 font-semibold">{item.qty}</span>
                <MainButton
                  text="+"
                  variant="primary"
                  onClick={handleIncrement}
                />
              </>
            ) : showQuantityPrice ? (
              <span className="font-semibold">
                {item.qty} X {convertToRupiah(item.product.price)}
              </span>
            ) : (
              <span className="font-semibold">{item.qty}</span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 w-full text-center lg:mt-0 lg:text-right">
        <p className="text-xl font-bold">
          {convertToRupiah(item.product.price * item.qty)}
        </p>
        {showButtons && (
          <MainButton
            text="Remove"
            variant="error"
            onClick={handleRemoveClick}
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
};

export default CartItem;
