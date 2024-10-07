import { PaginationInterface } from "@/interfaces/PaginateInterface";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
export default function Pagination({ pagination }: { pagination?: PaginationInterface }) {
  const current_page = pagination?.current_page ?? 1;
  const next = pagination?.next ?? null;
  const back = pagination?.back ?? null;
  const total_page = pagination?.total_page ?? 1;
  const pathname = usePathname();
  const router = useRouter();

  const onPageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(page));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const goToFirst = () => onPageChange(1);
  const goToLast = () => onPageChange(total_page);
  const goToNext = () => next && onPageChange(next);
  const goToPrevious = () => back && onPageChange(back);

  const pages = [];
  
  if (total_page > 1) {
    // Always include the first page
    pages.push(1);

    // If there are 4 or fewer pages, show all page numbers
    if (total_page <= 4) {
      for (let i = 2; i <= total_page; i++) {
        pages.push(i);
      }
    } else {
      // Handle ellipses and pages based on the current page
      if (current_page > 2) {
        pages.push("...");
      }

      if (current_page > 1 && current_page < total_page) {
        pages.push(current_page); // Current page
      }

      if (current_page < total_page - 1) {
        pages.push("...");
      }

      // Always include the last page if there are more than 4 pages
      pages.push(total_page);
    }
  }

  if (!pagination || total_page === 1) {
    return null;
  }

  return (
    <div className="join">
      <button
        className="join-item btn btn-sm"
        onClick={goToPrevious}
        disabled={!back}
      >
        {"<"}
      </button>
      <button
        className="join-item btn btn-sm"
        onClick={goToFirst}
        disabled={current_page === 1}
      >
        {"<<"}
      </button>
      {pages.map((page, index) =>
        typeof page === "number" ? (
          <input
            key={index}
            className="btn btn-square join-item btn-sm"
            type="radio"
            name="options"
            aria-label={`${page}`}
            // defaultChecked={current_page === page}
            // onClick={() => onPageChange(page)}
            checked={current_page === page}
            onChange={() => onPageChange(page)}
          />
        ) : (
          <button key={index} className="join-item btn btn-disabled btn-sm">
            {page}
          </button>
        )
      )}
      <button
        className="join-item btn btn-sm"
        onClick={goToLast}
        disabled={current_page === total_page}
      >
        {">>"}
      </button>
      <button
        className="join-item btn btn-sm"
        onClick={goToNext}
        disabled={!next}
      >
        {">"}
      </button>
    </div>
  );
}
