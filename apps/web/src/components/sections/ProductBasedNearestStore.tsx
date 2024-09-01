"use client";

import SectionTitle from "../SectionTitle";
import SectionBanner from "./SectionBanner";
import ProductCard from "../ProductCard";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import SectionSkeleton from "@/skeletons/SectionSkeleton";
import { ProductProps } from "@/interfaces/product";
import { useEffect, useState } from "react";

interface ProductBasedDiscountProps {
  api_url: string;
}

export default function ProductBasedNearestStore({
  api_url,
}: ProductBasedDiscountProps) {
  const [geoLocation, setGeoLocation] = useState<GeolocationPosition | null>(
    null,
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLocation(position);
        localStorage.setItem("locationAccess", "granted");
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        localStorage.setItem("locationAccess", "denied");
      },
    );
  }, []);

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["nearest-products"],
    queryFn: async () => {
      if (!geoLocation) return;
      const { data } = await axios.get(
        `${api_url}/products/nearest-distance?latitude=${geoLocation?.coords.latitude}&longitude=${geoLocation?.coords.longitude}`,
      );
      return data;
    },
    enabled: !!geoLocation,
  });

  return (
    <div className="my-8 w-full">
      {!geoLocation ? (
        <div className="w-full rounded-md bg-slate-500/20 p-6 text-center text-slate-500">
          Enable your location to get nearest product
        </div>
      ) : isError ? (
        <div className="w-full rounded-md bg-red-500/20 p-6 text-center text-red-500">
          Ups, something went wrong!
        </div>
      ) : isLoading ? (
        <SectionSkeleton />
      ) : (
        <>
          <SectionTitle
            title="Product On Your Nearest Location"
            href="/product-based-nearest-store"
          />
          <div className="mt-4 flex items-center">
            <SectionBanner
              title="Get Your Product Here!"
              href="/product-based-nearest-store"
              color="#cfabfe"
            />

            <div className="flex w-full items-center gap-2 overflow-x-auto rounded-box md:ml-[-50px]">
              {!isLoading &&
                !isError &&
                products?.data?.map((product: ProductProps) => (
                  <div key={product?.id}>
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
