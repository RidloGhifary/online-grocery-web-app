"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  getPendingStockMutations,
  confirmStockMutation,
} from "@/api/mutation/route";
import MainButton from "@/components/MainButton";
import MainLink from "@/components/MainLink";
import debounce from "lodash.debounce";
import { UserProps } from "@/interfaces/user";
import { getStores } from "@/actions/stores";
import {
  StockMutation,
  GetMutationsResponse,
  StoreDetails,
} from "@/api/mutation/route";
import { FaArrowLeft } from "react-icons/fa";

interface Props {
  user: UserProps | null;
}

const MutationsContentAdmin: React.FC<Props> = ({ user }) => {
  const role = user?.role;
  const [mutations, setMutations] = useState<StockMutation[]>([]);
  const [storeId, setStoreId] = useState<number | "all">("all");
  const [stores, setStores] = useState<StoreDetails[]>([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);

  useEffect(() => {
    if (role === "super_admin") {
      const fetchStores = async () => {
        const response = await getStores();
        console.log(response);
        setStores(response.data);
      };
      fetchStores();
    }
  }, [role]);

  const fetchMutations = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const response = await getPendingStockMutations({
          search,
          sortOrder,
          storeId: storeId === "all" ? undefined : storeId,
          page, // Pass the page number to the API
        });
        const newMutations = response.data.stockMutations || [];
        setMutations((prevMutations) => [...prevMutations, ...newMutations]);
        setHasMorePages(newMutations.length > 0);
      } catch (error) {
        console.error("Error fetching mutations:", error);
        setMutations([]);
      } finally {
        setLoading(false);
      }
    },
    [search, sortOrder, storeId],
  );

  useEffect(() => {
    setPage(1);
    setMutations([]);
    fetchMutations(1);
  }, [fetchMutations]);

  const handleSearchChange = debounce((value: string) => {
    setSearch(value);
  }, 1000);

  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleConfirmMutation = async (mutationId: number) => {
    try {
      await confirmStockMutation({ pendingMutationId: mutationId });

      setMutations([]);
      fetchMutations(1);
    } catch (error) {
      console.error("Error confirming mutation:", error);
    }
  };

  const loadMoreMutations = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMutations(nextPage);
  };

  return (
    <div className="p-4">
      <MainLink
        href="/manage/orders/"
        text="Back to Orders"
        Icon={FaArrowLeft}
      />

      {role === "super_admin" && (
        <div className="mb-4 flex justify-center">
          <select
            value={storeId}
            onChange={(e) =>
              setStoreId(
                e.target.value === "all" ? "all" : Number(e.target.value),
              )
            }
            className="rounded-md border p-2"
          >
            <option value="all">All Stores</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {`${store.id} - ${store.name}, ${store.city_name}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4 flex flex-wrap justify-center">
        <input
          type="text"
          placeholder="Search mutations"
          onChange={(e) => handleSearchChange(e.target.value)}
          className="mb-2 rounded-md border p-2 lg:w-1/3"
        />
        <MainButton text="Sort by Date" onClick={toggleSort} variant="static" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading && mutations.length === 0 ? (
          <p>Loading...</p>
        ) : mutations.length === 0 ? (
          <p className="mx-auto text-xl font-semibold text-red-700">
            No mutations found
          </p>
        ) : (
          mutations.map((mutation) => (
            <div
              key={mutation.id}
              className="flex flex-wrap items-center justify-between rounded-lg border p-4 shadow-lg"
            >
              <div>
                <p>
                  {mutation.detail} x {Math.abs(mutation.qty_change)}
                </p>
                <p>From Store: {mutation.from_store_id || "N/A"}</p>
                <p>To Store: {mutation.destinied_store_id || "N/A"}</p>
                <p>
                  Date:{" "}
                  {new Date(mutation.createdAt).toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                  })}
                </p>
              </div>
              <div className="text-center">
                <p>Do you want to confirm this mutation arrival?</p>
                <MainButton
                  text="Confirm Mutation"
                  onClick={() =>
                    mutation.id
                      ? handleConfirmMutation(mutation.id)
                      : console.error("Mutation ID missing")
                  }
                  variant="primary"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && hasMorePages && (
        <div className="mt-4 flex justify-center">
          <MainButton
            text="Load More"
            onClick={loadMoreMutations}
            variant="static"
            fullWidth={true}
          />
        </div>
      )}
    </div>
  );
};

export default MutationsContentAdmin;
