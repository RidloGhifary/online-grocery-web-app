'use client';
import React, { useState, useEffect } from 'react';
import { RiCoupon3Line } from 'react-icons/ri';

interface VoucherButtonProps {
  selectedVoucher: string | null;
  onVoucherSelect: (voucher: string) => void;
}

const VoucherButton: React.FC<VoucherButtonProps> = ({ selectedVoucher, onVoucherSelect }) => {
  const [voucher, setVoucher] = useState<string | null>(selectedVoucher);

  const handleClick = () => {
    const availableVouchers = ['DISCOUNT10', 'FREESHIP', 'WELCOME5'];
    const selected = availableVouchers[Math.floor(Math.random() * availableVouchers.length)];
    setVoucher(selected);
    onVoucherSelect(selected);
  };

  useEffect(() => {
    setVoucher(selectedVoucher); 
  }, [selectedVoucher]);

  return (
    <button
      onClick={handleClick}
      className="flex items-center bg-light-green-200 border-2 border-green-600 text-green-800 font-bold py-2 px-4 rounded-lg"
    >
      <RiCoupon3Line className="mr-2 text-2xl" />
      {voucher ? `Selected Voucher: ${voucher}` : 'Select a Voucher'}
    </button>
  );
};

export default VoucherButton;