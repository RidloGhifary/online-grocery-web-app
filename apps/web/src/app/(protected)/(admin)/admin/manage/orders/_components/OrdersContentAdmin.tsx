"use client";
import React, { useState, useEffect, useCallback } from "react";
import { getOrdersForAdmin } from "@/api/warehouse/route";
import MainButton from "@/components/MainButton";
import debounce from "lodash.debounce";
import AdminOrderItems from "./OrderItemsAdmin";
import { StoreProps } from "@/interfaces/store";
// import { OrderResponse } from "@/api/warehouse/route";
import { UserProps } from "@/interfaces/user";
import { getStores } from "@/actions/stores";

interface Props {
  user: UserProps | null;
}

const OrdersContentAdmin: React.FC<Props> = ({ user }) => {
  const role = user?.role;
  console.log("User role:", role);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [filter, setFilter] = useState<
    | "all"
    | "waiting_payment_confirmation"
    | "processing"
    | "delivered"
    | "completed"
    | "cancelled"
  >("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "name" | undefined>(
    "createdAt",
  );
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orders, setOrders] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [hasMore, setHasMore] = useState(true);
  const [storeId, setStoreId] = useState<number | "all">("all");
  const [stores, setStores] = useState<StoreProps[]>([]);

  useEffect(() => {
    if (role === "super_admin") {
      const fetchStores = async () => {
        const response = await getStores({});
        setStores(response.data || []);
      };
      fetchStores();
    }
  }, [role]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await getOrdersForAdmin(
        filter,
        search,
        sortBy,
        order,
        page,
        limit,
        storeId === "all" ? undefined : storeId,
        startDate,
        endDate,
      );
      if (page === 1) {
        setOrders(response.data.orders);
      } else {
        setOrders((prevOrders) => [...prevOrders, ...response.data.orders]);
      }
      if (response.data.orders.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [filter, search, sortBy, order, page, storeId, limit, startDate, endDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearchChange = debounce((value: string) => {
    setSearch(value);
  }, 1000);

  const toggleSort = (field: "createdAt" | "name") => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  return (
    <div className="p-4">
      <div className="border-silver-400 mb-6 flex flex-wrap justify-around space-x-2 rounded-lg border p-2 shadow-lg lg:justify-center lg:p-4">
        {[
          "all",
          "waiting_payment_confirmation",
          "processing",
          "delivered",
          "completed",
          "cancelled",
        ].map((category) => (
          <MainButton
            className="mb-2 w-[120px]"
            key={category}
            text={category
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}
            onClick={() =>
              setFilter(
                category as
                  | "all"
                  | "waiting_payment_confirmation"
                  | "processing"
                  | "delivered"
                  | "completed"
                  | "cancelled",
              )
            }
            variant={filter === category ? "secondary" : "static"}
          />
        ))}
      </div>
      <div>
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
                  {`${store.name} - ${store.city?.city_name}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search orders"
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full rounded-md border p-2 lg:w-1/3"
        />
      </div>
      <div className="mb-4 flex justify-center">
        <input
          type="date"
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded-md border p-2"
        />
        <input
          type="date"
          onChange={(e) => setEndDate(e.target.value)}
          className="ml-2 rounded-md border p-2"
        />
      </div>
      <div className="mb-4 flex justify-center space-x-4">
        <MainButton
          text="Sort by Date"
          onClick={() => toggleSort("createdAt")}
          variant="static"
        />
        <MainButton
          text="Sort by Name"
          onClick={() => toggleSort("name")}
          variant="static"
        />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <AdminOrderItems key={order.id} order={order} />
        ))}
      </div>
      {hasMore && orders.length >= limit && (
        <MainButton
          text="Load More"
          onClick={() => setPage((prev) => prev + 1)}
          variant="static"
          className="bg-dark-green w-full text-white"
        />
      )}
    </div>
  );
};

export default OrdersContentAdmin;

// useEffect(() => {
//   if (role === "super_admin") {
//     const fetchStores = async () => {
//       const response = await getStores();
//       setStores(response.data);
//     };
//     fetchStores();
//   }
// }, [role]);

// const fetchOrders = useCallback(async () => {
//   try {
//     const response = await getOrdersForAdmin(
//       filter,
//       search,
//       sortBy,
//       order,
//       page,
//       limit,
//       storeId === "all" ? undefined : storeId,
//       startDate,
//       endDate,
//     );
//     if (page === 1) {
//       setOrders(response.data.orders);
//     } else {
//       setOrders((prevOrders) => [...prevOrders, ...response.data.orders]);
//     }
//     if (response.data.orders.length < limit) {
//       setHasMore(false);
//     } else {
//       setHasMore(true);
//     }
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//   }
// }, [filter, search, sortBy, order, page, storeId, limit, startDate, endDate]);

// {stores.map((store) => (
//   <option key={store.id} value={store.id}>
//     {`${store.name} - ${store.city?.city_name}`}
//   </option>
// ))}

{
  /* <div className="grid grid-cols-1 gap-4">
{orders.map((order) => (
  <AdminOrderItems key={order.id} order={order} />
))}
</div> */
}
