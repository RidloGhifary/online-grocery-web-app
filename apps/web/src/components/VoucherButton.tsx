"use client";
import React, { useState, useEffect } from "react";
import { RiCoupon3Line } from "react-icons/ri";

interface VoucherButtonProps {
  selectedVoucher: string | null;
  onVoucherSelect: (voucher: string) => void;
  vouchers: string[];
  label: string;
}

const VoucherButton: React.FC<VoucherButtonProps> = ({
  selectedVoucher,
  onVoucherSelect,
  vouchers,
  label,
}) => {
  const [voucher, setVoucher] = useState<string | null>(selectedVoucher);

  const handleClick = () => {
    if (vouchers.length === 0) return;
    const selected = vouchers[0];
    setVoucher(selected);
    onVoucherSelect(selected);
  };

  useEffect(() => {
    setVoucher(selectedVoucher);
  }, [selectedVoucher]);

  return (
    <button
      onClick={handleClick}
      className="bg-light-green-200 flex items-center rounded-lg border-2 border-green-600 px-4 py-2 font-bold text-green-800"
    >
      <RiCoupon3Line className="mr-2 text-2xl" />
      {voucher ? `Selected Voucher: ${voucher}` : label}
    </button>
  );
};

export default VoucherButton;
