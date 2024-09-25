'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEventHandler, useEffect, useState } from "react";

export default function SortingFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const queryParams = useSearchParams();

  // Extract values from query parameters
  const [selectedFilter, setSelectedFilter] = useState(queryParams.get("orderField") || "product_name");
  const [selectedOrder, setSelectedOrder] = useState(queryParams.get("order") || "asc");

  useEffect(() => {
    setSelectedFilter(queryParams.get("orderField") || "product_name");
    setSelectedOrder(queryParams.get("order") || "asc");
  }, [queryParams]);

  const handleFilterChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const params = new URLSearchParams(queryParams.toString());
    params.set("orderField", e.currentTarget.value);
    params.set("page", '1');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleOrderChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const params = new URLSearchParams(queryParams.toString());
    params.set("order", e.currentTarget.value);
    params.set("page", '1');
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <select
        name="filter"
        className="select select-bordered w-full max-w-xs my-3"
        value={selectedFilter}
        onChange={handleFilterChange}
      >
        <option value="product_name">By Product Name</option>
        <option value="category">By Category</option>
      </select>

      <select
        name="order"
        className="select select-bordered w-full max-w-xs"
        value={selectedOrder}
        onChange={handleOrderChange}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </>
  );
}
