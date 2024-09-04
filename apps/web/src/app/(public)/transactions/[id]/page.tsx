"use client";
import React, { useState, useEffect } from "react";
import {
  paymentStages,
  mockCartItems,
  mockTransactionDetails,
} from "@/constants/index";
import { MdArrowBack, MdCancel } from "react-icons/md";
import PaymentDetail from "./components/PaymentDetail";
import TransactionItemsTable from "./components/TransactionItemsTable";
import MainLink from "@/components/MainLink";
import MainButton from "@/components/MainButton";

const PaymentStatusPage: React.FC = () => {
  const [paymentStage, setPaymentStage] = useState("Menunggu Pembayaran");
  const [timeLeft, setTimeLeft] = useState(3600);
  const [fileUploaded, setFileUploaded] = useState(false);

  useEffect(() => {
    if (paymentStage === "Menunggu Pembayaran" && !fileUploaded) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      if (timeLeft === 0) {
        setPaymentStage("Dibatalkan");
      }
      return () => clearInterval(timer);
    }
  }, [timeLeft, paymentStage, fileUploaded]);

  const handleFileUpload = () => {
    setFileUploaded(true);
    setPaymentStage("Menunggu Konfirmasi Pembayaran");
  };

  const handleCancelTransaction = () => {
    setPaymentStage("Dibatalkan");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const currentStageIndex = paymentStages.findIndex(
    (stage) => stage.label === paymentStage,
  );
  const totalItemPrice = mockCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const subTotal = totalItemPrice + mockTransactionDetails.deliveryPrice;

  return (
    <div className="container mx-auto mb-20 p-4">
      <MainLink
        href="/transaction-history"
        text="Back to Transaction History"
        Icon={MdArrowBack}
      />
      <PaymentDetail
        totalItemPrice={totalItemPrice}
        deliveryPrice={mockTransactionDetails.deliveryPrice}
        subTotal={subTotal}
        paymentBank={mockTransactionDetails.paymentBank}
        paymentAccountId={mockTransactionDetails.paymentAccountId}
        paymentAccountName={mockTransactionDetails.paymentAccountName}
      />
      {paymentStage !== "Dibatalkan" && (
        <div className="relative mb-8 flex items-center justify-between">
          {paymentStages
            .slice(0, paymentStages.length - 1)
            .map((stage, index) => (
              <div key={index} className="relative flex flex-col items-center">
                <div
                  className={`z-10 text-4xl ${
                    index <= currentStageIndex
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  <stage.icon />
                </div>
              </div>
            ))}
        </div>
      )}
      {paymentStage === "Dibatalkan" && (
        <div className="mb-8 flex items-center justify-center">
          <div className="text-2xl text-red-500">
            Your order has been canceled.
          </div>
        </div>
      )}
      {paymentStage === "Menunggu Pembayaran" && (
        <>
          <div className="mb-4 text-lg">
            Please make the payment within {formatTime(timeLeft)} to avoid order
            cancellation.
          </div>
          <div className="mb-4">
            <MainButton
              text="Upload Payment Proof"
              onClick={handleFileUpload}
              variant="primary"
              fullWidth
            />
          </div>
        </>
      )}
      {paymentStage === "Menunggu Konfirmasi Pembayaran" && (
        <div className="mb-4 text-lg">
          Your payment is being confirmed. Please wait.
        </div>
      )}
      {paymentStage !== "Dibatalkan" && (
        <MainButton
          text="Cancel Order"
          onClick={handleCancelTransaction}
          variant="danger"
          fullWidth
        />
      )}
      <TransactionItemsTable items={mockCartItems} />
    </div>
  );
};

export default PaymentStatusPage;
