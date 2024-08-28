"use client";

import Image from "next/image";
import Link from "next/link";
import { RiGitBranchFill } from "react-icons/ri";

export default function () {
  return (
    // w-11/12
    <Link href={`/products/1`} className="card sm:h-[350px] min-[400px]:w-56 w-11/12 h-auto aspect-[16/25] bg-white shadow ">
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
        <p className="line-clamp-2 text-sm">
          ASUS ROG ALLY X AMD Z1 EXTREME 24GB 1TB W11 7.0FHD 120HZ BLK
        </p>
        <div>
          <p className="truncate font-semibold">Rp. 1.000.000</p>
          <p className="truncate text-xs text-slate-500">
            <s>Rp. 2.000.000</s>
            <b className="ml-1 text-rose-500">50%</b>
          </p>
        </div>
        <div className="flex items-center gap-1">
          <RiGitBranchFill size={15} />
          <span className="text-sm text-primary">Jakarta</span>
        </div>
        <p className="badge-base-100 badge">2rb Sold</p>
      </div>
    </Link>
  );
}
