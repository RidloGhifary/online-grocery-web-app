import React from "react";
import VoucherButton from "@/components/VoucherButton";
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
  // Add console logs to trace calculations
  console.log("Items:", items);
  console.log("Subtotal before discount:", subtotal);
  console.log("Selected Product Voucher:", selectedProductVoucher);
  console.log("Selected Delivery Voucher:", selectedDeliveryVoucher);
  console.log("Delivery Total:", deliveryTotal);

  const discountedSubtotal =
    subtotal - (selectedProductVoucher?.discountAmount || 0);
  console.log("Discounted Subtotal:", discountedSubtotal);

  const discountedDelivery =
    deliveryTotal - (selectedDeliveryVoucher?.discountAmount || 0);
  console.log("Discounted Delivery:", discountedDelivery);

  const finalTotal =
    discountedSubtotal + (showDeliveryPrice ? discountedDelivery : 0);
  console.log("Final Total:", finalTotal);

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
          <span>{convertToRupiah(deliveryTotal)}</span>
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
          <VoucherButton
            selectedVoucher={selectedProductVoucher?.id || null}
            onVoucherSelect={onProductVoucherSelect}
            vouchers={productVouchers.map((v) => v.id)}
            label="Product Voucher"
          />
          <VoucherButton
            selectedVoucher={selectedDeliveryVoucher?.id || null}
            onVoucherSelect={onDeliveryVoucherSelect}
            vouchers={deliveryVouchers.map((v) => v.id)}
            label="Delivery Voucher"
          />
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
