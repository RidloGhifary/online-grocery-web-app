"use client";
import { getProductListWithFilter } from "@/actions/products";
import AdminFilter from "@/components/features-2/admin/AdminFilter";
import AdminProductTable from "@/components/features-2/admin/AdminProductTable";
import { Modal } from "@/components/features-2/ui/Modal";
import SearchBar from "@/components/features-2/ui/SearchBar";
import { adminQueryKey } from "@/constants/adminQueryKeys";
import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { ProductCompleteInterface } from "@/interfaces/ProductInterface";
import { productDefault } from "@/mocks/productData";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function AdminPage() {
  const [modalActive, setModalActive] = useState<boolean>(false);

  // Use query hook without `queryFn` if data is pre-fetched
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [adminQueryKey.adminProducts],
    // No queryFn needed if data is pre-fetched
    queryFn: async () => await getProductListWithFilter({}),
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center">
        <p>Loading...</p>
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
  const products =
    (data as CommonResultInterface<ProductCompleteInterface[]>).data ||
    productDefault;

  return (
    <>
      <div className="bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
        <div className="flex w-full max-w-full flex-wrap justify-center">
          <div className="flex max-w-full flex-1 flex-row items-center px-4 py-4">
            <SearchBar />
          </div>
          <div className="mx-4 flex w-full max-w-full flex-row pb-4 min-[395px]:mx-0 min-[395px]:w-auto min-[395px]:py-4 min-[395px]:pb-0 min-[395px]:pr-4">
            <button
              onClick={() => setModalActive(true)}
              className="btn block w-full"
            >
              Filter
            </button>
          </div>
          <div className="mx-4 flex w-full max-w-full flex-row pb-4 min-[395px]:mx-0 min-[395px]:w-auto min-[395px]:py-4 min-[395px]:pb-0 min-[395px]:pr-4">
            <button
              onClick={() => setModalActive(true)}
              className="btn btn-primary flex w-full items-center justify-center"
            >
              <FaPlus size={"1.5rem"} />
            </button>
          </div>
        </div>
        <AdminProductTable products={products} />
      </div>
      <Modal show={modalActive} onClose={() => setModalActive(false)}>
        {/* <ProductFilter /> */}
        <AdminFilter />
      </Modal>
    </>
  );
}
