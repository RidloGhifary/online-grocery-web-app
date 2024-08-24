import React from 'react'

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
  }

  const CartItem: React.FC<CartItemProps> = ({ item}) => {
    return (
      <div className="flex items-center mb-4">
      <input
        type="checkbox"
        className="mr-4"
      />
        <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4" />
        <div className="flex-grow">
          <h2 className="text-xl font-semibold">{item.name}</h2>
          <p className="text-gray-500">Price: ${item.price.toFixed(2)}</p>
          <p className="text-gray-500">
          Weight: {item.weight} kg (Total: {(item.weight * item.quantity).toFixed(2)} kg)
        </p>
          <div className="flex items-center mt-2">
            <button className="btn btn-sm btn-outline mr-2">-</button>
            <span className="font-semibold">{item.quantity}</span>
            <button className="btn btn-sm btn-outline ml-2">+</button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">${(item.price * item.quantity).toFixed(2)}</p>
          <button className="btn btn-error mt-2">Remove</button>
        </div>
      </div>
    );
  };
  
  export default CartItem;