'use client';

import { productDefault } from "@/mocks/productData";
import { ProductCompleteInterface } from "@/interfaces/ProductInterface";
import ProductCardF2 from "../ui/ProductCardF2";
import ProductCardF2V2 from "../ui/ProductCardF2V2";

export default function PublicProductList({
  products = productDefault,
  isLoading,
}: {
  products: ProductCompleteInterface[];
  isLoading: boolean;
}) {
  return (
    <div className="mx-[0.6rem] grid grid-cols-2 justify-center sm:mx-5 sm:flex sm:flex-wrap sm:gap-5">
      {isLoading ? (
        // Show a primary color spinner while loading
        <div className="flex w-full justify-center py-5">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        (products as unknown as ProductCompleteInterface[]).map((e, i) => (
          <div className="my-2 flex items-center justify-center" key={i}>
            {/* <ProductCardF2 image={(JSON.parse(e.image!) as unknown as string[])[0]} name={e.name} price={e.price} slug={e.slug!} /> */}
            {products && <ProductCardF2V2 product={e} />}
          </div>
        ))
      )}
    </div>
  );
}
