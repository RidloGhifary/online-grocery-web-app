"use client";
import React, { useState, useEffect, useCallback } from "react";
import { getOrdersByUser } from "@/api/order/route";
import MainButton from "@/components/MainButton";
import debounce from "lodash.debounce";
import OrderItems from "./OrderItems";
import { OrderResponse } from "@/api/order/route";

const OrdersContent = () => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "ongoing" | "completed" | "cancelled"
  >("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("invoice");
  const [order, setOrder] = useState("desc");
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await getOrdersByUser(
        filter,
        search,
        sortBy,
        order,
        page,
        limit,
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
  }, [filter, search, sortBy, order, page, limit, startDate, endDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearchChange = debounce((value: string) => {
    setSearch(value);
  }, 1000);

  const toggleSort = (field: "invoice" | "createdAt") => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  return (
    <div className="p-4">
      <div className="border-silver-400 mb-6 flex flex-wrap justify-around space-x-2 rounded-lg border p-2 shadow-lg lg:justify-start lg:p-4">
        {["all", "ongoing", "completed", "cancelled"].map((category) => (
          <MainButton
            className="w-[85px] first:w-[55px]"
            key={category}
            text={category.charAt(0).toUpperCase() + category.slice(1)}
            onClick={() =>
              setFilter(
                category as "all" | "ongoing" | "completed" | "cancelled",
              )
            }
            variant={filter === category ? "secondary" : "static"}
          />
        ))}
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
        {/* <MainButton
          text={FaCalendarCheck}
          onClick={() => fetchOrders()}
          variant="primary"
        /> */}
      </div>
      <div className="mb-4 flex justify-center space-x-4">
        <MainButton
          text="Sort by Date"
          onClick={() => toggleSort("createdAt")}
          variant="static"
        />
        <MainButton
          text={"Sort by Name"}
          onClick={() => toggleSort("invoice")}
          variant="static"
        />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <OrderItems key={order.id} order={order} />
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

export default OrdersContent;

//Test
