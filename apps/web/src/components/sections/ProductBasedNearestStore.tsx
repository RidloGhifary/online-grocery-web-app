"use client";

import SectionTitle from "../SectionTitle";
import SectionBanner from "./SectionBanner";
import ProductCard from "../ProductCard";

export default function ProductBasedNearestStore() {
  return (
    <div className="my-8 w-full">
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
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i}>
              <ProductCard />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
