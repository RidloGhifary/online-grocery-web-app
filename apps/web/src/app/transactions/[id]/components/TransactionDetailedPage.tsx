"use client";
import React, { useState, useEffect } from "react";
import { UserProps } from "@/interfaces/user";
import { paymentStages } from "@/constants/index";
import { MdArrowBack, MdCancel } from "react-icons/md";
import PaymentDetail from "./PaymentDetail";
import TransactionItemsTable from "./TransactionItemsTable";
import MainLink from "@/components/MainLink";
import MainButton from "@/components/MainButton";
import { useParams } from "next/navigation";
import {
  getOrderById,
  cancelOrder,
  uploadPaymentProof,
  confirmDelivery,
} from "@/api/order/route";
import DeliveryInformationBox from "./DeliveryInformation";
import { useUploadThing } from "@/utils/uploadthing";

interface Props {
  user: UserProps | null;
}

const TransactionDetailedPage: React.FC<Props> = ({ user }) => {
  const { id } = useParams();
  const [paymentStage, setPaymentStage] = useState("waiting for payment");
  const [timeLeft, setTimeLeft] = useState(3600);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isCancelingOrder, setIsCancelingOrder] = useState(false);
  const [isUploadingPaymentProof, setIsUploadingPaymentProof] = useState(false);
  const [isConfirmingDelivery, setIsConfirmingDelivery] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { startUpload } = useUploadThing("imageUploader");

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await getOrderById(Number(id));
        setTransactionDetails(response.data);
        setPaymentStage(response.data.order_status.status);
        setTimeLeft(3600);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactionDetails();
  }, [id]);

  useEffect(() => {
    if (
      ["waiting for payment", "waiting payment confirmation"].includes(
        paymentStage,
      ) &&
      !fileUploaded
    ) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      if (timeLeft === 0) {
        handleCancelTransaction();
      }
      return () => clearInterval(timer);
    }
  }, [timeLeft, paymentStage, fileUploaded]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      return setError("No file selected");
    }

    // Extract file type and size
    const fileType = selectedFile.type;
    const fileSize = selectedFile.size;

    if (fileSize > 1_000_000) {
      return setError("File size exceeds 1MB");
    }

    setIsUploadingPaymentProof(true);
    try {
      const uploadResult = await startUpload([selectedFile]);
      const uploadedUrl = uploadResult?.[0]?.url;
      if (!uploadedUrl) {
        throw new Error("File upload failed");
      }

      // Pass fileType and fileSize to the API call
      await uploadPaymentProof(Number(id), uploadedUrl, fileType, fileSize);
      setFileUploaded(true);
      setPaymentStage("waiting payment confirmation");
    } catch (error) {
      console.error("Failed to upload payment proof", error);
      setError("Payment proof upload failed");
    } finally {
      setIsUploadingPaymentProof(false);
    }
  };

  const handleCancelTransaction = async () => {
    setIsCancelingOrder(true);
    try {
      await cancelOrder(id);
      setPaymentStage("cancelled");
      setTransactionDetails({
        ...transactionDetails,
        order_status: { status: "cancelled" },
      });
    } catch (error) {
      console.error("Failed to cancel order", error);
    } finally {
      setIsCancelingOrder(false);
    }
  };

  const handleConfirmDelivery = async () => {
    setIsConfirmingDelivery(true);
    try {
      await confirmDelivery(Number(id));
      setPaymentStage("completed");
    } catch (error: any) {
      console.error("Failed to confirm delivery", error);
      setError("Delivery confirmation failed");
    } finally {
      setIsConfirmingDelivery(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const currentStageIndex = paymentStages.findIndex(
    (stage) => stage.label === transactionDetails?.order_status.status,
  );

  if (isLoading) {
    return <div>Loading transaction details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!transactionDetails) {
    return <div>No transaction found.</div>;
  }

  const {
    order_details,
    deliveryPrice,
    store,
    address,
    expedition,
    order_status_id,
    order_status,
  } = transactionDetails;

  return (
    <div className="container mx-auto mb-20 p-4">
      <MainLink
        href="/user/orders"
        text="Back to Order History"
        Icon={MdArrowBack}
      />
      <PaymentDetail
        totalItemPrice={transactionDetails.totalProductPrice}
        deliveryPrice={deliveryPrice}
        subTotal={
          transactionDetails.totalProductPrice +
          transactionDetails.deliveryPrice
        }
        paymentBank={`Permata Bank`}
        paymentAccountId={"7263 088 610 183 600"}
        paymentAccountName={`Ogro Online Grocery Store`}
      />
      {paymentStage !== "cancelled" && (
        <div className="relative mx-12 mb-8 flex items-center justify-between">
          {paymentStages.map((stage, index) => (
            <div key={index} className="relative flex flex-col items-center">
              <div
                className={`z-10 text-4xl ${
                  index <= currentStageIndex
                    ? "text-green-800"
                    : "text-gray-500"
                }`}
              >
                <stage.icon />
              </div>
            </div>
          ))}
          {/* <div className="mt-4 text-center text-lg">
            {order_status_id !== 6 && <p>{order_status?.status}</p>}
          </div> */}
        </div>
      )}
      {paymentStage === "cancelled" && (
        <div className="mb-8 flex items-center justify-center">
          <div className="text-2xl text-red-500">
            Your order has been canceled.
          </div>
        </div>
      )}
      {paymentStage === "waiting for payment" && (
        <>
          <div className="mb-4 flex justify-center text-lg font-bold text-green-800">
            Payment Status: Waiting for Payment
          </div>
          <div className="mb-4 flex justify-center text-lg">
            Please make the payment within {formatTime(timeLeft)} to avoid order
            cancellation.
          </div>
          <div className="mb-4 flex justify-center">
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <div className="flex justify-center">
            <MainButton
              text="Upload Payment Proof"
              onClick={handleFileUpload}
              disabled={isUploadingPaymentProof}
            />
            {error && <div className="text-red-500">{error}</div>}
          </div>
        </>
      )}
      {paymentStage === "waiting payment confirmation" && (
        <>
          <div className="mb-4 flex justify-center text-lg font-bold text-green-800">
            Payment Status: Waiting payment confirmation
          </div>
          <div className="mb-4 flex justify-center text-lg">
            Your payment is being confirmed. Please wait.
          </div>
        </>
      )}
      {paymentStage === "processing" && (
        <>
          <div className="mb-4 flex justify-center text-lg font-bold text-green-800">
            Payment Status: Processing
          </div>
          <div className="mb-4 flex justify-center text-lg">
            We are currently processing your order
          </div>
        </>
      )}
      {paymentStage === "delivered" && (
        <>
          <div className="mb-4 flex justify-center text-lg font-bold text-green-800">
            Payment Status: Delivered
          </div>
          <div className="mb-4 flex justify-center text-lg">
            Your order is already delivered
          </div>
          <div className="flex justify-center">
            <MainButton
              text="Confirm Delivery"
              onClick={handleConfirmDelivery}
              disabled={isConfirmingDelivery}
            />
          </div>
        </>
      )}
      {paymentStage === "completed" && (
        <>
          <div className="mb-4 flex justify-center text-lg font-bold text-green-800">
            Payment Status: Completed
          </div>
          <div className="mb-4 flex justify-center text-lg">
            Thankyou for your purchase!
          </div>
        </>
      )}
      {order_status_id === 1 && paymentStage !== "cancelled" && (
        <div className="flex justify-center">
          <MainButton
            text="Cancel Order"
            className="mt-2 w-[180px]"
            onClick={handleCancelTransaction}
            variant="danger"
            disabled={isCancelingOrder}
          />
        </div>
      )}
      <DeliveryInformationBox
        address={address}
        store={store}
        expedition={expedition}
      />
      <TransactionItemsTable items={order_details} />
    </div>
  );
};

export default TransactionDetailedPage;
