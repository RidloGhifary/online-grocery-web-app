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
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { useEffect, useState } from "react";
import { searchQueryAtom } from "./state/searchAtoms";
import { StoreProps } from "@/interfaces/store";

export default function StoreTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const actions = searchParams.get("actions");
  const storeId = Number(searchParams.get("id"));

  function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler); // Cleanup the timeout if value changes before the delay ends
      };
    }, [value, delay]);

    return debouncedValue;
  }

  const [pageNumber, setPageNumber] = useState<number>(1);

  const {
    data: stores,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["stores", pageNumber],
    queryFn: () => getStores({ page: pageNumber }),
  });

  const [searchQuery] = useAtom(searchQueryAtom);
  const [sortCriteria] = useAtom(sortCriteriaAtom);
  const [sortDirection] = useAtom(sortDirectionAtom);

  const debouncedSearchQuery = useDebounce(searchQuery, 1500);

  const filterStores = (stores: StoreProps[]) => {
    if (!debouncedSearchQuery) return stores; // If no search query, return all stores

    let key = "name"; // Default key is 'name'
    let value = debouncedSearchQuery;

    // Check if the searchQuery contains a valid key (name:, city:, or province:)
    if (debouncedSearchQuery.includes(":")) {
      const parsedQuery = debouncedSearchQuery.split(":");
      if (parsedQuery.length === 2) {
        key = parsedQuery[0];
        value = parsedQuery[1];
      }
    }

    // Apply the filter based on the key
    return stores.filter((store) => {
      if (key === "name")
        return store.name.toLowerCase().includes(value.toLowerCase());
      if (key === "city")
        return store?.city?.city_name
          .toLowerCase()
          .includes(value.toLowerCase());
      if (key === "province")
        return store?.province?.province
          .toLowerCase()
          .includes(value.toLowerCase());
      return false;
    });
  };

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

  // Sort stores based on selected criteria and direction
  const filterAndSortStores = (stores: StoreProps[]) => {
    // First, filter the stores
    const filteredStores = filterStores(stores || []);

    // Then, sort the filtered stores based on the selected criteria and direction
    return filteredStores?.slice().sort((a, b) => {
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
  };

  const processedStores = filterAndSortStores(stores?.data || []);

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
      <div className="flex items-center justify-between gap-3 overflow-x-auto overflow-y-hidden p-2">
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
          {processedStores?.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">
                No Store available
              </td>
            </tr>
          ) : (
            processedStores?.map((store) => (
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
      {stores?.pagination && (
        <div className="flex items-center justify-items-end gap-1">
          <button
            disabled={!stores?.pagination?.back}
            onClick={() => setPageNumber((prev) => prev - 1)}
            className="btn btn-primary btn-sm text-white disabled:cursor-not-allowed"
          >
            <MdNavigateBefore />
            {stores?.pagination?.back}
          </button>
          <button className="btn btn-primary btn-sm text-white">
            {stores?.pagination?.current_page} -{" "}
            {stores?.pagination?.total_page}
          </button>
          <button
            disabled={!stores?.pagination?.next}
            onClick={() => setPageNumber((prev) => prev + 1)}
            className={`btn btn-primary btn-sm text-white disabled:cursor-not-allowed`}
          >
            <MdNavigateNext />
            {stores?.pagination?.next}
          </button>
        </div>
      )}
    </div>
  );
}
