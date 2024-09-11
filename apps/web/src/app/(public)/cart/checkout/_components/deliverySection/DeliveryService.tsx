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
  setSelectedCourierPrice: (value: number) => void;
  deliveryService: number;
  deliveryData: DeliveryDataProps[];
}

export default function DeliveryService({
  setDeliveryService,
  deliveryService,
  deliveryData,
  setSelectedCourierPrice,
}: Props) {
  return (
    <div>
      <label htmlFor="deliveryService" className="block font-semibold">
        Delivery Service
      </label>
      <select
        id="deliveryService"
        value={deliveryService}
        onChange={(e) => {
          const selectedIndex = e.target.selectedIndex;
          const selectedPrice = deliveryData[selectedIndex]?.cost[0]?.value;

          setDeliveryService(e.target.value);
          setSelectedCourierPrice(selectedPrice);
        }}
        className="select select-bordered w-full"
      >
        {deliveryData?.map((data, i) => (
          <option key={i} value={data?.cost[0]?.value}>
            {data?.service} - {convertRupiah(data?.cost[0]?.value)}
          </option>
        ))}
      </select>
    </div>
  );
}
