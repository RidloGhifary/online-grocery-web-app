"use client";

import { useRouter } from "next/navigation";
import { StoreProps } from "@/interfaces/store";
import Image from "next/image";
import { RiGitBranchLine } from "react-icons/ri";
import { FaStore } from "react-icons/fa";
import convertDate from "@/utils/convertDate";
import DeleteStore from "./DeleteStore";
import { MdEdit } from "react-icons/md";

export default function Store({
  store,
  api_url,
}: {
  store: StoreProps;
  api_url: string;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 rounded-md border bg-white p-4 sm:flex-row">
      <Image
        alt={store.name}
        src={store.image || "/store.webp"}
        width={200}
        height={200}
        className="aspect-square h-[100px] w-[100px] rounded-full object-cover md:h-[120px] md:w-[120px] lg:h-[150px] lg:w-[150px]"
      />
      <div className="space-y-1">
        <h3 className="line-clamp-1 truncate text-lg font-semibold">
          {store.name}
        </h3>
        <p className="flex items-center gap-1 text-sm capitalize text-primary">
          {store.store_type === "branch" ? <RiGitBranchLine /> : <FaStore />}{" "}
          {store.store_type} store
        </p>
        <p className="text-xs md:text-sm">{store?.address}</p>
        <p className="text-xs md:text-sm">
          {store?.city?.city_name + ", " + store?.province?.province}
        </p>
        <p className="text-xs italic md:text-sm">
          Created at {convertDate(new Date(store?.createdAt))}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              router.push(`/user/stores?action=edit-${store.id}-${store.name}`)
            }
            className="btn btn-primary btn-xs text-white sm:btn-sm"
          >
            <MdEdit />
            Edit
          </button>
          <DeleteStore
            id={store.id}
            api_url={api_url}
            store_name={store.name}
          />
        </div>
      </div>
    </div>
  );
}
