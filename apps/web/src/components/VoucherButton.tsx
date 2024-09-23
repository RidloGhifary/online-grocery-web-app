"use client";
import React, { useState, useEffect } from "react";
import { RiCoupon3Line } from "react-icons/ri";

interface VoucherButtonProps {
  selectedVoucher: string | null;
  onVoucherSelect: (voucher: string) => void;
  vouchers: string[]; // List of available vouchers
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
    const selected = vouchers[0]; // Select the first voucher as an example
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

// "use client";
// import React, { useState, useEffect } from "react";
// import { RiCoupon3Line } from "react-icons/ri";

// interface VoucherButtonProps {
//   selectedVoucher: string | null;
//   onVoucherSelect: (voucher: string) => void;
//   vouchers: string[]; // Dynamic list of vouchers
//   label: string; // Label for product or delivery vouchers
// }

// const VoucherButton: React.FC<VoucherButtonProps> = ({
//   selectedVoucher,
//   onVoucherSelect,
//   vouchers,
//   label,
// }) => {
//   const [voucher, setVoucher] = useState<string | null>(selectedVoucher);

//   const handleClick = () => {
//     if (vouchers.length > 0) {
//       const selected = vouchers[Math.floor(Math.random() * vouchers.length)];
//       setVoucher(selected);
//       onVoucherSelect(selected);
//     }
//   };

//   useEffect(() => {
//     setVoucher(selectedVoucher);
//   }, [selectedVoucher]);

//   return (
//     <button
//       onClick={handleClick}
//       className="bg-light-green-200 flex items-center rounded-lg border-2 border-green-600 px-4 py-2 font-bold text-green-800"
//     >
//       <RiCoupon3Line className="mr-2 text-2xl" />
//       {voucher ? `${label}: ${voucher}` : `Select ${label}`}
//     </button>
//   );
// };

// export default VoucherButton;

// "use client";
// import React, { useState, useEffect } from "react";
// import { RiCoupon3Line } from "react-icons/ri";

// interface VoucherButtonProps {
//   selectedVoucher: string | null;
//   onVoucherSelect: (voucher: string) => void;
// }

// const VoucherButton: React.FC<VoucherButtonProps> = ({
//   selectedVoucher,
//   onVoucherSelect,
// }) => {
//   const [voucher, setVoucher] = useState<string | null>(selectedVoucher);

//   const handleClick = () => {
//     const availableVouchers = ["DISCOUNT10", "FREESHIP", "WELCOME5"];
//     const selected =
//       availableVouchers[Math.floor(Math.random() * availableVouchers.length)];
//     setVoucher(selected);
//     onVoucherSelect(selected);
//   };

//   useEffect(() => {
//     setVoucher(selectedVoucher);
//   }, [selectedVoucher]);

//   return (
//     <button
//       onClick={handleClick}
//       className="bg-light-green-200 flex items-center rounded-lg border-2 border-green-600 px-4 py-2 font-bold text-green-800"
//     >
//       <RiCoupon3Line className="mr-2 text-2xl" />
//       {voucher ? `Selected Voucher: ${voucher}` : "Select a Voucher"}
//     </button>
//   );
// };

// export default VoucherButton;
