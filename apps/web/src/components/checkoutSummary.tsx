import React from "react";
import VoucherButton from "@/components/VoucherButton";
import MainButton from "@/components/MainButton";
import { convertToRupiah } from "@/utils/ConvertRupiah";

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
  showVoucherButton?: boolean;
  showSubtotal?: boolean;
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
  showVoucherButton = true,
  showSubtotal = true,
}) => {
  const totalPrice = items.reduce(
    (total, item) => total + item.qty * item.product.price,
    0,
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 rounded-lg bg-white p-6 shadow-lg lg:static lg:mt-6 lg:shadow-none">
      <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

      {showSubtotal && (
        <div className="mb-2 flex justify-between">
          <span>Subtotal:</span>
          <span>{convertToRupiah(totalPrice)}</span>
        </div>
      )}

      {showDeliveryPrice && (
        <div className="mb-2 flex justify-between">
          <span>Delivery:</span>
          <span>{convertToRupiah(deliveryPrice)}</span>
        </div>
      )}

      {selectedVoucher && (
        <div className="mb-2 flex justify-between">
          <span>Discount ({selectedVoucher}):</span>
          <span>-{convertToRupiah(5.0)}</span> {/* Sample discount value */}
        </div>
      )}

      <div className="mb-4 flex justify-between border-t pt-4">
        <span>Total:</span>
        <span>
          {convertToRupiah(
            totalPrice +
              (showDeliveryPrice ? deliveryPrice : 0) -
              (selectedVoucher ? 5.0 : 0),
          )}
        </span>
      </div>

      {showVoucherButton && (
        <VoucherButton
          selectedVoucher={selectedVoucher}
          onVoucherSelect={onVoucherSelect}
        />
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
