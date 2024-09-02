"use client";

interface Props {
  api_url: string;
}

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import { ProductProps } from "@/interfaces/product";
import SectionSkeleton from "@/skeletons/SectionSkeleton";
import { useEffect, useState } from "react";
import ErrorInfo from "@/components/ErrorInfo";
import { useRouter } from "next/navigation";
import { BsArrowLeft } from "react-icons/bs";

export default function PageContent({ api_url }: Props) {
  const [slice, setSlice] = useState<number>(20);
  const [geoLocation, setGeoLocation] = useState<GeolocationPosition | null>(
    null,
  );

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoLocation(position);
          localStorage.setItem("locationAccess", "granted");
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          localStorage.setItem("locationAccess", "denied");
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    }
  }, []);

  const {
    data: products,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["nearest-products", slice],
    queryFn: async () => {
      if (!geoLocation) return;
      const { data } = await axios.get(
        `${api_url}/products/nearest-distance?latitude=${geoLocation?.coords.latitude}&longitude=${geoLocation?.coords.longitude}`,
      );
      return data;
    },
    enabled: !!geoLocation,
  });

  const handleLoadMore = async () => {
    if (!isFetching) {
      setSlice((prevSlice) => prevSlice + 10);
    }
  };

  const isAllLoaded = slice >= (products?.data?.length || 0);

  return (
    <div className="space-y-6">
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => router.back()}
      >
        <BsArrowLeft />
        Back
      </button>
      {!geoLocation && (
        <ErrorInfo error="Location access denied, please allow location access" />
      )}
      {isError && <ErrorInfo />}
      {isLoading ? (
        <SectionSkeleton />
      ) : (
        <div className="mt-4 flex items-center">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {!isLoading &&
              !isError &&
              products?.data
                ?.slice(0, slice)
                ?.map((product: ProductProps) => (
                  <ProductCard key={product?.id} product={product} />
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
          onClick={handleLoadMore}
          disabled={isAllLoaded || isFetching}
        >
          {isAllLoaded
            ? "All products loaded"
            : isFetching
              ? "Loading..."
              : "Load more"}
        </button>
      </div>
    </div>
  );
}
