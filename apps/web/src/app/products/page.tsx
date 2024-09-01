'use client';

import { getProductListWithFilter } from "@/actions/products";
import Drawer from "@/components/features-2/layouts/Drawer";
import SidePanel from "@/components/features-2/layouts/SidePanel";
import ProductFilter from "@/components/features-2/product/filter/ProductFilter";
import PublicProductList from "@/components/features-2/product/PublicProductList";
import { Modal } from "@/components/features-2/ui/Modal";
import SearchBar from "@/components/features-2/ui/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Page() {
  const [modalActive, setModalActive] = useState<boolean>(false);
  const { isLoading, error, data: products } = useQuery({
    queryKey: ['publicProductList'],
    queryFn: async () => {
      const data = await getProductListWithFilter({});
      return data;
    },
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
          <div className="flex max-w-full sm:max-w-xl flex-1 flex-row items-center px-4 py-0 pt-4 md:py-4 sm:px-0 md:pr-2 ">
            <SearchBar />
          </div>
          <div className="px-4 flex lg:hidden w-full md:max-w-24 sm:max-w-xl max-w-full flex-row items-center sm:px-0 py-4 justify-center">
            <button
              onClick={(e) => {
                setModalActive(true);
              }}
              className="btn lg:hidden w-full"
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
        <ProductFilter />
      </Modal>
    </>
  );
}
