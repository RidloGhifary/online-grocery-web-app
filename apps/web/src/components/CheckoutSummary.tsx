import React, { useState, useEffect } from "react";
import MainButton from "@/components/MainButton";
import convertToRupiah from "@/utils/convertRupiah";

interface Voucher {
  id: string;
  discountAmount: number;
  type: "product" | "delivery";
}

interface Product {
  name: string;
  price: number;
  image: string | null;
  description: string;
}

interface CartItem {
  id: number;
  qty: number;
  product: Product;
}

interface CheckoutSummaryProps {
  items: CartItem[];
  selectedProductVoucher: Voucher | null;
  selectedDeliveryVoucher: Voucher | null;
  onProductVoucherSelect: (voucher: Voucher) => void;
  onDeliveryVoucherSelect: (voucher: Voucher) => void;
  buttonText: string;
  showDeliveryPrice?: boolean;
  deliveryPrice?: number;
  subtotal: number;
  deliveryTotal: number;
  disableButton?: boolean;
  productVouchers: Voucher[];
  deliveryVouchers: Voucher[];
  onCheckout: () => void;
  showVoucherButton?: boolean;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  items,
  selectedProductVoucher,
  selectedDeliveryVoucher,
  onProductVoucherSelect,
  onDeliveryVoucherSelect,
  buttonText,
  showDeliveryPrice = true,
  deliveryPrice,
  subtotal,
  deliveryTotal,
  disableButton = false,
  onCheckout,
  productVouchers,
  deliveryVouchers,
  showVoucherButton = true,
}) => {
  const [selectedProductVoucherId, setSelectedProductVoucherId] = useState<
    string | null
  >(selectedProductVoucher?.id || null);
  const [selectedDeliveryVoucherId, setSelectedDeliveryVoucherId] = useState<
    string | null
  >(selectedDeliveryVoucher?.id || null);

  useEffect(() => {
    setSelectedProductVoucherId(selectedProductVoucher?.id || null);
    setSelectedDeliveryVoucherId(selectedDeliveryVoucher?.id || null);
  }, [selectedProductVoucher, selectedDeliveryVoucher]);

  useEffect(() => {
    console.log("Product Vouchers:", productVouchers);
    console.log("Delivery Vouchers:", deliveryVouchers);
  }, [productVouchers, deliveryVouchers]);

  const discountedSubtotal =
    subtotal - (selectedProductVoucher?.discountAmount || 0);
  const discountedDelivery =
    deliveryTotal - (selectedDeliveryVoucher?.discountAmount || 0);
  const finalTotal =
    discountedSubtotal + (showDeliveryPrice ? discountedDelivery : 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 rounded-lg bg-white p-6 shadow-lg lg:static lg:mt-6 lg:shadow-none">
      <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

      <div className="mb-2 flex justify-between">
        <span>Subtotal:</span>
        <span>{convertToRupiah(discountedSubtotal)}</span>
      </div>

      {showDeliveryPrice && (
        <div className="mb-2 flex justify-between">
          <span>Delivery:</span>
          <span>
            {convertToRupiah(isNaN(deliveryTotal) ? 0 : deliveryTotal)}
          </span>
        </div>
      )}

      {selectedProductVoucher && (
        <div className="mb-2 flex justify-between">
          <span>Product Voucher ({selectedProductVoucher.id}):</span>
          <span>-{convertToRupiah(selectedProductVoucher.discountAmount)}</span>
        </div>
      )}

      {selectedDeliveryVoucher && (
        <div className="mb-2 flex justify-between">
          <span>Delivery Voucher ({selectedDeliveryVoucher.id}):</span>
          <span>
            -{convertToRupiah(selectedDeliveryVoucher.discountAmount)}
          </span>
        </div>
      )}

      <div className="mb-4 flex justify-between border-t pt-4">
        <span>Total:</span>
        <span>{convertToRupiah(finalTotal)}</span>
      </div>

      {showVoucherButton && (
        <>
          <label>Product Voucher</label>
          <select
            value={selectedProductVoucherId || ""}
            onChange={onProductVoucherSelect}
          >
            <option value="">Select Product Voucher</option>
            {productVouchers.map((voucher) => (
              <option key={voucher.id} value={voucher.id}>
                {voucher.type === "product" &&
                  `-${voucher.discountAmount}% off`}
              </option>
            ))}
          </select>

          <label>Delivery Voucher</label>
          <select
            value={selectedDeliveryVoucherId || ""}
            onChange={onDeliveryVoucherSelect}
          >
            <option value="">Select Delivery Voucher</option>
            {deliveryVouchers.map((voucher) => (
              <option key={voucher.id} value={voucher.id}>
                {voucher.type === "delivery" &&
                  `-${voucher.discountAmount}% off`}
              </option>
            ))}
          </select>
        </>
      )}

      <MainButton
        text={buttonText}
        onClick={onCheckout}
        variant="secondary"
        disabled={disableButton}
        fullWidth
      />
    </div>
  );
};

export default CheckoutSummary;

// import React from "react";
// import VoucherButton from "@/components/VoucherButton";
// import MainButton from "@/components/MainButton";
// import convertToRupiah from "@/utils/convertRupiah";

// interface Product {
//   name: string;
//   price: number;
//   image: string | null;
//   description: string;
// }

// interface CartItem {
//   id: number;
//   qty: number;
//   product: Product;
// }

// interface CheckoutSummaryProps {
//   items: CartItem[];
//   selectedVoucher: string | null;
//   onVoucherSelect: (voucher: string) => void;
//   buttonText: string;
//   showDeliveryPrice?: boolean;
//   deliveryPrice?: number;
//   disableButton?: boolean;
//   onCheckout: () => void;
//   showVoucherButton?: boolean;
//   showSubtotal?: boolean;
// }

// const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
//   items,
//   selectedVoucher,
//   onVoucherSelect,
//   buttonText,
//   showDeliveryPrice = true,
//   deliveryPrice,
//   disableButton = false,
//   onCheckout,
//   showVoucherButton = true,
//   showSubtotal = true,
// }) => {
//   const totalPrice = items.reduce(
//     (total, item) => total + item.qty * item.product?.price,
//     0,
//   );

//   return (
//     <div className="fixed bottom-0 left-0 right-0 rounded-lg bg-white p-6 shadow-lg lg:static lg:mt-6 lg:shadow-none">
//       <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

//       {showSubtotal && (
//         <div className="mb-2 flex justify-between">
//           <span>Subtotal:</span>
//           <span>{convertToRupiah(totalPrice)}</span>
//         </div>
//       )}

//       {showDeliveryPrice && (
//         <div className="mb-2 flex justify-between">
//           <span>Delivery:</span>
//           <span>{convertToRupiah(deliveryPrice)}</span>
//         </div>
//       )}

//       {selectedVoucher && (
//         <div className="mb-2 flex justify-between">
//           <span>Discount ({selectedVoucher}):</span>
//           <span>-{convertToRupiah(5.0)}</span> {/* Sample discount value */}
//         </div>
//       )}

//       <div className="mb-4 flex justify-between border-t pt-4">
//         <span>Total:</span>
//         <span>
//           {convertToRupiah(
//             totalPrice +
//               (showDeliveryPrice ? deliveryPrice : 0) -
//               (selectedVoucher ? 5.0 : 0),
//           )}
//         </span>
//       </div>

//       {showVoucherButton && (
//         <VoucherButton
//           selectedVoucher={selectedVoucher}
//           onVoucherSelect={onVoucherSelect}
//         />
//       )}

//       <MainButton
//         text={buttonText}
//         onClick={onCheckout}
//         variant="secondary"
//         disabled={disableButton}
//         fullWidth
//       />
//     </div>
//   );
// };

// export default CheckoutSummary;
