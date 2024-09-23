import React from "react";
import { OrderDetailResponse } from "@/api/warehouse/route";

interface Props {
  order: OrderDetailResponse;
}

const CustomerOrderDetails: React.FC<Props> = ({ order }) => {
  return (
    <div className="mt-4 rounded-lg border p-4 shadow-lg">
      <h2 className="mb-4 text-xl font-bold">Order/Transaction Details</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <p>
            <strong>Customer:</strong> {order.customer.first_name}{" "}
            {order.customer.last_name}
          </p>
          <p>
            <strong>Invoice:</strong> {order.invoice}
          </p>
          <p>
            <strong>Destination:</strong> {order.address.address},{" "}
            {order.address.city.city_name}
          </p>
          <p>
            <strong>Items Total:</strong>{" "}
            {order.totalProductPrice.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </p>
          <p>
            <strong>Delivery Total:</strong>{" "}
            {order.deliveryPrice.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </p>
          <p>
            <strong>Sub Total:</strong>{" "}
            {(order.totalProductPrice + order.deliveryPrice).toLocaleString(
              "id-ID",
              { style: "currency", currency: "IDR" },
            )}
          </p>
          <p>
            <strong>Recipient Store:</strong> {order.store.name},{" "}
            {order.store.city.city_name}
          </p>
        </div>
        <div className="mx-auto mt-[-2rem]">
          <div>
            <p className="mb-2 mt-4 font-bold">User's Payment Proof:</p>
          </div>
          <img
            src={order.payment_proof}
            alt="Payment Proof"
            className="mb-4 h-24 w-48 cursor-pointer rounded-lg border-[4px] object-cover hover:border-primary"
            onClick={() => window.open(order.payment_proof, "_blank")}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderDetails;

// import React from "react";
// import { OrderDetailResponse } from "@/api/warehouse/route";

// interface Props {
//   order: OrderDetailResponse;
// }

// const CostumerOrderDetails: React.FC<Props> = ({ order }) => {
//   return (
//     <div className="mt-4 rounded-lg border p-4 shadow-lg">
//       <h2 className="mb-4 text-xl font-bold">Order/Transaction Details</h2>
//       <p>
//         <strong>Customer:</strong> {order.customer.first_name}{" "}
//         {order.customer.last_name}
//       </p>
//       <p>
//         <strong>Invoice:</strong> {order.invoice}
//       </p>
//       <p>
//         <strong>Destination:</strong> {order.address.address},{" "}
//         {order.address.city.city_name}
//       </p>
//       <p>
//         <strong>Items Total:</strong>{" "}
//         {order.totalProductPrice.toLocaleString("id-ID", {
//           style: "currency",
//           currency: "IDR",
//         })}
//       </p>
//       <p>
//         <strong>Delivery Total:</strong>{" "}
//         {order.deliveryPrice.toLocaleString("id-ID", {
//           style: "currency",
//           currency: "IDR",
//         })}
//       </p>
//       <p>
//         <strong>Sub Total:</strong>{" "}
//         {(order.totalProductPrice + order.deliveryPrice).toLocaleString(
//           "id-ID",
//           { style: "currency", currency: "IDR" },
//         )}
//       </p>
//       <p>
//         <strong>Recipient Store:</strong> {order.store.name},{" "}
//         {order.store.city.city_name}
//       </p>
//     </div>
//   );
// };

// export default CostumerOrderDetails;
