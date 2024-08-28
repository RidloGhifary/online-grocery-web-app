import React from "react";
import VoucherButton from "@/components/VoucherButton";
import MainButton from "@/components/MainButton";

interface CheckoutSummaryProps {
  items: { id: number; price: number; quantity: number }[];
  selectedVoucher: string | null;
  onVoucherSelect: (voucher: string) => void;
  buttonText: string;
  showDeliveryPrice?: boolean;
  deliveryPrice?: number;
  disableButton?: boolean;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  items,
  selectedVoucher,
  onVoucherSelect,
  buttonText,
  showDeliveryPrice,
  deliveryPrice,
  disableButton = false,
}) => {
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const subtotalPrice = showDeliveryPrice
    ? totalPrice + (deliveryPrice || 0)
    : totalPrice;

  return (
    <div className="fixed bottom-0 left-0 right-0 rounded-lg bg-white p-6 shadow-lg lg:static lg:mt-6 lg:shadow-none">
      <h2 className="mb-4 text-xl font-bold">Summary</h2>
      <div className="mb-4 flex justify-between">
        <span>Total Price:</span>
        <span>Rp. {totalPrice.toFixed(2)}</span>
      </div>

      {showDeliveryPrice && (
        <>
          <div className="mb-4 flex justify-between">
            <span>Delivery Price:</span>
            <span>Rp. {deliveryPrice?.toFixed(2)}</span>
          </div>
          <div className="mb-4 flex justify-between">
            <span>Subtotal:</span>
            <span>Rp. {subtotalPrice.toFixed(2)}</span>
          </div>
        </>
      )}

      <VoucherButton
        selectedVoucher={selectedVoucher}
        onVoucherSelect={onVoucherSelect}
      />

      <MainButton
        text={buttonText}
        onClick={() => {}}
        variant="primary"
        fullWidth
        disabled={disableButton}
      />
    </div>
  );
};

export default CheckoutSummary;
