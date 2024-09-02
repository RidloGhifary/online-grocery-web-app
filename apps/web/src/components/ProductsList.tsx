"use client";

import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import axios from "axios";
import { ProductProps } from "@/interfaces/product";
import CardProductSkeleton from "@/skeletons/CardProductSkeleton";
import { useState } from "react";
import Pagination from "./Pagination";

interface Props {
  api_url: string;
}

export default function ProductsList({ api_url }: Props) {
  const [page, setPage] = useState<number>(1);

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", page],
    queryFn: async () => {
      const { data } = await axios.get(`${api_url}/products?page=${page}`);
      return data;
    },
  });

  return (
    <div className="my-8 space-y-6">
      {isError && (
        <div className="w-full rounded-md bg-red-500/20 p-6 text-center text-red-500">
          Ups, something went wrong!
        </div>
      )}
      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <CardProductSkeleton key={i} className="mt-4" />
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {!isLoading &&
          products?.data?.products?.map((product: ProductProps) => (
            <div key={product?.id}>
              <ProductCard product={product} />
            </div>
          ))}
      </div>
      <Pagination pagination={products?.data?.pagination} setPage={setPage} />
    </div>
  );
}
