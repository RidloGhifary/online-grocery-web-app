"use client";

import convertRupiah from "@/utils/convertRupiah";

interface DeliveryDataProps {
  service: string;
  description: string;
  cost: {
    value: number;
    etd: string;
    note: string | undefined | null;
  }[];
}

interface Props {
  setDeliveryService: (value: any) => void;
  deliveryService: number;
  deliveryData: DeliveryDataProps[];
}

export default function DeliveryService({
  setDeliveryService,
  deliveryService,
  deliveryData,
}: Props) {
  return (
    <div>
      <label htmlFor="deliveryService" className="block font-semibold">
        Delivery Service
      </label>
      <select
        id="deliveryService"
        value={deliveryService}
        onChange={(e) => setDeliveryService(e.target.value)}
        className="select select-bordered w-full"
      >
        {deliveryData?.map((data, i) => (
          <option key={i} value={data?.cost[0]?.value}>
            {data?.service} - {convertRupiah(data?.cost[0]?.value)} - ETD{" "}
            {data?.cost[0]?.etd} days
          </option>
        ))}
      </select>
    </div>
  );
}
