"use client";
import AdminCustomerDetailWithImage from "@/components/features-2/admin/AdminCustomerDetailWithImage";
import AdminCustomerTable from "@/components/features-2/admin/AdminCustomerTable";
import { Modal } from "@/components/features-2/ui/Modal";
import PaginationPushRoute from "@/components/features-2/ui/PaginationPushRoute";
import SearchBar from "@/components/features-2/ui/SearchBar";
import { useCustomerWithFilter } from "@/hooks/adminAccountHooks";
import { UserInterface } from "@/interfaces/user";
import { currentCustomerOperation, currentDetailCustomerAtom } from "@/stores/customerStores";
import { useAtom } from "jotai";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEventHandler, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";

export default function Page () {
  const [operation, setOperation] = useState<
    "edit" | "detail" | "delete" | "add" | "filter"
  >();
  const [currentOperation, setCurrentOperation] = useAtom(
    currentCustomerOperation,
  );
  const [, setCurrenctProduct] = useAtom(currentDetailCustomerAtom)
  function handleClose() {
    setOperation(undefined);
    setCurrenctProduct(undefined)
    setCurrentOperation("idle");
  }
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const {
    isLoading,
    error,
    data, // Admin products data
    isError,
  } = useCustomerWithFilter({
    search: queryParams.get("search") || "",
    orderField: queryParams.get("orderField") || "name",
    order: (queryParams.get("order") as "asc" | "desc") || "asc",
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

  // Define products data

  return (
    <>
      <div className="rounded-lg bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
        <div className="flex w-full max-w-full flex-wrap justify-center">
          <div className="flex max-w-full flex-1 flex-row items-center px-4 py-4">
            <SearchBar
              defaultValue={queryParams.get("search") || undefined}
              onChangeSearch={onSearch}
            />
          </div>
          {/* <div className="mx-4 flex w-full max-w-full flex-row pb-4 min-[395px]:mx-0 min-[395px]:w-auto min-[395px]:py-4 min-[395px]:pb-0 min-[395px]:pr-4">
            <button
              onClick={() => setOperation("filter")}
              className="btn block w-full"
            >
              Filter
            </button>
          </div> */}
          
          <div className="mx-4 flex w-full max-w-full flex-row pb-4 min-[395px]:mx-0 min-[395px]:w-auto min-[395px]:py-4 min-[395px]:pb-0 min-[395px]:pr-4">
            <button
              onClick={() => setCurrentOperation("add")}
              className="btn btn-primary flex w-full items-center justify-center"
            >
              <FaPlus size={"1.5rem"} />
            </button>
          </div>
        </div>
        {/* <AdminCategoryTable categories={data?.data.data!} /> */}
        {isLoading || isDebouncing ? (
          <div className="flex w-full justify-center py-5">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : data &&
          data?.data &&
          data.data.data &&
          data.data.data.length > 0 ? (
          <>
            <div className="p-5">
              <AdminCustomerTable customers={data?.data.data! as unknown as UserInterface[]} />
            </div>
            <div className="flex w-full max-w-full justify-center">
              <div className="flex w-full max-w-xl justify-center px-3 py-5">
                <PaginationPushRoute pagination={data?.data.pagination!} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex w-full justify-center py-5">
            <p>No customer found.</p>
          </div>
        )}
      </div>
      <Modal show={operation === "filter" ?? false} onClose={handleClose}>
      </Modal>
      <Modal
        show={currentOperation !== "idle" ?? false}
        onClose={handleClose}
        closeButton={false}
        toasterContainer={
          <ToastContainer
            containerId={10912}
            position="top-center"
            draggable={true}
          />
        }
      >
        {currentOperation==='detail'? <AdminCustomerDetailWithImage />:''}
        
      </Modal>
    </>
  );
}
