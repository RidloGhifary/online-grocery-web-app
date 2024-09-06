"use client";

import Drawer from "@/components/features-2/layouts/Drawer";
import SidePanel from "@/components/features-2/layouts/SidePanel";
import ProductFilter from "@/components/features-2/product/filter/ProductFilter";
import PublicProductList from "@/components/features-2/product/PublicProductList";
import { Modal } from "@/components/features-2/ui/Modal";
import PaginationPushRoute from "@/components/features-2/ui/PaginationPushRoute";
import SearchBar from "@/components/features-2/ui/SearchBar";
import { useProductWithFilter } from "@/hooks/publicProductHooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEventHandler, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function () {
  const [modalActive, setModalActive] = useState<boolean>(false);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);

  const queryParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const {
    isLoading,
    error,
    data: products,
  } = useProductWithFilter({
    search: queryParams.get("search") || undefined,
    orderField: queryParams.get("orderField") || "product_name",
    order: (queryParams.get("order") as "asc" | "desc") || "asc",
    category: queryParams.get("category") || undefined,
    page: Number(queryParams.get("page")) || undefined,
    limit: Number(queryParams.get("limit")) || undefined,
  });

  const debounced = useDebouncedCallback(
    (value) => {
      const params = new URLSearchParams(window.location.search);
      params.set("search", value);

      if (value === "" || !value) {
        params.delete("search");
      }

      router.replace(`${pathname}?${params.toString()}`);
      setIsDebouncing(false); // Set to false after debounce completes
    },
    1000,
    {
      leading: true, // Run the function at the start of the delay
    },
  );

  const onSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsDebouncing(true); // Set to true when a new search input occurs
    debounced(e.currentTarget.value);
  };
  console.log(products);
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
            <SearchBar
              defaultValue={queryParams.get("search") || undefined}
              onChangeSearch={onSearch}
            />
          </div>
          <div className="flex w-full max-w-full flex-row items-center justify-center px-4 py-4 sm:max-w-xl sm:px-0 md:max-w-24 lg:hidden">
            <button
              onClick={() => setModalActive(true)}
              className="btn w-full lg:hidden"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Show the loading spinner when either loading from fetch or debounce */}
        {isLoading || isDebouncing ? (
          <div className="flex w-full justify-center py-5">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : products &&
          products?.data &&
          products.data.data &&
          products.data.data.length > 0 ? (
          <>
            <PublicProductList
              products={products.data.data}
              isLoading={isLoading}
            />
            <div className="flex w-full max-w-full justify-center">
              <div className="flex w-full max-w-xl justify-center px-3 py-5">
                <PaginationPushRoute pagination={products.data.pagination!} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex w-full justify-center py-5">
            <p>No products found.</p>
          </div>
        )}
      </Drawer>

      <Modal show={modalActive} onClose={() => setModalActive(false)}>
        {modalActive && <ProductFilter />}
      </Modal>
    </>
  );
}
