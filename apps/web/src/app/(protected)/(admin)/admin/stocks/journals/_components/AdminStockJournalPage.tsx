"use client";
import AdminJournalsTable from "@/components/features-2/admin/AdminJournalsTable";
import { Modal } from "@/components/features-2/ui/Modal";
import PaginationPushRoute from "@/components/features-2/ui/PaginationPushRoute";
import SearchBar from "@/components/features-2/ui/SearchBar";
import { useJournalsWithFilter } from "@/hooks/stockHooks";
import { useAtom } from "jotai";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEventHandler, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";
import Select from "react-select"; // Ensure you have react-select installed
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { getStoreForStock } from "@/actions/stock";
import { currentAdminAtom } from "@/stores/adminAccountStores";
import { currentStoreInStockAtom } from "@/stores/stockStores";
import { Store } from "@/interfaces/StockInterface";

export default function StockJournalsPage() {
  const [operation, setOperation] = useState<
    "edit" | "detail" | "delete" | "add" | "filter"
  >();
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const[, setSelectedStoreStock] = useAtom(currentStoreInStockAtom)
  const {
    isLoading: isLoadingStores,
    error: storeError,
    data: storeData,
    isError: isStoreError,
  } = useQuery({
    queryKey: [queryKeys.stockJournals],
    queryFn: () => getStoreForStock(),
  }); // Fetch the store list here

  const [currentAdmin] = useAtom(currentAdminAtom);
  let filteredStoreData = storeData?.data?.map((store) => ({
    value: store.id,
    label: store.name,
  }));
  let filteredStoreDataFull : Store|null=null
  
  if (
    currentAdmin?.role &&
    !currentAdmin?.role.find(role=>role.role?.name.includes('super'))
  ) {
    filteredStoreData = storeData?.data
      ?.map((store) => ({ value: store.id, label: store.name }))
      .filter((e) =>
        currentAdmin.store_admins?.find(
          (adminHasStore) => e.value === adminHasStore.store_id,
        ),
      );
      filteredStoreDataFull = storeData?.data
      ?.find((e) =>
        currentAdmin.store_admins?.find(
          (adminHasStore) => e.id === adminHasStore.store_id,
        ))!;
  }
  useEffect(() => {
    if (filteredStoreDataFull) {
      setSelectedStoreStock(filteredStoreDataFull);
    } else if (filteredStoreData && filteredStoreData.length > 0) {
      const defaultStore = storeData?.data?.find(
        (e) => e.id === filteredStoreData[0].value,
      );
      setSelectedStoreStock(defaultStore! || null); // Fallback to first store if no admin-specific store is found
    }
  }, [filteredStoreDataFull, filteredStoreData, setSelectedStoreStock]);
  const {
    isLoading: isLoadingJournals,
    error,
    data, // Stock adjustment data
    isError,
  } = useJournalsWithFilter({
    store_id: filteredStoreData&&filteredStoreData[0].value, // Use a dynamic store ID if needed
    page: Number(queryParams.get("page")) || 1,
    limit: Number(queryParams.get("limit")) || 20,
  });

  

  const debounced = useDebouncedCallback(
    (value) => {
      const params = new URLSearchParams(window.location.search);
      params.set("search", value);
      params.set("page", "1");

      if (value === "" || !value) {
        params.delete("search");
      }

      router.replace(`${pathname}?${params.toString()}`);
      setIsDebouncing(false);
    },
    1000,
    { leading: true },
  );

  const onSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsDebouncing(true);
    debounced(e.currentTarget.value);
  };

  // Handle error states
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

  if (isStoreError) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center">
        <p>
          Store Error:{" "}
          {storeError instanceof Error
            ? storeError.message
            : "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
        <div className="flex w-full max-w-full flex-wrap justify-center">
          {/* Store Select */}
          <div className="flex max-w-full flex-1 flex-row items-center px-4 py-4">
            {isLoadingStores ? (
              <span className="loading loading-spinner loading-lg text-primary"></span>
            ) : (
              <Select
                options={filteredStoreData}
                isLoading={isLoadingStores}
                placeholder="Select a store..."
                onChange={(selectedOption) => {
                  // Handle store selection
                  // console.log(selectedOption);
                  setSelectedStoreStock(filteredStoreDataFull!)

                }}
                defaultValue={filteredStoreData&&filteredStoreData[0]}
              />
            )}
          </div>
          {/* Other components like SearchBar and Filter buttons */}
          {/* <SearchBar defaultValue={queryParams.get("search") || undefined} onChangeSearch={onSearch} /> */}
          {/* <button onClick={() => setOperation("filter")} className="btn block w-full">Filter</button> */}
          {/* <button onClick={() => setOperation("add")} className="btn btn-primary flex w-full items-center justify-center"> <FaPlus size={"1.5rem"} /> </button> */}
        </div>

        {isLoadingJournals || isDebouncing ? (
          <div className="flex w-full justify-center py-5">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : data &&
          data?.data &&
          data.data.data &&
          data.data.data.length > 0 ? (
          <>
            <div className="p-5">
              <AdminJournalsTable stockAdjustments={data?.data.data} />
            </div>
            <div className="flex w-full max-w-full justify-center">
              <div className="flex w-full max-w-xl justify-center px-3 py-5">
                <PaginationPushRoute pagination={data?.data.pagination!} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex w-full justify-center py-5">
            <p>No stock adjustments found.</p>
          </div>
        )}
      </div>

      <Modal
        show={operation === "filter"}
        onClose={() => setOperation(undefined)}
      >
        {/* Filter modal content */}
        Filter Options
      </Modal>

      <Modal
        show={operation === "add"}
        onClose={() => setOperation(undefined)}
        closeButton={false}
        toasterContainer={
          <ToastContainer
            containerId={10912}
            position="top-center"
            draggable={true}
          />
        }
      >
        {/* Stock Adjustment Form */}
        Add Stock Adjustment Form
      </Modal>
    </>
  );
}
