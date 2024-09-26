"use client";
import React, { useEffect, useState } from "react";
import {
  getOrderById,
  handlePaymentProof,
  deliverProduct,
  cancelOrder,
} from "@/api/warehouse/route";
import MainLink from "@/components/MainLink";
import CustomerOrderDetails from "./CostumerOrderDetails";
import OrderStatusInfo from "./OrderStatusInfo";
import RequestedItemsTable from "./RequestedItemsTable";
import { useParams } from "next/navigation";
import { OrderDetailResponse } from "@/api/warehouse/route";
import { UserProps } from "@/interfaces/user";
import { Modal } from "@/components/features-2/ui/Modal";

interface Props {
  user: UserProps | null;
}

const DetailedOrdersContentAdmin: React.FC<Props> = ({ user }) => {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (id) {
      try {
        const orderData = await getOrderById(Number(id));
        setOrder(orderData.data);

        if (user) {
          const isSuperAdmin = user?.role?.includes("super_admin");
          const isStoreAdminOfOrder = orderData.data.isStoreAdminOfOrder;

          if (isSuperAdmin || isStoreAdminOfOrder) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
            console.error("Unauthorized access - Role or Store mismatch");
            setErrorMessage("Unauthorized access - Role or Store mismatch");
          }
        } else {
          setIsAuthorized(false);
          console.error("No user detected");
          setErrorMessage("No user detected");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        setErrorMessage("Error fetching order");
      }
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id, user]);

  const handlePaymentAction = async (action: "accept" | "decline") => {
    if (id && isAuthorized) {
      try {
        await handlePaymentProof(Number(id), action);
        await fetchOrder();
        setShowPaymentModal(false);
      } catch (error) {
        console.error("Error updating payment status:", error);
        setErrorMessage("Error updating payment status");
      }
    }
  };

  const handleDeliver = async () => {
    if (id && isAuthorized) {
      try {
        await deliverProduct(Number(id));
        await fetchOrder();
        setShowDeliveryModal(false);
      } catch (error) {
        console.error("Error delivering product:", error);
        setErrorMessage("Error delivering product");
        setErrorMessage("Error canceling order");
      }
    }
  };

  const handleCancel = async () => {
    if (id && isAuthorized) {
      try {
        await cancelOrder(Number(id));
        await fetchOrder();
      } catch (error) {
        console.error("Error canceling order:", error);
      }
    }
  };

  if (!order)
    return (
      <div className="text-primary font-semibold text-center mb-8">
        Loading...
      </div>
    );

  if (!isAuthorized)
    return (
      <div className="text-red-600 font-semibold text-center mb-8">
        You are not authorized to view this order.
      </div>
    );

  return (
    <div className="p-4">
      <MainLink
        href="/manage/orders"
        text="← Back to order management list"
        Icon={() => <span></span>}
      />
      <CustomerOrderDetails order={order} />
      <OrderStatusInfo order={order} />
      {order.order_status?.id === 2 && (
        <div className="mt-6 text-center">
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white"
            onClick={() => setShowPaymentModal(true)}
          >
            Handle Payment Proof
          </button>
        </div>
      )}
      <Modal
        closeButton={false}
        show={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      >
        <div className="text-center">
          <p className="mb-12 text-lg font-semibold">
            Handle Customer Payment Proof
          </p>
          <img
            src={order.payment_proof}
            alt="Payment Proof"
            className="mx-auto mb-8 h-24 w-48 cursor-pointer rounded-lg border-[4px] object-cover duration-200 ease-in-out hover:scale-105 hover:border-primary"
            onClick={() => window.open(order.payment_proof, "_blank")}
          />
          <div className="flex justify-center space-x-4">
            <button
              className="rounded bg-primary px-4 py-2 text-white duration-200 ease-in-out hover:scale-105"
              onClick={() => handlePaymentAction("accept")}
            >
              Accept
            </button>
            <button
              className="rounded bg-red-500 px-4 py-2 text-white duration-200 ease-in-out hover:scale-105"
              onClick={() => handlePaymentAction("decline")}
            >
              Decline
            </button>
          </div>
        </div>
      </Modal>
      {order.order_status?.id === 3 && (
        <div className="mt-6 text-center">
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white"
            onClick={() => setShowDeliveryModal(true)}
          >
            Confirm product availability
          </button>
        </div>
      )}
      <Modal
        closeButton={false}
        show={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
      >
        <div className="text-center">
          <p className="mb-12 text-lg font-semibold">
            Confirm Product Availability
          </p>
          {order.order_details.map((item) => (
            <div key={item.product_id} className="mb-6">
              <p>
                User's request: {item.qty} X {item.product.name}
              </p>
            </div>
          ))}
          <div className="flex justify-center space-x-4">
            <button
              className="rounded bg-primary px-4 py-2 text-white duration-200 ease-in-out hover:scale-105"
              onClick={handleDeliver}
            >
              Deliver
            </button>
            <button
              className="rounded bg-red-500 px-4 py-2 text-white duration-200 ease-in-out hover:scale-105"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <div className="mt-12">
        <p className="mb-8 text-center text-xl font-semibold">
          Costumer's Requested Items:
        </p>
        <RequestedItemsTable items={order.order_details} />
      </div>
      {errorMessage && (
        <div className="mt-8 text-center text-red-600 font-semibold">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default DetailedOrdersContentAdmin;
