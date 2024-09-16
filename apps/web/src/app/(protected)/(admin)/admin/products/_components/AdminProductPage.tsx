"use client";
import { getProductListWithFilter } from "@/actions/products";
import AdminFilter from "@/components/features-2/admin/AdminFilter";
import AdminProductForm from "@/components/features-2/admin/AdminProductForm";
import AdminProductTable from "@/components/features-2/admin/AdminProductTable";
import { Modal } from "@/components/features-2/ui/Modal";
import SearchBar from "@/components/features-2/ui/SearchBar";
import PaginationPushRoute from "@/components/features-2/ui/PaginationPushRoute";
import { useProductWithFilter } from "@/hooks/publicProductHooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEventHandler, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDebouncedCallback } from "use-debounce";
import { useAtom } from "jotai";
import {
  currentDetailProductsAtom,
  currentProductOperation,
} from "@/stores/productStores";
import AdminProductUpdateForm from "@/components/features-2/admin/AdminProductUpdateForm";
import AdminProductDelete from "@/components/features-2/admin/AdminProductDelete";
import { ToastContainer } from "react-toastify";
import AdminProductDetailWithImage from "@/components/features-2/admin/AdminProductDetailWithImage";
import { VscSettings } from "react-icons/vsc";

export default function AdminProductPage() {
  const [operation, setOperation] = useState<
    "edit" | "detail" | "delete" | "add" | "filter"
  >();
  const [currentOperation, setCurrentOperation] = useAtom(
    currentProductOperation,
  );
  const [, setCurrenctProduct] = useAtom(currentDetailProductsAtom)
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
  } = useProductWithFilter({
    search: queryParams.get("search") || "",
    orderField: queryParams.get("orderField") || "product_name",
    order: (queryParams.get("order") as "asc" | "desc") || "asc",
    category: queryParams.get("category") || "",
    page: Number(queryParams.get("page")) || 1,
    limit: Number(queryParams.get("limit")) || 20,
  });

  // console.log(data?.data.data);
  

  const debounced = useDebouncedCallback(
    (value) => {
      const params = new URLSearchParams(window.location.search);
      params.set("search", value);
      params.set("page", '1');

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

  return (
    <>
      <div className="rounded-lg bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
        <div className="p-4">
          {/* Search bar and buttons */}
          <div className="flex max-w-full flex-wrap justify-center">
            <div className="flex w-full flex-1">
              <SearchBar
                defaultValue={queryParams.get("search") || undefined}
                onChangeSearch={onSearch}
              />
            </div>
            <div className="flex w-full flex-wrap items-center justify-center gap-3 pt-3 md:max-w-48 md:pt-0">
              <button
                onClick={() => setOperation("filter")}
                className="btn w-full md:w-[40%]"
              >
                <VscSettings size={"1.5rem"} />
              </button>
              <button
                onClick={() => setCurrentOperation("add")}
                className="btn btn-primary flex w-full items-center justify-center md:w-[40%]"
              >
                <FaPlus size={"1.5rem"} />
                {/* <span className="ml-2 w-full">Add</span> */}
              </button>
            </div>
          </div>
        </div>

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
              <AdminProductTable products={data?.data.data!} />
            </div>
            <div className="flex w-full max-w-full justify-center">
              <div className="flex w-full max-w-xl justify-center px-3 py-5">
                <PaginationPushRoute pagination={data?.data.pagination!} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex w-full justify-center py-5">
            <p>No products found.</p>
          </div>
        )}

        {/* Pagination */}
      </div>

      <Modal show={operation === "filter" ?? false} onClose={handleClose}>
        <div className="w-full flex sm:flex-row flex-col justify-center items-center">

        <AdminFilter />
        </div>
      </Modal>

      <Modal
        show={currentOperation !== "idle" ?? false}
        useTCustomContentWidthClass={`${currentOperation === "detail"  ? 'sm:w-full sm:max-w-3xl':''}`}
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
        {currentOperation === "add" ?<AdminProductForm />:''}
        {currentOperation === "edit" ?<AdminProductUpdateForm />:''}
        {currentOperation === "detail" ?<AdminProductDetailWithImage/>:''}
        {currentOperation === "delete" ?<AdminProductDelete />:''}
      </Modal>
    </>
  );
}
