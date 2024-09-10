import { PaginationInterface } from "@/interfaces/PaginateInterface";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Pagination({ pagination }: { pagination?: PaginationInterface }) {
  const current_page = pagination?.current_page ?? 1;
  const next = pagination?.next ?? null;
  const back = pagination?.back ?? null;
  const total_page = pagination?.total_page ?? 1;
  // const queryParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  // const [selectedPage, setSelectedPage] = useState(queryParams.get("page") || "1");

  // useEffect(() => {
  //   setSelectedPage(queryParams.get("page") || "1");
  // }, [queryParams]);


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
    // Always include the first page if there are more than one page
    if (current_page > 1) {
      pages.push(1); // First page
    }

    // Add ellipses and previous pages
    if (current_page > 3) {
      pages.push("..."); // Ellipsis for skipped pages
    }
    if (current_page > 2) {
      pages.push(current_page - 1); // Previous page
    }

    // Add the current page
    pages.push(current_page);

    // Add next pages and ellipses
    if (current_page < total_page - 1) {
      pages.push(current_page + 1); // Next page
    }
    if (current_page < total_page - 2) {
      pages.push("..."); // Ellipsis for skipped pages
      if (total_page > 1) {
        pages.push(total_page); // Last page
      }
    } else if (total_page > 1 && !pages.includes(total_page)) {
      pages.push(total_page); // Last page
    }
  }

  if (!pagination || total_page === 1) {
    return null; // Don't render pagination if there's only one page or no data
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
            defaultChecked={current_page === page}
            onClick={() => onPageChange(page)}
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
