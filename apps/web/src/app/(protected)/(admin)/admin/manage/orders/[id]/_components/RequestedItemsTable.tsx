import React from "react";
import { OrderDetailResponse } from "@/api/warehouse/route";
import convertRupiah from "@/utils/convertRupiah";

interface Props {
  items: OrderDetailResponse["order_details"];
}

const RequestedItemsTable: React.FC<Props> = ({ items }) => {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl shadow-lg">
      <table className="w-full table-auto">
        <thead className="bg-primary">
          <tr>
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2 text-center">
                {item.product.name}
              </td>
              <td className="border px-4 py-2 text-center">
                {convertRupiah(item.price)}
              </td>
              <td className="border px-4 py-2 text-center">{item.qty}</td>
              <td className="border px-4 py-2 text-center">
                {convertRupiah(item.price * item.qty)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestedItemsTable;
