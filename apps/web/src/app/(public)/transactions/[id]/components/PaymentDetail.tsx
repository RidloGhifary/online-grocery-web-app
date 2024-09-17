import React from "react";
import convertRupiah from "@/utils/convertRupiah";

interface PaymentDetailsProps {
  totalItemPrice: number;
  deliveryPrice: number;
  subTotal: number;
  paymentBank: string;
  paymentAccountId: string;
  paymentAccountName: string;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  totalItemPrice,
  deliveryPrice,
  subTotal,
  paymentBank,
  paymentAccountId,
  paymentAccountName,
}) => {
  return (
    <div className="mb-8 rounded-md bg-white p-4 shadow-md">
      <h2 className="mb-4 text-xl font-bold">
        Detailed Transaction Information
      </h2>
      <p>Items Total Price: {convertRupiah(totalItemPrice)}</p>
      <p>Delivery Total Price: {convertRupiah(deliveryPrice)}</p>
      <p>Sub Total: {convertRupiah(subTotal)}</p>
      <p>Bank Name: {paymentBank}</p>
      <p>Account ID: {paymentAccountId}</p>
      <p>Account Name: {paymentAccountName}</p>
    </div>
  );
};

export default PaymentDetails;
