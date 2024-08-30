"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";

import AddAddressForm from "./AddAddressForm";
import { UserAddressProps } from "@/interfaces/user";
import DeleteAddress from "./DeleteAddress";
import UsePrimaryAddressButton from "./UsePrimaryAddressButton";

export default function AddressContent({
  userAddresses,
}: {
  userAddresses: UserAddressProps[];
}) {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");

  return (
    <>
      {action === "add-address" ? (
        <AddAddressForm />
      ) : (
        <div className="space-y-4">
          <Link
            href="/user/address?action=add-address"
            className="btn btn-primary btn-sm text-white"
          >
            <FiPlus />
            Add Address
          </Link>

          <div className="max-h-[100vh] space-y-4 overflow-y-auto">
            {userAddresses?.map((userAddress: any, i: number) => (
              <div
                key={i}
                className="w-full space-y-2 rounded-md border border-primary bg-primary/10 p-4 shadow"
              >
                <div className="flex items-center gap-2">
                  <p className="badge badge-primary badge-sm capitalize text-white">
                    {userAddress?.label}
                  </p>
                  <span>
                    {userAddress?.is_primary && (
                      <FaCheck className="text-primary" />
                    )}
                  </span>
                </div>
                <p className="font-semibold">Ridlo achmad ghifary</p>
                <p className="max-w-[70%] text-sm font-light">
                  {userAddress?.address}
                  <br />
                  {userAddress?.city.city_name},{" "}
                  {userAddress?.city.province.province}
                </p>
                <div className="flex items-center gap-2">
                  {!userAddress?.is_primary && (
                    <UsePrimaryAddressButton id={userAddress?.id} />
                  )}
                  <DeleteAddress id={userAddress?.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
