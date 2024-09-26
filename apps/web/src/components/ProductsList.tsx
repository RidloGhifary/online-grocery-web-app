"use client";

import { useCallback, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import axios from "axios";
import { ProductProps } from "@/interfaces/product";
import CardProductSkeleton from "@/skeletons/CardProductSkeleton";
import { useEffect, useState } from "react";
import ErrorInfo from "./ErrorInfo";
import { toast } from "react-toastify";

interface Props {
  api_url: string;
}

export default function ProductsList({ api_url }: Props) {
  const [locationReady, setLocationReady] = useState(false);
  const [geoLocation, setGeoLocation] = useState<GeolocationPosition | null>(
    null,
  );
  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoLocation(position);
          localStorage.setItem("locationAccess", "granted");
          setLocationReady(true); // Indicate that location is ready
        },
        () => {
          localStorage.setItem("locationAccess", "denied");
          setLocationReady(true); // Even if denied, we proceed without location
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    } else {
      toast.error("Your browser does not support geolocation");
      setLocationReady(true); // Handle browsers without geolocation support
    }
  }, []);

  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["products-locations"],
      queryFn: async ({ pageParam = 1 }) => {
        const query = geoLocation
          ? `?latitude=${geoLocation?.coords.latitude}&longitude=${geoLocation?.coords.longitude}&page=${pageParam}`
          : `?page=${pageParam}`;
        const { data } = await axios.get(
          `${api_url}/products/locations${query}`,
        );
        return data;
      },
      getNextPageParam: (lastPage) => lastPage?.pagination?.next || null,
      initialPageParam: 1,
      enabled: locationReady,
    });

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading],
  );

  const products = useMemo(() => {
    return data?.pages.reduce((acc, page) => {
      return [...acc, ...page.data];
    }, [] as ProductProps[]);
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <CardProductSkeleton key={i} className="mt-4" />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorInfo error="Ups, Something went wrong" className="mt-8" />;
  }

  if (products?.length === 0) {
    return <ErrorInfo error="Ups, no products found" className="mt-8" />;
  }

  return (
    <div className="my-8 space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products?.map((product: ProductProps, index: number) => {
          if (index === products.length - 1) {
            return (
              <div key={product?.id} ref={lastElementRef}>
                <ProductCard product={product} geoLocation={!!geoLocation} />
              </div>
            );
          }
          return (
            <div key={product?.id}>
              <ProductCard product={product} geoLocation={!!geoLocation} />
            </div>
          );
        })}
      </div>
      {isFetching && !hasNextPage && (
        <div className="mt-3 text-center">Wait a second...</div>
      )}
    </div>
  );
}
