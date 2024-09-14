'use client'
import React from "react";
import CarouselWithThumb from "@/components/features-2/ui/CarouselWithThumb";
import AdminProductDetail from "./AdminProductDetail";
import { useAtom } from "jotai";
import { currentDetailProductsAtom } from "@/stores/productStores";

export default function () {
  const [currentProduct] = useAtom(currentDetailProductsAtom);

  if (!currentProduct) {
    return <></>;
  }

  return (
    <div className="w-full max-w-full items-center justify-center">
      <div className="flex w-full max-w-full flex-wrap justify-center">
        <div className="w-full max-w-xl">
          <AdminProductDetail/>
        </div>
        <div className="w-full max-w-xl mt-5 ">
          {<CarouselWithThumb images={JSON.parse(currentProduct?.image!)} />}
        </div>
      </div>
    </div>
  );
}
