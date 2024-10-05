import React, { useState, useEffect } from "react";
import MainButton from "@/components/MainButton";
import convertToRupiah from "@/utils/convertRupiah";

// interface Voucher {
//   id: string;
//   voucher: string;
//   discountAmount: number;
//   type: "product" | "delivery";
//   discountType: "percentage" | "nominal";
//   description: string;
// }

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
  selectedProductVoucher: any | null;
  selectedDeliveryVoucher: any | null;
  onProductVoucherSelect?: (voucher: any) => void;
  onDeliveryVoucherSelect?: (voucher: any) => void;
  buttonText: string;
  showDeliveryPrice?: boolean;
  deliveryPrice?: number;
  subtotal: number;
  deliveryTotal: number;
  disableButton?: boolean;
  productVouchers?: any[];
  deliveryVouchers?: any[];
  onCheckout: () => void;
  showVoucherButton?: boolean;
  customSubtotalCalculator?: () => number;
  showTotal?: boolean;
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
  productVouchers = [],
  deliveryVouchers = [],
  showVoucherButton = true,
  customSubtotalCalculator,
  showTotal = true,
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

  const calculateDiscount = (voucher: any | null, total: number) => {
    if (!voucher) return 0;
    if (voucher.discountType === "percentage") {
      return (voucher.discountAmount / 100) * total;
    }
    return voucher.discountAmount;
  };

  const effectiveSubtotal = customSubtotalCalculator
    ? customSubtotalCalculator()
    : subtotal;

  const finalTotal = subtotal + deliveryTotal;

  return (
    <div className="fixed bottom-0 left-0 right-0 rounded-lg bg-white p-4 shadow-lg lg:static lg:mt-6 lg:shadow-none">
      <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
      <div className="mb-2 flex justify-between">
        <span>Subtotal:</span>
        <span>{convertToRupiah(effectiveSubtotal)}</span>
      </div>
      {showDeliveryPrice && (
        <div className="mb-2 flex justify-between">
          <span>Delivery:</span>
          <span>
            {convertToRupiah(isNaN(deliveryTotal) ? 0 : deliveryTotal)}
          </span>
        </div>
      )}{" "}
      {showTotal && (
        <div className="mb-2 flex justify-between border-t pt-4">
          <span>Total:</span>
          <span>{convertToRupiah(finalTotal)}</span>
        </div>
      )}
      {showVoucherButton && (
        <>
          <label className="mb-1 block font-semibold">Product Voucher</label>
          <select
            value={selectedProductVoucherId || ""}
            onChange={onProductVoucherSelect}
            className="mb-4 block w-full rounded-lg border-2 border-primary text-base hover:border-secondary focus:outline-none"
          >
            <option value="">Select Product Voucher</option>
            {productVouchers.map((voucher) => (
              <option key={voucher.id} value={voucher.id}>
                {voucher.voucher}
              </option>
            ))}
          </select>

          <label className="mb-1 block font-semibold">Delivery Voucher</label>
          <select
            value={selectedDeliveryVoucherId || ""}
            onChange={onDeliveryVoucherSelect}
            className="block w-full rounded-lg border-2 border-primary text-base hover:border-secondary focus:outline-none"
          >
            <option value="">Select Delivery Voucher</option>
            {deliveryVouchers.map((voucher) => (
              <option key={voucher.id} value={voucher.id}>
                {voucher.voucher}
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
        className="mt-6"
        fullWidth
      />
    </div>
  );
};

export default CheckoutSummary;
