import React from "react";
import VoucherButton from "@/components/VoucherButton";
import MainButton from "@/components/MainButton";

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
  selectedVoucher: string | null;
  onVoucherSelect: (voucher: string) => void;
  buttonText: string;
  showDeliveryPrice?: boolean;
  deliveryPrice?: number;
  disableButton?: boolean;
  onCheckout: () => void;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  items,
  selectedVoucher,
  onVoucherSelect,
  buttonText,
  showDeliveryPrice = true,
  deliveryPrice = 0,
  disableButton = false,
  onCheckout,
}) => {
  const totalPrice = items.reduce(
    (total, item) => total + item.qty * item.product.price,
    0,
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 rounded-lg bg-white p-6 shadow-lg lg:static lg:mt-6 lg:shadow-none">
      <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
      <div className="mb-2 flex justify-between">
        <span>Subtotal:</span>
        <span>Rp. {totalPrice.toFixed(2)}</span>
      </div>
      {showDeliveryPrice && (
        <div className="mb-2 flex justify-between">
          <span>Delivery:</span>
          <span>Rp. {deliveryPrice.toFixed(2)}</span>
        </div>
      )}
      {selectedVoucher && (
        <div className="mb-2 flex justify-between">
          <span>Discount ({selectedVoucher}):</span>
          {/* Discount sample later */}
          <span>-Rp. {(5.0).toFixed(2)}</span>
        </div>
      )}
      <div className="mb-4 flex justify-between border-t pt-4">
        <span>Total:</span>
        <span>
          Rp.
          {(
            totalPrice +
            (showDeliveryPrice ? deliveryPrice : 0) -
            (selectedVoucher ? 5.0 : 0)
          ).toFixed(2)}
        </span>
      </div>
      <VoucherButton
        selectedVoucher={selectedVoucher}
        onVoucherSelect={onVoucherSelect}
      />
      <MainButton
        text={buttonText}
        onClick={onCheckout}
        variant="primary"
        disabled={disableButton}
        fullWidth
      />
    </div>
  );
};

export default CheckoutSummary;
