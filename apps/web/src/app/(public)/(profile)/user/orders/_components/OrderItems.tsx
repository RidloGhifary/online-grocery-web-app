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

interface Order {
  id: number;
  invoice: string;
  totalProductPrice: number;
  deliveryPrice: number;
  order_status_id: number;
  order_details: OrderDetail[];
  address: Address;
  createdAt: string;
}

interface OrderItemsProps {
  order: Order | any;
}

const OrderItems: React.FC<OrderItemsProps> = ({ order }) => {
  const totalProductPrice = order.order_details.reduce(
    (acc: any, item: any) => acc + item.price * item.qty,
    0,
  );
  const totalPrice = totalProductPrice + order.deliveryPrice;
  const formattedDate = new Date(order?.createdAt).toLocaleDateString("id-ID", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  let categoryLabel = "";
  let categoryColor = "";

  if (order.order_status_id >= 1 && order.order_status_id <= 4) {
    categoryLabel = "Ongoing";
    categoryColor = "text-yellow-500";
  } else if (order.order_status_id === 5) {
    categoryLabel = "Completed";
    categoryColor = "text-green-500";
  } else if (order.order_status_id === 6) {
    categoryLabel = "Cancelled";
    categoryColor = "text-red-500";
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
        {order.order_details.map((item: any, index: any) => (
          <span key={index} className="ml-2">
            {item.product.name} X {item.qty}
            {index < order.order_details.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>
      <div className="flex items-center">
        <FaLocationDot className="mr-2" />
        {`${order.address.address}, ${order.address.kecamatan}, ${order.address.city.city_name}`}
      </div>
      <div className="flex items-center">
        <FaCalendar className="mr-2" />
        {formattedDate}
      </div>
      <div className={`font-semibold ${categoryColor}`}>
        ● {categoryLabel.toLowerCase()}
      </div>
    </div>
  );
};

export default OrderItems;
