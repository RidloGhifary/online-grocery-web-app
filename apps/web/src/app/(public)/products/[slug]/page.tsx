"use client";
import React from "react";
import CarouselWithThumb from "@/components/features-2/ui/CarouselWithThumb";
import { useQuery } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";
import { getSingleProduct } from "@/actions/products";
import { ProductCompleteInterface } from "@/interfaces/ProductInterface";
import PublicProductDetailV2 from "@/components/features-2/product/PublicProductDetailV2";
import { queryKeys } from "@/constants/queryKeys";
import { useAtom } from "jotai";
import { geoAtom, geoPermissionAtom, geoReadyAtom } from "@/stores/geoStores";
import { PulseLoader } from "react-spinners";

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  const [geoLocation] = useAtom(geoAtom);
  const [geoReady] = useAtom(geoReadyAtom)
  // const [geoPermission] = useAtom(geoPermissionAtom)

  const {
    isLoading,
    error,
    data: product,
  } = useQuery({
    queryKey: [
      queryKeys.products,
      slug,
      geoLocation?.coords?.latitude,
      geoLocation?.coords?.longitude,
    ],
    queryFn: async () => {
      const response = await getSingleProduct({
        slug,
        latitude: geoLocation?.coords?.latitude,
        longitude: geoLocation?.coords?.longitude,
      });

      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    retry: 1,
    // enabled: !!slug && !!geoLocation?.coords, // Only run the query if both slug and geoLocation exist
  });

  if (!geoReady ) {
    // If location hasn't been set, show a loading state
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <PulseLoader color="#16a34a" size={30} />
      </div>
    );
  }

  if (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes("404")) {
      return notFound();
    }
    return <div>{errorMessage}</div>;
  }

  return (
    <div className="w-full max-w-full items-center justify-center">
      <div className="flex w-full max-w-full flex-wrap justify-center ">
        <div className="mt-5 w-full max-w-xl lg:my-5">
          {product?.data ? (
            <CarouselWithThumb images={JSON.parse(product?.data.image!)} />
          ) : (
            <div className="flex w-full justify-center py-5">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          )}
        </div>
        <div className="w-full max-w-xl">
          <PublicProductDetailV2
            productDetail={product?.data as ProductCompleteInterface}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
