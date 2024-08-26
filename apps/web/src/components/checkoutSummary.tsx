import React from 'react';
import VoucherButton from '@/components/VoucherButton';

interface CheckoutSummaryProps {
  items: { id: number; price: number; quantity: number; }[];
  selectedVoucher: string | null;
  onVoucherSelect: (voucher: string) => void;
  buttonText: string;
  showDeliveryPrice?: boolean;
  deliveryPrice?: number;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ items, selectedVoucher, onVoucherSelect, buttonText, showDeliveryPrice, deliveryPrice }) => {
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="bg-white rounded-lg p-6 lg:mt-6 lg:static fixed bottom-0 left-0 right-0 shadow-lg lg:shadow-none">
      <h2 className="text-xl font-bold mb-4">Summary</h2>
      <div className="flex justify-between mb-4">
        <span>Total Price:</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
      
      {showDeliveryPrice && (
        <div className="flex justify-between mb-4">
          <span>Delivery Price:</span>
          <span>${deliveryPrice?.toFixed(2)}</span>
        </div>
      )}

      <VoucherButton selectedVoucher={selectedVoucher} onVoucherSelect={onVoucherSelect} />

      <button className="btn btn-primary w-full mt-4">{buttonText}</button>
    </div>
  );
};

export default CheckoutSummary;
