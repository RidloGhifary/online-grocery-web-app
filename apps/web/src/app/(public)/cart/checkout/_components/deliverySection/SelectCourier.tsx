import React from "react";
import { deliveryOptions } from "@/constants/index";

interface DeliveryServiceProps {
  selectedCourier: string;
  setSelectedCourier: (service: string) => void;
}

const SelectCourier: React.FC<DeliveryServiceProps> = ({
  selectedCourier,
  setSelectedCourier,
}) => {
  return (
    <div>
      <label htmlFor="courier" className="block font-semibold">
        Pick a Courier
      </label>
      <select
        id="courier"
        value={selectedCourier}
        onChange={(e) => setSelectedCourier(e.target.value)}
        className="select select-bordered w-full"
      >
        {deliveryOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectCourier;
