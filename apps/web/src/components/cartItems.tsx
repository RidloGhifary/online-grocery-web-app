import React from "react";
import MainButton from "./MainButton";
import { useCart } from "@/context/CartContext";

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

  return (
    <div className="mb-4 flex items-center rounded-lg p-4 shadow-md">
      {showCheckbox && (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onCheckboxChange && onCheckboxChange(item.product_id)}
          className="mr-4"
        />
      )}
      <img
        src={item.product.image || "/path/to/placeholder-image.jpg"}
        alt={item.product.name}
        className="mr-4 h-24 w-24 rounded-md object-cover"
      />
      <div className="flex-grow">
        <h2 className="text-xl font-semibold">{item.product.name}</h2>
        <p className="text-gray-500">Price: Rp. {item.product.price}</p>
        <p className="text-gray-500">{item.product.description}</p>
        <div className="mt-2 flex items-center">
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
              {item.qty} X Rp. {item.product.price.toFixed(2)}
            </span>
          ) : (
            <span className="font-semibold">{item.qty}</span>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold">
          Rp. {(item.product.price * item.qty).toFixed(2)}
        </p>
        {showButtons && (
          <MainButton
            text="Remove"
            variant="error"
            onClick={() => onRemoveItem && onRemoveItem(item.product_id)}
          />
        )}
      </div>
    </div>
  );
};

export default CartItem;
