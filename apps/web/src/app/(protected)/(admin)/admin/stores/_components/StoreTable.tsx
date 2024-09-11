"use client";

import Link from "next/link";
import { getStores } from "@/actions/stores";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { FaEdit, FaInfoCircle, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import EditStore from "./storeAction/editStore/EditStore";
import DeleteStore from "./storeAction/DeleteStore";
import StoreDetailPage from "./StoreDetail";
import CreateStore from "./storeAction/createStore/CreateStore";
import TableActions from "./StoreTableActions";
import { useAtom } from "jotai";
import { sortCriteriaAtom, sortDirectionAtom } from "./state/sortAtoms";

export default function StoreTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const actions = searchParams.get("actions");
  const storeId = Number(searchParams.get("id"));

  const {
    data: stores,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["stores"],
    queryFn: () => getStores(),
  });

  const [sortCriteria] = useAtom(sortCriteriaAtom);
  const [sortDirection] = useAtom(sortDirectionAtom);

  // Sort stores based on selected criteria and direction
  const sortedStores = stores?.data?.slice().sort((a, b) => {
    if (!a || !b || !sortCriteria) {
      return 0; // Return 0 if any of the objects or sortCriteria is undefined
    }

    // Ensure the properties exist on the objects before comparison
    const aValue = a[sortCriteria];
    const bValue = b[sortCriteria];

    // Handle potential undefined values in the comparison fields
    if (aValue === undefined || bValue === undefined) {
      return 0;
    }

    const compareValue = aValue > bValue ? 1 : -1;
    return sortDirection === "asc" ? compareValue : -compareValue;
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

  const storeWithStoreId =
    !isLoading &&
    storeId !== null &&
    stores?.data?.filter((store) => store?.id === storeId);

  if (actions === "edit" && storeId && storeWithStoreId) {
    return (
      <EditStore id={storeId} store={storeWithStoreId && storeWithStoreId[0]} />
    );
  }

  if (actions === "detail" && storeId && storeWithStoreId) {
    return <StoreDetailPage storeId={storeId} />;
  }

  if (actions === "create-store") {
    return (
      <div className="mx-auto max-w-[80%]">
        <CreateStore api_url="halo" />
      </div>
    );
  }

  return (
    <div className="max-h-[100vh] space-y-3 overflow-x-auto overflow-y-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/stores?actions=create-store"
          className="btn btn-primary btn-sm text-white"
        >
          <FaPlus />
          Create Store
        </Link>
        <TableActions />
      </div>
      <table className="table w-full text-base">
        <thead>
          <tr>
            <th className="text-lg font-extrabold">Image</th>
            <th className="text-lg font-extrabold">Name</th>
            <th className="text-lg font-extrabold">Store Type</th>
            <th className="text-lg font-extrabold">City</th>
            <th className="text-lg font-extrabold">Province</th>
            <th className="text-lg font-extrabold">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedStores?.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">
                No Store available
              </td>
            </tr>
          ) : (
            sortedStores?.map((store) => (
              <tr key={store.id}>
                <td>
                  <Image
                    src={store?.image || "/store.webp"}
                    width={50}
                    height={50}
                    alt="store image"
                    priority
                    className="aspect-square h-10 w-10 object-cover"
                  />
                </td>
                <td>{store?.name}</td>
                <td>{store?.store_type}</td>
                <td>{store?.city?.city_name}</td>
                <td>{store?.province?.province}</td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        router.push(
                          `/admin/stores?actions=detail&name=${store?.name}&id=${store?.id}`,
                        )
                      }
                      className="btn btn-info btn-sm tooltip tooltip-primary text-white"
                      data-tip="Detail"
                    >
                      <FaInfoCircle />
                    </button>
                    <button
                      onClick={() =>
                        router.push(
                          `/admin/stores?actions=edit&name=${store?.name}&id=${store?.id}`,
                        )
                      }
                      className="btn btn-accent btn-sm tooltip tooltip-primary"
                      data-tip="Edit"
                    >
                      <FaEdit />
                    </button>
                    <DeleteStore id={store?.id} store_name={store?.name} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
