'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEventHandler } from "react";

export default function SortingFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const queryParams = useSearchParams();

  // Extract values from query parameters
  const selectedFilter = queryParams.get("filter") || "product_name";
  const selectedOrder = queryParams.get("order") || "asc";

  const handleFilterChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const params = new URLSearchParams(window.location.search);
    params.set("orderField", e.currentTarget.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleOrderChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const params = new URLSearchParams(window.location.search);
    params.set("order", e.currentTarget.value);
    router.push(`${pathname}?${params.toString()}`);
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
