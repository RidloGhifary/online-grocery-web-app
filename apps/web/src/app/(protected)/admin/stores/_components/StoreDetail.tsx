"use client";

import { useRouter } from "next/navigation";
import { getDetailStores } from "@/actions/stores";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import convertDate from "@/utils/convertDate";

export default function StoreDetailPage({ storeId }: { storeId: number }) {
  const router = useRouter();

  const {
    data: store,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["detail-store", storeId],
    queryFn: () => getDetailStores({ storeId }),
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex h-full min-h-96 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center">
        <p>
          Error:{" "}
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button onClick={() => router.back()} className="btn btn-ghost">
        <MdOutlineKeyboardArrowLeft />
        Back
      </button>
      <div className="flex items-center gap-2">
        <Image
          src={store?.data?.image || "/store.webp"}
          alt={store?.data?.name || "store image"}
          width={150}
          height={150}
          priority
          className="aspect-square h-16 w-16 rounded-full object-cover md:h-20 md:w-20"
        />
        <div>
          <h1 className="text-lg font-bold md:text-xl lg:text-2xl">
            {store?.data?.name}
          </h1>
          <p className="text-sm text-gray-500">
            {store?.data?.store_type} store
          </p>
        </div>
      </div>
      <div className="space-y-1">
        <p className="md:max-w-[70%]">
          {store?.data?.address +
            ", " +
            store?.data?.city?.city_name +
            ", " +
            store?.data?.province?.province +
            ", " +
            store?.data?.city?.postal_code}
        </p>
        <p className="md:max-w-[70%]">
          {store?.data?.city?.city_name +
            ", " +
            store?.data?.province?.province}
        </p>
        <p>
          Created at:{" "}
          <i>{convertDate(new Date(store?.data?.createdAt as string))}</i>
        </p>
      </div>
      <div className="overflow-x-auto">
        <p className="text-lg font-bold">Admin Store :</p>
        <table className="table table-zebra table-pin-cols">
          <thead>
            <tr>
              <th className="text-base font-semibold">Photo</th>
              <th className="text-base font-semibold">First name</th>
              <th className="text-base font-semibold">Last name</th>
              <th className="text-base font-semibold">Email</th>
              <th className="text-base font-semibold">Gender</th>
              <th className="text-base font-semibold">Phone</th>
            </tr>
          </thead>
          <tbody>
            {store?.data?.store_admins?.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  This store has no admin yet.
                </td>
              </tr>
            ) : (
              store?.data?.store_admins?.map((admin) => (
                <tr key={admin.id} className="hover">
                  <td>
                    <Image
                      src={admin?.user?.image || "/images/placeholder.png"}
                      alt={admin?.user?.username || "store image"}
                      width={50}
                      height={50}
                      priority
                      className="aspect-square h-6 w-6 rounded-full object-cover md:h-8 md:w-8"
                    />
                  </td>
                  <td>{admin?.user?.first_name}</td>
                  <td>{admin?.user?.last_name}</td>
                  <td>{admin?.user?.email}</td>
                  <td>{admin?.user?.gender}</td>
                  <td>{admin?.user?.phone_number}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
