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
import { getOrderById, cancelOrder } from "@/api/order/route";
import DeliveryInformationBox from "./DeliveryInformation";

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

  // Fetch transaction details
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await getOrderById(Number(id));
        console.log(response);
        setTransactionDetails(response.data);
        setPaymentStage(response.data.order_status);
        setTimeLeft(3600); // Sync time left from API
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [id]);

  // Timer countdown and auto-cancel order when timeLeft is 0
  useEffect(() => {
    if (paymentStage === "waiting for payment" && !fileUploaded) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      if (timeLeft === 0) {
        handleCancelTransaction(); // Automatically cancel when time runs out
      }

      return () => clearInterval(timer);
    }
  }, [timeLeft, paymentStage, fileUploaded]);

  // Handle file upload for payment proof
  const handleFileUpload = () => {
    setFileUploaded(true);
    setPaymentStage("waiting payment confirmation");
  };

  // Cancel transaction handler
  const handleCancelTransaction = async () => {
    setIsCancelingOrder(true);
    try {
      await cancelOrder(id); // Assuming the cancelOrder API is implemented
      setPaymentStage("cancelled");
      setTransactionDetails({
        ...transactionDetails,
        order_status: "cancelled",
      });
    } catch (error) {
      console.error("Failed to cancel order", error);
    } finally {
      setIsCancelingOrder(false);
    }
  };

  // Format time function for countdown timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Find the current stage index based on order_status
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

  const { order_details, deliveryPrice, store, address, expedition } =
    transactionDetails;

  return (
    <div className="container mx-auto mb-20 p-4">
      <MainLink
        href="/transaction-history"
        text="Back to Transaction History"
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
        <div className="relative mb-8 flex items-center justify-between">
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
          <div className="mb-4 text-lg">
            Please make the payment within {formatTime(timeLeft)} to avoid order
            cancellation.
          </div>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload()}
            />
          </div>
        </>
      )}

      {paymentStage === "waiting payment confirmation" && (
        <div className="mb-4 text-lg">
          Your payment is being confirmed. Please wait.
        </div>
      )}

      {paymentStage !== "cancelled" && (
        <MainButton
          text="Cancel Order"
          onClick={handleCancelTransaction}
          variant="danger"
          fullWidth
          disabled={isCancelingOrder}
        />
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

// const TransactionDetailedPage: React.FC<Props> = ({ user }) => {
//   const { id } = useParams();
//   const [paymentStage, setPaymentStage] = useState("waiting for payment");
//   const [timeLeft, setTimeLeft] = useState(3600);
//   const [fileUploaded, setFileUploaded] = useState(false);
//   const [isCancelingOrder, setIsCancelingOrder] = useState(false);
//   const [isUploadingPaymentProof, setIsUploadingPaymentProof] = useState(false);
//   const [isConfirmingDelivery, setIsConfirmingDelivery] = useState(false);
//   const [transactionDetails, setTransactionDetails] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchTransactionDetails = async () => {
//       try {
//         const response = await getOrderById(Number(id));
//         console.log(response);
//         setTransactionDetails(response.data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTransactionDetails();
//   }, [id]);

//   useEffect(() => {
//     if (paymentStage === "waiting for payment" && !fileUploaded) {
//       const timer = setInterval(() => {
//         setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
//       }, 1000);
//       if (timeLeft === 0) {
//         setPaymentStage("cancelled");
//       }
//       return () => clearInterval(timer);
//     }
//   }, [timeLeft, paymentStage, fileUploaded]);

//   const handleFileUpload = () => {
//     setFileUploaded(true);
//     setPaymentStage("waiting payment confirmation");
//   };

//   const handleCancelTransaction = () => {
//     setPaymentStage("cancelled");
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   const currentStageIndex = paymentStages.findIndex(
//     (stage) => stage.label === paymentStage,
//   );

//   if (isLoading) {
//     return <div>Loading transaction details...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!transactionDetails) {
//     return <div>No transaction found.</div>;
//   }

//   const {
//     order_details,
//     // totalProductPrice,
//     order_status,
//     deliveryPrice,
//     store,
//     address,
//     expedition,
//   } = transactionDetails;

//   return (
//     <div className="container mx-auto mb-20 p-4">
//       <MainLink
//         href="/transaction-history"
//         text="Back to Transaction History"
//         Icon={MdArrowBack}
//       />
//       <PaymentDetail
//         totalItemPrice={transactionDetails.totalProductPrice}
//         deliveryPrice={deliveryPrice}
//         subTotal={
//           transactionDetails.totalProductPrice +
//           transactionDetails.deliveryPrice
//         }
//         paymentBank={`Permata Bank`}
//         paymentAccountId={"7263 088 610 183 600"}
//         paymentAccountName={`Ogro Online Grocery Store`}
//       />
//       {paymentStage !== "cancelled" && (
//         <div className="relative mb-8 flex items-center justify-between">
//           {paymentStages
//             .slice(0, paymentStages.length - 1)
//             .map((stage, index) => (
//               <div key={index} className="relative flex flex-col items-center">
//                 <div
//                   className={`z-10 text-4xl ${
//                     index <= currentStageIndex
//                       ? "text-green-500"
//                       : "text-gray-500"
//                   }`}
//                 >
//                   <stage.icon />
//                 </div>
//               </div>
//             ))}
//         </div>
//       )}
//       {paymentStage === "cancelled" && (
//         <div className="mb-8 flex items-center justify-center">
//           <div className="text-2xl text-red-500">
//             Your order has been canceled.
//           </div>
//         </div>
//       )}
//       {paymentStage === "waiting for payment" && (
//         <>
//           <div className="mb-4 text-lg">
//             Please make the payment within {formatTime(timeLeft)} to avoid order
//             cancellation.
//           </div>
//           <div className="mb-4">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleFileUpload()}
//               // className="disabled:cursor-not-allowed disabled:opacity-50"
//             />
//           </div>
//         </>
//       )}
//       {paymentStage === "waiting payment confirmation" && (
//         <div className="mb-4 text-lg">
//           Your payment is being confirmed. Please wait.
//         </div>
//       )}
//       {paymentStage !== "cancelled" && (
//         <MainButton
//           text="Cancel Order"
//           onClick={handleCancelTransaction}
//           variant="danger"
//           fullWidth
//         />
//       )}
//       <DeliveryInformationBox
//         address={address}
//         store={store}
//         expedition={expedition}
//       />
//       <TransactionItemsTable items={order_details} />
//     </div>
//   );
// };

{
  /* <MainButton
              text="Upload Payment Proof"
              onClick={handleFileUpload}
              variant="primary"
              fullWidth
            /> */
}
