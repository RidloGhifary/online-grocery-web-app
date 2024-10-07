"use client";
import {
  currentDetailProductsAtom,
} from "@/stores/productStores";
import { useAtom } from "jotai";

export default function AdminProductDetail() {
  const [currentProduct] = useAtom(currentDetailProductsAtom);

  const product = currentProduct;
  

  if (!product) {
    return <></>;
  }

  return (
    <div className="mt-6 w-full max-w-3xl">
      <div className="flex justify-center pb-2">
        <h1 className="mt-5 text-center text-3xl font-bold text-gray-800 lg:text-4xl">
          {product.name}
        </h1>
      </div>

      <div className="flex w-full justify-center">
        <div className="my-7 flex w-full max-w-full flex-col p-6">
          <table className="mb-8 w-full text-gray-800">
            <tbody>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">SKU</td>
                <td className="py-2 text-right text-sm">{product.sku}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Category</td>
                <td className="py-2 text-right text-sm">
                  {product.product_category?.display_name}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Price</td>
                <td className="py-2 text-right text-sm">
                  {product.price?.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Last Update</td>
                <td className="py-2 text-right text-sm">
                  {new Date(product?.updatedAt as string).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Created At</td>
                <td className="py-2 text-right text-sm">
                  {new Date(product?.createdAt as string).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mb-8 flex w-full justify-start">
            <p className="text-justify text-base leading-normal text-gray-600 lg:leading-tight dark:text-slate-600">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
