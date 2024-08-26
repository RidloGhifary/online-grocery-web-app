import React from 'react';
import { deliveryOptions } from '@/constants/index';

interface DeliveryServiceProps {
  selectedDeliveryService: string;
  onSelect: (service: string) => void;
  deliveryNotes: string;
  onNotesChange: (notes: string) => void;
}

const DeliveryService: React.FC<DeliveryServiceProps> = ({
  selectedDeliveryService,
  onSelect,
  deliveryNotes,
  onNotesChange
}) => {
  return (
    <div>
      <label htmlFor="deliveryService" className="block font-semibold">Delivery Service</label>
      <select
        id="deliveryService"
        value={selectedDeliveryService}
        onChange={(e) => onSelect(e.target.value)}
        className="select select-bordered w-full"
      >
        {deliveryOptions.map(option => (
          <option key={option.id} value={option.id}>
            {option.name} - ${option.price}
          </option>
        ))}
      </select>
      <label htmlFor="deliveryNotes" className="block font-semibold mt-4">Delivery Notes</label>
      <textarea
        id="deliveryNotes"
        value={deliveryNotes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="textarea textarea-bordered w-full"
        placeholder="Any special instructions?"
      ></textarea>
    </div>
  );
};

export default DeliveryService;
