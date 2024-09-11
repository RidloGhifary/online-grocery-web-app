"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { IoMdRefresh } from "react-icons/io";
import { sortCriteriaAtom, sortDirectionAtom } from "./state/sortAtoms";

export default function TableActions() {
  const [, setSortCriteria] = useAtom(sortCriteriaAtom);
  const [, setSortDirection] = useAtom(sortDirectionAtom);
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    // Reset the sorting criteria and direction to defaults
    setSortCriteria("name");
    setSortDirection("asc");

    // Invalidate the query to refetch the data
    queryClient.invalidateQueries({ queryKey: ["stores"] });
  };

  return (
    <div className="flex gap-2">
      <select
        onChange={(e) =>
          setSortCriteria(
            e.target.value as "name" | "store_type" | "city" | "province",
          )
        }
        className="select select-bordered select-sm"
      >
        <option value="name">Sort by Name</option>
        <option value="store_type">Sort by Store Type</option>
        <option value="city">Sort by City</option>
        <option value="province">Sort by Province</option>
      </select>

      <select
        onChange={(e) => setSortDirection(e.target.value as "asc" | "desc")}
        className="select select-bordered select-sm"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      <button onClick={handleRefresh} className="btn btn-secondary btn-sm">
        <IoMdRefresh />
        Refresh
      </button>
    </div>
  );
}
