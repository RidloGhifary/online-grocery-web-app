import React from "react";

interface Address {
  address: string;
  city: { city_name: string };
}

interface Store {
  name: string;
  city: { city_name: string };
}

interface Expedition {
  name: string;
}

interface DeliveryInformationBoxProps {
  address: Address;
  store: Store;
  expedition: Expedition;
}

const DeliveryInformationBox: React.FC<DeliveryInformationBoxProps> = ({
  address,
  store,
  expedition,
}) => {
  return (
    <div className="mt-8 rounded-lg bg-white shadow-md">
      <div className="my-4 bg-gray-200 p-4 text-center text-lg font-bold">
        Delivery Information
      </div>
      <div className="p-4">
        <p>
          <span className="font-semibold">Delivery Address:</span>{" "}
          {address.address}, {address.city.city_name}
        </p>
        <p>
          <span className="font-semibold">Delivery Service:</span>{" "}
          {expedition.display_name}
        </p>
        <p>
          <span className="font-semibold">From Store:</span> {store.name}
        </p>
        <p>
          <span className="font-semibold">Store Address:</span> {store.address},{" "}
          {store.city.city_name}
        </p>
      </div>
    </div>
  );
};

export default DeliveryInformationBox;
