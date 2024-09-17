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
  username,
  api_url,
}: {
  userAddresses: UserAddressProps[];
  username: string;
  api_url: string;
}) {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");

  return (
    <>
      {action === "add-address" ? (
        <AddAddressForm api_url={api_url} />
      ) : (
        <div className="space-y-4">
          <Link
            href="/user/address?action=add-address"
            className={`btn btn-primary ${userAddresses?.length === 0 ? "btn-md w-full" : "btn-sm"} text-white`}
          >
            <FiPlus />
            {userAddresses?.length === 0
              ? "Add Address"
              : "Add Another Address"}
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
                <p className="font-semibold">{username}</p>
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
