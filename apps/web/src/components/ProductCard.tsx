"use client";

import { ProductProps } from "@/interfaces/product";
import convertRupiah from "@/utils/convertRupiah";
import Image from "next/image";
import Link from "next/link";
import { RiGitBranchFill } from "react-icons/ri";
import { FaStore } from "react-icons/fa6";
import calculatedDiscount from "@/utils/calculateDiscount";

interface ProductCardProps {
  product: ProductProps;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product?.id}?name=${product?.name}`}
      className="card h-[300px] w-44 bg-white shadow md:h-[340px] md:w-56"
    >
      <figure>
        <Image
          width={300}
          height={300}
          src={product?.image || "/default-image.jpeg"}
          alt="Placeholder"
          className="aspect-square max-h-[140px] w-full object-cover md:max-h-[180px]"
          loading="lazy"
        />
      </figure>
      <div className="mt-2 space-y-1 p-1 pb-3">
        <p className="line-clamp-2 text-sm">{product?.name}</p>
        <div>
          <p className="truncate font-semibold">
            {calculatedDiscount({
              price: product?.price,
              product_discount: product?.product_discounts[0],
            })}
          </p>
          {product?.product_discounts[0] && (
            <p className="truncate text-xs text-slate-500">
              <s>{convertRupiah(product?.price)}</s>
              <b className="ml-1 text-rose-500">
                {product?.product_discounts[0]?.discount_type === "percentage"
                  ? product?.product_discounts[0]?.discount + "%"
                  : convertRupiah(product?.product_discounts[0]?.discount)}
              </b>
            </p>
          )}
          <p className="line-clamp-1 text-sm">
            {product?.StoreHasProduct[0]?.qty} stock available
          </p>
        </div>
        <div className="flex items-center gap-1">
          {product?.StoreHasProduct[0]?.store?.store_type === "central" ? (
            <FaStore size={15} />
          ) : (
            <RiGitBranchFill size={15} />
          )}
          <span className="text-sm text-primary">
            {product?.StoreHasProduct[0]?.store?.city?.city_name}
          </span>
        </div>
        <p className="badge-base-100 badge">
          {product?.StoreHasProduct[0]?.store?.name}
        </p>
      </div>
    </Link>
  );
}
