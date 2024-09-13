import React from "react";
import convertRupiah from "@/utils/convertRupiah";
import { FaBoxOpen } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendar } from "react-icons/fa";

interface Product {
  name: string;
  image: string;
}

interface OrderDetail {
  id: number;
  order_id: number;
  product_id: number;
  qty: number;
  store_id: number;
  price: number;
  sub_total: number;
  product: Product;
}

interface Address {
  address: string;
  kecamatan: string;
  kelurahan: string;
  city: {
    city_name: string;
  };
}

interface Store {
  name: string;
  address: string;
  city_name: string;
}

interface Order {
  id: number;
  invoice: string;
  totalProductPrice: number;
  deliveryPrice: number;
  order_status_id: number;
  order_details: OrderDetail[];
  address: Address;
  store: Store;
  createdAt: string;
}

interface OrderItemsAdminProps {
  order: Order;
}

const OrderItemsAdmin: React.FC<OrderItemsAdminProps> = ({ order }) => {
  const totalProductPrice = order.order_details.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const totalPrice = totalProductPrice + order.deliveryPrice;
  const formattedDate = new Date(order.createdAt).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  let categoryLabel = "";
  let categoryColor = "";

  switch (order.order_status_id) {
    case 1:
      categoryLabel = "Waiting for Payment";
      categoryColor = "text-yellow-500";
      break;
    case 2:
      categoryLabel = "Processing";
      categoryColor = "text-blue-500";
      break;
    case 3:
      categoryLabel = "Delivered";
      categoryColor = "text-green-300";
      break;
    case 4:
      categoryLabel = "Completed";
      categoryColor = "text-green-700";
      break;
    case 5:
      categoryLabel = "Cancelled";
      categoryColor = "text-red-500";
      break;
  }

  return (
    <div className="space-y-2 rounded-lg border p-4 shadow-md">
      <a
        href={`/transactions/${order.id}`}
        className="text-lg font-semibold text-blue-500 hover:underline"
      >
        {order.invoice}
      </a>
      <div className="font-bold">Total Price: {convertRupiah(totalPrice)}</div>
      <div className="flex items-center">
        <FaBoxOpen />
        {order.order_details.map((item, index) => (
          <span key={index} className="ml-2">
            {item.product.name} X {item.qty}
            {index < order.order_details.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>
      <div className="font-bold">
        From Store: {order.store.name}, {order.store.address},{" "}
        {order.store.city_name}
      </div>
      <div className="flex items-center">
        <FaLocationDot className="mr-2" />
        {`${order.address.address}, ${order.address.kecamatan}, ${order.address.city.city_name}`}
      </div>
      <div className="flex items-center">
        <FaCalendar className="mr-2" />
        {formattedDate}
      </div>
      <div className={`font-semibold ${categoryColor}`}>● {categoryLabel}</div>
    </div>
  );
};

export default OrderItemsAdmin;
