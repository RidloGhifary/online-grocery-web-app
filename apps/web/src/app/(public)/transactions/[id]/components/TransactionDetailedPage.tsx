"use client";
import React, { useState, useEffect } from "react";
import { UserProps } from "@/interfaces/user";
import { paymentStages } from "@/constants/index";
import { MdArrowBack } from "react-icons/md";
import PaymentDetail from "./PaymentDetail";
import TransactionItemsTable from "./TransactionItemsTable";
import MainLink from "@/components/MainLink";
import MainButton from "@/components/MainButton";
import { useParams } from "next/navigation";
import { Modal } from "@/components/features-2/ui/Modal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
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
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await getOrderById(Number(id));
        setTransactionDetails(response.data);
        setPaymentStage(response.data.order_status.status);
        if (response.data.order_status_id === 1) {
          setModalTitle(`Notification`);
          setModalMessage(
            `You haven't provided a payment proof or it was declined, please upload your payment proof again before time limit`,
          );
          setShowModal(true);
        }

        if (response.data.order_status_id === 3) {
          setModalTitle("Order Confirmation");
          setModalMessage(
            `
            Your order with the details below is being processed.\n
            Invoice: ${response.data.invoice}\n
            Customer: ${response.data.customer.first_name} ${response.data.customer.last_name}\n
            Delivery Address: ${response.data.address.address}, ${response.data.address.city.city_name}\n
            Delivery Service: ${response.data.expedition.display_name}\n
            Store: ${response.data.store.name}, ${response.data.store.address}, ${response.data.store.city.city_name}\n
            Total Price: Rp. ${(
              response.data.totalProductPrice + response.data.deliveryPrice
            ).toLocaleString()}
            `,
          );
          setShowModal(true);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactionDetails();
  }, [id]);

  const handleCancelTransaction = async () => {
    setIsCancelingOrder(true);
    try {
      const orderId = Array.isArray(id) ? Number(id[0]) : Number(id);
      await cancelOrder(orderId);
      setPaymentStage("cancelled");
      setTransactionDetails({
        ...transactionDetails,
        order_status: { status: "cancelled" },
      });
    } catch (error) {
      console.error("Failed to cancel order", error);
    } finally {
      setIsCancelingOrder(false);
      setIsModalOpen(false);
    }
  };

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
      return () => clearInterval(timer);
    }
  }, [timeLeft, paymentStage, fileUploaded]);

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
      setIsDeliveryModalOpen(false);
    }
  };

  const formatTimeForCompletion = () => {
    if (!transactionDetails) return null;
    const completionAtTime = new Date(transactionDetails.completeAt);
    return completionAtTime
      .toLocaleTimeString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      })
      .replace("at", "at");
  };

  const formatTimeForCancellation = () => {
    if (!transactionDetails) return null;
    const cancelAtTime = new Date(transactionDetails.cancelAt);
    return cancelAtTime
      .toLocaleTimeString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      })
      .replace("at", "at");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenDeliveryModal = () => {
    setIsDeliveryModalOpen(true);
  };

  const handleCloseDeliveryModal = () => {
    setIsDeliveryModalOpen(false);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      return setError("No file selected");
    }

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

  const currentStageIndex = paymentStages.findIndex(
    (stage) => stage.label === transactionDetails?.order_status.status,
  );

  if (isLoading) {
    return (
      <div className="text-center font-semibold text-primary my-8">
        Loading transaction details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center font-semibold text-red-500 my-8">
        Error: {error}
      </div>
    );
  }

  if (!transactionDetails) {
    return (
      <div className="text-center font-semibold text-red-500 my-8">
        No transaction found.
      </div>
    );
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
            Please make the payment by {formatTimeForCancellation()} to avoid
            order cancellation.
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
          <div className="mb-4 flex justify-center text-lg">
            Your order will be auto-completed by {formatTimeForCompletion()}
          </div>
          <div className="flex justify-center">
            <MainButton
              text="Confirm Delivery"
              onClick={handleOpenDeliveryModal}
              disabled={isConfirmingDelivery}
            />
          </div>
        </>
      )}
      <Modal
        show={isDeliveryModalOpen}
        closeButton={false}
        onClose={handleCloseDeliveryModal}
      >
        <div>
          <h2 className="mb-4 text-center text-lg font-semibold">
            Do you want to confirm that items of this order have been delivered?
          </h2>
        </div>
        <div className="modal-action flex justify-center">
          <MainButton
            onClick={handleCloseDeliveryModal}
            text="Cancel"
            variant="static"
          />
          <MainButton
            onClick={handleConfirmDelivery}
            text="Confirm"
            variant="primary"
          />
        </div>
      </Modal>
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
      {showModal && (
        <Modal
          show={showModal}
          closeButton={false}
          onClose={() => setShowModal(false)}
        >
          <h2 className="mb-4 text-center text-lg font-semibold">
            {modalTitle}
          </h2>
          <p className="flex justify-around whitespace-pre-line">
            {modalMessage}
          </p>
          {transactionDetails.order_status_id === 3 && (
            <div className="mt-4 flex justify-center">
              <MainButton
                text="Confirm"
                onClick={() => setShowModal(false)}
                className="bg-green-500 text-white"
              />
            </div>
          )}
        </Modal>
      )}
      {order_status_id === 1 && paymentStage !== "cancelled" && (
        <div className="flex justify-center">
          <MainButton
            text="Cancel Order"
            className="mt-2 w-[180px]"
            onClick={handleOpenModal}
            variant="danger"
            disabled={isCancelingOrder}
          />
        </div>
      )}
      <Modal show={isModalOpen} closeButton={false} onClose={handleCloseModal}>
        <div>
          <h2 className="mb-4 text-center text-lg font-semibold">
            Are you sure you want to cancel this order?
          </h2>
        </div>
        <div className="modal-action flex justify-center">
          <MainButton
            onClick={handleCloseModal}
            text="No"
            variant="secondary"
          />
          <MainButton
            onClick={handleCancelTransaction}
            text="Ok"
            variant="danger"
          />
        </div>
      </Modal>
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
