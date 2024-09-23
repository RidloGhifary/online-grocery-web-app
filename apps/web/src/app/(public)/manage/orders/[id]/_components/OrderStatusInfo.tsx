import React from "react";
import { OrderDetailResponse } from "@/api/warehouse/route";

interface Props {
  order: OrderDetailResponse;
}

const OrderStatusInfo: React.FC<Props> = ({ order }) => {
  return (
    <div className="mt-6 text-center text-lg font-semibold">
      <span
        className={`${
          order.order_status.id <= 2
            ? "text-yellow-500"
            : order.order_status.id === 3
              ? "text-blue-500"
              : order.order_status.id === 4
                ? "text-green-500"
                : order.order_status.id === 5
                  ? "text-green-800"
                  : "text-red-500"
        }`}
      >
        Order Status:{" "}
        <span className="capitalize">{order.order_status.status}</span>
      </span>
    </div>
  );
};

export default OrderStatusInfo;
