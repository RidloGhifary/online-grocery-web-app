//detail product
'use client'
import { useId } from "react";
import Select from "react-select";
import { ProductCompleteInterface } from "@/interfaces/ProductInterface";
import QuantityBoxV2 from "../ui/QuantityBoxV2";

const mockStores = [
  { id: 0, value: "store1", label: "Store 1" },
  { id: 1, value: "store2", label: "Store 2" },
  { id: 2, value: "store3", label: "Store 3" },
];

export default function PublicProductDetail({
  productDetail,
  isLoading,
}: {
  productDetail: ProductCompleteInterface;
  isLoading: boolean;
}) {
  const product = productDetail;
  const instanceId = useId();

  return (
    <div className="mt-6 w-full max-w-3xl">
      <div className="flex justify-center pb-2">
        <h1 className="mt-5 text-center text-3xl font-bold text-gray-800 lg:text-4xl">
          {isLoading ? <span className="loading loading-spinner loading-md text-primary"></span> : product.name}
        </h1>
      </div>

      <div className="flex w-full justify-center">
        <div className="my-7 flex w-full max-w-full flex-col p-6">
          <table className="mb-8 w-full text-gray-800">
            <tbody>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">SKU</td>
                <td className="py-2 text-right text-sm">
                  {isLoading ? <span className="loading loading-spinner loading-sm text-primary"></span> : product.sku}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Category</td>
                <td className="py-2 text-right text-sm">
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm text-primary"></span>
                  ) : (
                    product.product_category?.display_name
                  )}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Price</td>
                <td className="py-2 text-right text-sm">
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm text-primary"></span>
                  ) : (
                    product.price?.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })
                  )}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Last Update</td>
                <td className="py-2 text-right text-sm">
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm text-primary"></span>
                  ) : (
                    new Date(product?.updatedAt as string).toLocaleDateString('en-US', {
                      weekday: 'long',  // "Sunday"
                      year: 'numeric',  // "2024"
                      month: 'long',    // "September"
                      day: 'numeric'    // "1"
                  })
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mb-8 flex w-full justify-start">
            <p className="text-justify text-base leading-normal text-gray-600 lg:leading-tight dark:text-slate-600">
              {isLoading ? (
                <span className="loading loading-spinner loading-md text-primary"></span>
              ) : (
                product.description
              )}
            </p>
          </div>
          <div className="flex w-full max-w-full p-3 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
            <div className="flex w-full flex-col items-center rounded">
              <div className="my-2 inline-flex w-full justify-between">
                <p className="mr-8 inline-flex items-center font-semibold">
                  Nearest Store
                </p>
                <div className="inline-flex w-1/2 items-center">
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm text-primary"></span>
                  ) : (
                    <Select
                      instanceId={instanceId}
                      options={mockStores}
                      placeholder="Select store..."
                      className="w-full"
                    />
                  )}
                </div>
              </div>
              <div className="mt-2 inline-flex w-full justify-between">
                <p className="mr-8 inline-flex items-center font-semibold">
                  Avalaible Stock
                </p>
                <p className="inline-flex items-center">
                  {isLoading ? <span className="loading loading-spinner loading-sm text-primary"></span> : product.current_stock}
                </p>
              </div>
              <div className="mt-2 inline-flex w-full justify-between">
                <p className="mr-8 inline-flex items-center font-semibold">
                  Last Update
                </p>
                <p className="inline-flex items-center">
                  {isLoading ? <span className="loading loading-spinner loading-sm text-primary"></span> : new Date(product?.updatedAt as string).toLocaleDateString('en-US', {
                      weekday: 'long',  // "Sunday"
                      year: 'numeric',  // "2024"
                      month: 'long',    // "September"
                      day: 'numeric'    // "1"
                  })}
                </p>
              </div>
              <div className="mt-2 inline-flex w-full justify-between">
                <p className="mr-8 inline-flex items-center font-semibold">
                  Buy quantity
                </p>
                {isLoading ? <span className="loading loading-spinner loading-sm text-primary"></span> : <QuantityBoxV2 />}
              </div>
              <button className="mt-4 flex w-full items-center justify-center self-end rounded bg-primary px-4 py-2 text-white hover:bg-[#46c073] active:bg-[#0ea345] disabled:opacity-50">
                +
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
      </div>
    </div>
  );
}
