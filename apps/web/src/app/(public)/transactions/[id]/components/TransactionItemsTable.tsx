import React from "react";

interface TransactionItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface TransactionItemsTableProps {
  items: TransactionItem[];
}

const TransactionItemsTable: React.FC<TransactionItemsTableProps> = ({
  items,
}) => {
  return (
    <div className="mb-8 rounded-md bg-white p-4 shadow-md">
      <div className="flex justify-around bg-gray-200 p-2 font-bold">
        <span className="hidden lg:inline">Images</span>
        <span>Items</span>
        <span>Quantity</span>
        <span>Total Price</span>
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-around border-b py-2"
        >
          <div className="hidden items-center lg:flex">
            <img
              src={item.image}
              alt={item.name}
              className="h-16 w-16 object-cover"
            />
          </div>
          <h3 className="ml-[-1rem] text-lg font-semibold lg:ml-[-4rem]">
            {item.name}
          </h3>
          <span className="ml-[-1rem] lg:ml-[-2rem]">{item.quantity}</span>
          <span>Rp {(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
};

export default TransactionItemsTable;
