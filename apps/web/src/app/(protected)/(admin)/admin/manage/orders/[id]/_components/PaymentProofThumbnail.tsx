import React from "react";
import { OrderDetailResponse } from "@/api/warehouse/route";

interface Props {
  order: OrderDetailResponse;
  handlePaymentAction: (action: "accept" | "decline") => void;
}

const PaymentProofThumbnail: React.FC<Props> = ({
  order,
  handlePaymentAction,
}) => {
  return (
    <div className="mt-6 text-center">
      <img
        src={order.payment_proof}
        alt="Payment Proof"
        className="mx-auto h-24 w-24 cursor-pointer rounded-lg border hover:border-primary"
        onClick={() => window.open(order.payment_proof, "_blank")}
      />

      {order.order_status.id === 2 && (
        <div className="mt-4 flex justify-center space-x-4">
          <button
            className="rounded bg-green-500 px-4 py-2 text-white"
            onClick={() => handlePaymentAction("accept")}
          >
            Accept
          </button>
          <button
            className="rounded bg-red-500 px-4 py-2 text-white"
            onClick={() => handlePaymentAction("decline")}
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentProofThumbnail;
