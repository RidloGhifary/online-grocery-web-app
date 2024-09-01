"use client";

interface Props {
  api_url: string;
}

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import { ProductProps } from "@/interfaces/product";
import SectionSkeleton from "@/skeletons/SectionSkeleton";
import { useState } from "react";
import ErrorInfo from "@/components/ErrorInfo";

export default function PageContent({ api_url }: Props) {
  const [slice, setSlice] = useState<number>(10);

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["discount-products", slice],
    queryFn: async () => {
      const res = await axios.get(`${api_url}/products/discounts`);
      return res.data;
    },
  });

  const isAllLoaded = slice >= (products?.data?.length || 0);

  return (
    <div>
      {isError && <ErrorInfo />}
      {isLoading ? (
        <SectionSkeleton />
      ) : (
        <div className="mt-4 flex items-center">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {!isLoading &&
              !isError &&
              products?.data?.slice(0, slice)?.map((product: ProductProps) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
          </div>
          {products?.data?.length === 0 && (
            <div className="w-full text-center">No products found</div>
          )}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center">
        <button
          className="btn btn-primary btn-sm text-white md:btn-md"
          onClick={() => setSlice(slice + 20)}
          disabled={isAllLoaded}
        >
          {isAllLoaded ? "All products loaded" : "Load more"}
        </button>
      </div>
    </div>
  );
}
