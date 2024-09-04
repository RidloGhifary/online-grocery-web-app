"use client";
import { getProductCategoryList } from "@/actions/categories";
import AdminCategoryTable from "@/components/features-2/admin/AdminCategoryTable";
import AdminFilter from "@/components/features-2/admin/AdminFilter";
import AdminProductForm from "@/components/features-2/admin/AdminProductForm";
import { Modal } from "@/components/features-2/ui/Modal";
import SearchBar from "@/components/features-2/ui/SearchBar";
import { queryKeys } from "@/constants/queryKeys";
import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { ProductCategoryInterface } from "@/interfaces/ProductInterface";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function () {
  const [operation, setOperation] = useState<
    "edit" | "detail" | "delete" | "add" | "filter"
  >();
  function handleClose() {
    setOperation(undefined);
  }

  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryKeys.productCategories],
    queryFn: async () => await getProductCategoryList(),
  })

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

  // Define products data
  const categories =
    (data as CommonResultInterface<ProductCategoryInterface[]>).data;

  return (
    <>
      <div className="bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
        <div className="flex w-full max-w-full flex-wrap justify-center">
          <div className="flex max-w-full flex-1 flex-row items-center px-4 py-4">
            <SearchBar />
          </div>
          <div className="mx-4 flex w-full max-w-full flex-row pb-4 min-[395px]:mx-0 min-[395px]:w-auto min-[395px]:py-4 min-[395px]:pb-0 min-[395px]:pr-4">
            <button
              onClick={() => setOperation("filter")}
              className="btn block w-full"
            >
              Filter
            </button>
          </div>
          <div className="mx-4 flex w-full max-w-full flex-row pb-4 min-[395px]:mx-0 min-[395px]:w-auto min-[395px]:py-4 min-[395px]:pb-0 min-[395px]:pr-4">
            <button
              onClick={() => setOperation("add")}
              className="btn btn-primary flex w-full items-center justify-center"
            >
              <FaPlus size={"1.5rem"} />
            </button>
          </div>
        </div>
        <AdminCategoryTable categories={categories} />
      </div>
      <Modal show={operation === "filter" ?? false} onClose={handleClose}>
        {/* <AdminFilter /> */}
        'Filter'
      </Modal>
      <Modal show={operation === "add" ?? false} onClose={handleClose} closeButton={false}>
        <AdminProductForm />
      </Modal>
    </>
  );
}
