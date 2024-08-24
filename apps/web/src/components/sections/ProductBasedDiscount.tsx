"use client";

import SectionTitle from "../SectionTitle";
import SectionBanner from "./SectionBanner";
import ProductCard from "../ProductCard";

export default function ProductBasedDiscount() {
  return (
    <div className="my-8 w-full">
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
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>
              <ProductCard />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
