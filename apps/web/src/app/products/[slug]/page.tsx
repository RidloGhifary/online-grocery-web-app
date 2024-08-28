"use client";
import React from "react";
import PublicProductDetail from "@/components/features-2/product/PublicProductDetail";
import { products } from "@/mocks/productData";
import CarouselWithThumb from "@/components/features-2/ui/CarouselWithThumb";

export default function Page() {
  const images = products
    .map((e) => e.image)
    .filter((image): image is string => image !== null);

  return (
    <>
      <div className="w-full max-w-full items-center justify-center">
        <div className="flex w-full max-w-full flex-wrap justify-center">
          <div className="max-w-xl w-full">
            {/* <Carousel images={images} /> */}
            <CarouselWithThumb/>
          </div>
          <PublicProductDetail />
        </div>
      </div>
    </>
  );
}
