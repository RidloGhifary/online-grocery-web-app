"use client";
import React, { MouseEvent, useState } from "react";
import { useAtom } from "jotai";
import {
  currentCustomerOperation,
  currentDetailCustomerAtom,
} from "@/stores/customerStores";
import Image from "next/image";
import AdminCustomerDetail from "./AdminCustomerDetail";

export default function () {
  const [currentCustomer] = useAtom(currentDetailCustomerAtom);

  if (!currentCustomer) {
    return <></>;
  }

  return (
    <>
      <div className="my-4 flex w-full max-w-full flex-col items-center justify-center">
        <div className="flex justify-center pb-2">
          <h1 className="mt-5 text-center text-3xl font-bold text-gray-800 lg:text-4xl">
            Customer Detail
          </h1>
        </div>
        <div className="max-w-full md:max-w-sm">
          <Image
            src={currentCustomer?.image ?? "https://placehold.co/600x400.svg"}
            alt={`Image`}
            className="aspect-square max-w-full rounded-lg object-scale-down"
            width={100}
            height={100}
            priority
          />
        </div>
        <AdminCustomerDetail />
      </div>
    </>
  );
}
