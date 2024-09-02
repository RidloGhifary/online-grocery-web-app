"use client";

import { getProductListWithFilter } from "@/actions/products";
import Drawer from "@/components/features-2/layouts/Drawer";
import SidePanel from "@/components/features-2/layouts/SidePanel";
import ProductFilter from "@/components/features-2/product/filter/ProductFilter";
import PublicProductList from "@/components/features-2/product/PublicProductList";
import { Modal } from "@/components/features-2/ui/Modal";
import SearchBar from "@/components/features-2/ui/SearchBar";
import { useProductWithFilter } from "@/hooks/publicProductHooks";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [modalActive, setModalActive] = useState<boolean>(false);
  const queryParams = useSearchParams();
  const {
    isLoading,
    error,
    data: products,
  } = useProductWithFilter({
    search: queryParams.get("search") || undefined,
    orderField: queryParams.get("orderField") || "product_name",
    order: queryParams.get("order") as 'asc'|'desc' || "asc",
    category: queryParams.get("category") || undefined,
  });

  return (
    <>
      <Drawer
        sidePanel={
          <SidePanel>
            <ProductFilter />
          </SidePanel>
        }
      >
        <div className="flex w-full max-w-full flex-wrap justify-center">
          <div className="flex max-w-full flex-1 flex-row items-center px-4 py-0 pt-4 sm:max-w-xl sm:px-0 md:py-4 md:pr-2">
            <SearchBar />
          </div>
          <div className="flex w-full max-w-full flex-row items-center justify-center px-4 py-4 sm:max-w-xl sm:px-0 md:max-w-24 lg:hidden">
            <button
              onClick={(e) => {
                setModalActive(true);
              }}
              className="btn w-full lg:hidden"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Render PublicProductList with loading state */}
        <PublicProductList products={products?.data!} isLoading={isLoading} />
      </Drawer>

      <Modal
        show={modalActive}
        onClose={(e) => {
          setModalActive(false);
        }}
      >
        {modalActive && <ProductFilter />}
        
      </Modal>
    </>
  );
}
