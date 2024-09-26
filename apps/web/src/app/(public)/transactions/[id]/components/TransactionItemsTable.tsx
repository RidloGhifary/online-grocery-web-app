import React from "react";
import convertRupiah from "@/utils/convertRupiah";

interface TransactionItem {
  id: number;
  name: string;
  price: number;
  product: { name: string; image: string };
  qty: number;
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
    <div className="mb-8 mt-4 rounded-md bg-white p-4 shadow-md">
      <div className="grid grid-cols-4 items-center bg-gray-200 p-2 text-center font-bold">
        <span className="hidden lg:block">Image</span>
        <span>Items</span>
        <span>Quantity</span>
        <span>Total Price</span>
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-4 items-center border-b py-2 text-center"
        >
          <div className="hidden justify-center lg:flex">
            <img
              src={item.product.image || "/images/placeholder.png"}
              alt={item.product.name}
              className="h-16 w-16 object-cover"
            />
          </div>
          <h3 className="text-lg font-semibold">{item.product.name}</h3>
          <span className="text-lg font-semibold">{item.qty}</span>
          <span>{convertRupiah(item.price * item.qty)}</span>
        </div>
      ))}
    </div>
  );
};

export default TransactionItemsTable;
