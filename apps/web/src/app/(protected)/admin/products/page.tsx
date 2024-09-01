"use client";
import AdminProductTable from "@/components/features-2/admin/AdminProductTable";
import ProductFilter from "@/components/features-2/product/filter/ProductFilter";
import { Modal } from "@/components/features-2/ui/Modal";
import SearchBar from "@/components/features-2/ui/SearchBar";
import { products } from "@/mocks/productData";
import { useState } from "react";

export default function () {
  const [modalActive, setModalActive] = useState<boolean>(false);
  return (
    <>
      <div className="bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
        <div className="flex w-full max-w-full flex-wrap justify-center">
          <div className="flex max-w-full flex-1 flex-row items-center px-4 py-4">
            <SearchBar />
          </div>
          <div className="flex max-w-full min-[395px]:w-auto w-full flex-row min-[395px]:py-4 min-[395px]:pb-0 pb-4 min-[395px]:pr-4 min-[395px]:mx-0 mx-4 lg:hidden">
            <button
              onClick={(e) => {
                setModalActive(true);
              }}
              className="btn block  w-full"
            >
              Filter
            </button>
          </div>
        </div>
        <AdminProductTable products={products} />
      </div>
      <Modal
        show={modalActive}
        onClose={(e) => {
          setModalActive(false);
        }}
      >
        <ProductFilter />
      </Modal>
    </>
  );
}
