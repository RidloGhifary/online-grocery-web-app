"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserAddressProps, UserProps } from "@/interfaces/user";
import Link from "next/link";
import AddressCard from "./AddressCard";
import { Modal } from "@/components/Modal";

export default function AddressSection({
  user,
  setSelectedAddress,
  selectedAddress,
}: {
  user: UserProps | null;
  setSelectedAddress: (address: UserAddressProps | null) => void;
  selectedAddress: UserAddressProps | null;
}) {
  const [modalActive, setModalActive] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <div className="w-full">
      {user?.addresses && user.addresses.length === 0 ? (
        <Link
          href={`/user/address?action=add-address&callbackUrl=${pathname}`}
          className="block rounded-md border border-error p-4 text-center"
        >
          You have no primary address yet.{" "}
          <span className="link link-primary">Click here</span> to add one.
        </Link>
      ) : (
        <>
          <AddressCard address={selectedAddress} currentUser={user} />
          <button
            onClick={() => setModalActive(true)}
            className="btn btn-primary btn-sm mt-4 text-white"
          >
            Change address
          </button>
        </>
      )}
      <Modal
        show={modalActive}
        onClose={(e) => {
          setModalActive(false);
        }}
      >
        <div className="flex max-h-[50vh] w-full flex-col gap-2 overflow-y-auto">
          {user?.addresses?.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              currentUser={user}
              use_primary_button
              setSelectedAddress={setSelectedAddress}
              selectedAddress={selectedAddress}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}
