"use client";
import { FormEvent, useId, useState } from "react";
import Select, { SingleValue } from "react-select";
import { ProductCompleteInterface } from "@/interfaces/ProductInterface";
import QuantityBoxV2 from "../ui/QuantityBoxV2";
import { useQuery } from "@tanstack/react-query";
import { verifyToken } from "@/actions/user";

export default function PublicProductDetailV2({
  productDetail,
  isLoading,
}: {
  productDetail: ProductCompleteInterface;
  isLoading: boolean;
}) {
  const product = productDetail;
  const instanceId = useId();
  // const isLogin =
  const { data, isLoading: tokenLoading, error } = useQuery({
    queryKey: ["isLogin"],
    queryFn:  async () => await verifyToken(),
  });
  const storeSelect: {
    id: number;
    value: number | null | undefined;
    label: string;
  }[] = [];
  // console.log(error);
  
  const [stock, setStock] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | Date | null>(null);

  if (productDetail?.StoreHasProduct !== undefined) {
    productDetail?.StoreHasProduct?.forEach((e, i) => {
      storeSelect.push({
        id: i,
        value: e.store_id,
        label: `${e.store?.name} (${e.store?.city?.city_name})`,
      });
    });
  }
  

  function handleStockSelect(
    e: SingleValue<{
      id: number;
      value: number | null | undefined;
      label: string;
    }>,
  ) {
    if (product && product.StoreHasProduct) {
      setStock(product?.StoreHasProduct[e?.id!]?.qty!);
      setLastUpdate(product?.StoreHasProduct[e?.id!]?.updatedAt ?? "");
    }
  }

  function handleForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    console.log("Form Data:", data);

    // You can handle form data submission to an API or perform actions here.
    // For example:
    // submitFormDataToAPI(data);
  }

  return (
    <div className="mt-6 w-full max-w-3xl">
      <div className="flex justify-center pb-2">
        <h1 className="mt-5 text-center text-3xl font-bold text-gray-800 lg:text-4xl">
          {isLoading ? (
            <span className="loading loading-spinner loading-md text-primary"></span>
          ) : (
            product.name
          )}
        </h1>
      </div>

      <div className="flex w-full justify-center">
        <div className="my-7 flex w-full max-w-full flex-col p-6">
          <table className="mb-8 w-full text-gray-800">
            <tbody>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">SKU</td>
                <td className="py-2 text-right text-sm">
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm text-primary"></span>
                  ) : (
                    product.sku
                  )}
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
                    new Date(product?.updatedAt as string).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )
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
          {tokenLoading ? (
            <>
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </>
          ) : (
            <>
              {data && data.ok && product&& product.StoreHasProduct&&product.StoreHasProduct?.length>0  ? (
                <form onSubmit={handleForm}>
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
                              options={storeSelect}
                              placeholder="Select store..."
                              className="w-full"
                              onChange={handleStockSelect}
                              name="store_id"
                            />
                          )}
                        </div>
                      </div>
                      <div className="mt-2 inline-flex w-full justify-between">
                        <p className="mr-8 inline-flex items-center font-semibold">
                          Available Stock
                        </p>
                        <p className="inline-flex items-center">
                          {isLoading ? (
                            <span className="loading loading-spinner loading-sm text-primary"></span>
                          ) : (
                            <>
                              {stock}
                              <input
                                type="hidden"
                                name="stock"
                                value={stock || ""}
                              />
                            </>
                          )}
                        </p>
                      </div>
                      <div className="mt-2 inline-flex w-full justify-between">
                        <p className="mr-8 inline-flex items-center font-semibold">
                          Last Update
                        </p>
                        <p className="inline-flex items-center">
                          {isLoading ? (
                            <span className="loading loading-spinner loading-sm text-primary"></span>
                          ) : (
                            lastUpdate &&
                            product?.StoreHasProduct &&
                            new Date(lastUpdate as string).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )
                          )}
                        </p>
                      </div>
                      <div className="mt-2 inline-flex w-full justify-between">
                        <p className="mr-8 inline-flex items-center font-semibold">
                          Buy quantity
                        </p>
                        {isLoading ? (
                          <span className="loading loading-spinner loading-sm text-primary"></span>
                        ) : (
                          <QuantityBoxV2 fieldName="qty" />
                        )}
                      </div>
                      <button
                        className="mt-4 flex w-full items-center justify-center self-end rounded bg-primary px-4 py-2 text-white hover:bg-[#46c073] active:bg-[#0ea345] disabled:opacity-50"
                        type="submit"
                      >
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
                </form>
              ) : (
                ""
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
