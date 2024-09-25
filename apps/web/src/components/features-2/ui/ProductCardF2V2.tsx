"use client";

import convertRupiah from "@/utils/convertRupiah";
import Image from "next/image";
import Link from "next/link";
import { RiGitBranchFill } from "react-icons/ri";
import { FaStore } from "react-icons/fa6";
import { FaRegSadCry } from "react-icons/fa"; // Fallback icon for unavailable store
import calculatedDiscount from "@/utils/calculateDiscount";
import { ProductCompleteInterface } from "@/interfaces/ProductInterface";

export default function ProductCardF2V2({
  product,
}: {
  product?: ProductCompleteInterface;
}) {
  const images: string[] = JSON.parse(product?.image!);
  let firstImage: string | null = null;
  if (images) {
    firstImage = images[0];
  }

  const hasDiscount =
    product?.product_discounts && product?.product_discounts.length > 0;

  const storeAvailable = product?.StoreHasProduct?.[0]?.store;

  return (
    <Link
      href={`/products/${product?.slug}`}
      className="card h-[350px] w-44 bg-white  md:w-56"
    >
      {/* Adjusted image height to take more space */}
      <figure className="h-[60%]">
        <Image
          width={300}
          height={300}
          src={firstImage || "https://placehold.co/400x400.svg"}
          alt="Placeholder"
          className="aspect-square h-full w-full object-cover"
          loading="lazy"
        />
      </figure>

      <div className="mt-2 h-[40%] space-y-1 px-2 pb-3">
        <p className="line-clamp-2 text-sm font-semibold">{product?.name}</p>
        <div>
          {hasDiscount ? (
            <>
              <p className="truncate font-semibold text-green-600">
                {calculatedDiscount({
                  price: product?.price!,
                  product_discount: product?.product_discounts[0]!,
                })}
              </p>
              <p className="truncate text-xs text-slate-500">
                <s>{convertRupiah(product?.price)}</s>
                <b className="ml-1 text-rose-500">
                  {product?.product_discounts[0]?.discount_type === "percentage"
                    ? product?.product_discounts[0]?.discount + "%"
                    : convertRupiah(product?.product_discounts[0]?.discount)}
                </b>
              </p>
            </>
          ) : (
            <p className="font-semibold">
              {product?.price && convertRupiah(product?.price)}
            </p>
          )}
          <p className="line-clamp-1 text-sm">
            {product?.StoreHasProduct?.[0]?.qty || "0"} stock available
          </p>
        </div>

        <div className="flex items-center gap-1">
          {storeAvailable ? (
            product?.StoreHasProduct?.[0]?.store?.store_type === "central" ? (
              <FaStore size={15} className="text-green-500" />
            ) : (
              <RiGitBranchFill size={15} className="text-blue-500" />
            )
          ) : (
            ""
          )}
          <span className="text-sm text-primary">
            {storeAvailable ? (
              product?.StoreHasProduct?.[0]?.store?.city?.city_name
            ) : (
              <>
                {/* <FaRegSadCry size={15} className="text-gray-500" /> */}
                Not available in your area
              </>
            )}
          </span>
        </div>

        {product?.StoreHasProduct && product?.StoreHasProduct[0] ? (
          <p className="badge-base-100 badge">
            {product?.StoreHasProduct[0]?.store?.name}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
