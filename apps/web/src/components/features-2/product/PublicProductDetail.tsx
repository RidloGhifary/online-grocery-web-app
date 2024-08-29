"use client";

import React from "react";
import { products } from "@/mocks/productData";
import QuantityBox from "../ui/QuantityBox";

const product = products[0]; // Example product

export default function PublicProductDetail() {
  return (
    <>
      <div className="mx-5 mt-6 max-w-xl">
        <div className="flex justify-center pb-2">
          <h1 className="mt-2 text-xl font-bold text-gray-800 lg:text-2xl">
            Balenciaga Signature Sweatshirt
          </h1>
        </div>
        <div>
          <div className="my-7 p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
            {/* <h3 className="text-xl font-semibold text-gray-800">
              Product information
            </h3> */}
            <table className="w-full text-gray-800">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 text-sm">SKU</td>
                  <td className="py-2 text-right text-sm">PROD001</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-sm">Name</td>
                  <td className="py-2 text-right text-sm">Organic Bananas</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-sm">Price</td>
                  <td className="py-2 text-right text-sm">Rp 20.000,00</td>
                </tr>
                <tr className="">
                  <td className="py-2 text-sm">Last Update</td>
                  <td className="py-2 text-right text-sm">
                    {product.updatedAt && product.updatedAt.toDateString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-justify text-base leading-normal text-gray-600 lg:leading-tight dark:text-slate-600">
            It is a long established fact that a reader will be distracted by
            thereadable content of a page when looking at its layout. The point
            of usingLorem Ipsum is that it has a more-or-less normal
            distribution of letters.
          </p>
          <table className="mt-4 w-full text-gray-800">
            <tbody>
              <tr>
                <td className="py-2 text-sm">Stock</td>
                <td className="py-2 text-right text-sm">10</td>
              </tr>
              {/* <tr>
                <td className="py-2 text-sm">Price</td>
                <td className="py-2 text-right text-sm">Rp 20.000,00</td>
              </tr> */}
            </tbody>
          </table>
        </div>
        <div className="flex w-full max-w-full justify-end">
          <div className="flex w-80 flex-col items-center rounded justify-end">
            <div className="mt-2 inline-flex self-end">
              <QuantityBox />
            </div>
            <button className="mt-4 flex w-40 items-center justify-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 self-end">
              Add to order
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
