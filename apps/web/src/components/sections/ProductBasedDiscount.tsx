"use client";

import SectionTitle from "../SectionTitle";
import SectionBanner from "./SectionBanner";
import ProductCard from "../ProductCard";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ProductProps } from "@/interfaces/product";
import SectionSkeleton from "@/skeletons/SectionSkeleton";

interface ProductBasedDiscountProps {
  api_url: string;
}

export default function ProductBasedDiscount({
  api_url,
}: ProductBasedDiscountProps) {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["discount-products"],
    queryFn: async () => {
      const { data } = await axios.get(`${api_url}/products/discounts`);
      return data;
    },
  });

  return (
    <div className="my-8 w-full">
      {isError && (
        <div className="w-full rounded-md bg-red-500/20 p-6 text-center text-red-500">
          Ups, something went wrong!
        </div>
      )}
      {isLoading ? (
        <SectionSkeleton />
      ) : (
        <>
          <SectionTitle
            title="Product Based Discount"
            href="/product-based-discount"
          />
          <div className="mt-4 flex items-center">
            <SectionBanner
              title="Shop Now, Save More!"
              href="/product-based-discount"
            />

            <div className="flex w-full items-center gap-2 overflow-x-auto rounded-box md:ml-[-50px]">
              {!isLoading &&
                products?.data?.slice(0, 10)?.map((product: ProductProps) => (
                  <div key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
