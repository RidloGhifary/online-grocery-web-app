import React from "react";
import MainButton from "./MainButton";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  weight: number;
}

interface CartItemProps {
  item: CartItem;
  showQuantityPrice?: boolean;
  showButtons?: boolean;
  showCheckbox?: boolean;
  isChecked?: boolean;
  onCheckboxChange?: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  showQuantityPrice = false,
  showButtons = true,
  showCheckbox = true,
  isChecked = false,
  onCheckboxChange,
}) => {
  return (
    <div className="mb-4 flex items-center rounded-lg p-4 shadow-md">
      {showCheckbox && (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onCheckboxChange && onCheckboxChange(item.id)}
          className="mr-4"
        />
      )}
      <img
        src={item.image}
        alt={item.name}
        className="mr-4 h-24 w-24 rounded-md object-cover"
      />
      <div className="flex-grow">
        <h2 className="text-xl font-semibold">{item.name}</h2>
        <p className="text-gray-500">Price: Rp. {item.price.toFixed(2)}</p>
        <p className="text-gray-500">
          Weight: {item.weight} kg (Total:{" "}
          {(item.weight * item.quantity).toFixed(2)} kg)
        </p>
        <div className="mt-2 flex items-center">
          {showButtons ? (
            <>
              <MainButton text="-" variant="primary" />
              <span className="mx-2 font-semibold">{item.quantity}</span>
              <MainButton text="+" variant="primary" />
            </>
          ) : showQuantityPrice ? (
            <span className="font-semibold">
              {item.quantity} X Rp. {item.price.toFixed(2)}
            </span>
          ) : (
            <span className="font-semibold">{item.quantity}</span>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold">
          Rp. {(item.price * item.quantity).toFixed(2)}
        </p>
        {showButtons && (
          <MainButton text="Remove" variant="error" onClick={() => {}} />
        )}
      </div>
    </div>
  );
};

export default CartItem;
