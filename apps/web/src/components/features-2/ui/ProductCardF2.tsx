"use client";

import { ProductCardListInterface } from "@/interfaces/ProductInterface";
import Image from "next/image";
import Link from "next/link";
import { RiGitBranchFill } from "react-icons/ri";

export default function ({
  name = "lorem",
  price = 10000,
  city = "Jakarta",
  slug = "lorem",
}: ProductCardListInterface) {
  return (
    // w-11/12
    <Link
      href={`/products/${slug}`}
      className="card aspect-[16/25] h-auto w-11/12 bg-white shadow min-[400px]:w-56 sm:h-[350px]"
    >
      <figure>
        <Image
          width={300}
          height={300}
          src="/sample-product-image.jpg"
          alt="Placeholder"
          className="h-[180px] w-full object-contain"
          loading="lazy"
        />
      </figure>
      <div className="mt-2 space-y-1 p-1">
        <p className="line-clamp-2 text-sm">{name}</p>
        <div>
          <p className="truncate font-semibold">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(price)}
          </p>
          <p className="truncate text-xs text-slate-500">
            <s>Rp. 2.000.000</s>
            <b className="ml-1 text-rose-500">50%</b>
          </p>
        </div>
        <div className="flex items-center gap-1">
          <RiGitBranchFill size={15} />
          <span className="text-sm text-primary">{city}</span>
        </div>
        <p className="badge-base-100 badge">2rb Sold</p>
      </div>
    </Link>
  );
}
