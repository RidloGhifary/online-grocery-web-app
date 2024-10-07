"use client";
import { FormEvent, useId, useState } from "react";
import Select, { SingleValue } from "react-select";
import { ProductCompleteInterface } from "@/interfaces/ProductInterface";
import QuantityBoxV2 from "../ui/QuantityBoxV2";
import { useMutation, useQuery } from "@tanstack/react-query";
import { verifyToken } from "@/actions/user";
import { addProductItemToCart } from "@/actions/products";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";
import { useCart } from "@/context/CartContext";

export default function PublicProductDetailV2({
  productDetail,
  isLoading,
}: {
  productDetail: ProductCompleteInterface;
  isLoading: boolean;
}) {
  const product = productDetail;
  const instanceId = useId();
  const route = useRouter();

  const {
    data,
    isLoading: tokenLoading,
    error,
  } = useQuery({
    queryKey: ["isLogin"],
    queryFn: async () => await verifyToken(),
  });

  const storeSelect: {
    id: number;
    value: number | null | undefined;
    label: string;
  }[] = [];

  const [stock, setStock] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | Date | null>(null);
  const [selectedStore, setSelectedStore] = useState<number | null>(null); // Track selected store
  const cartContext = useCart()

  if (productDetail?.StoreHasProduct !== undefined) {
    productDetail?.StoreHasProduct?.forEach((e, i) => {
      storeSelect.push({
        id: i,
        value: e.store_id,
        label: `${e.store?.name} - ${e.store?.city?.city_name} (${e.store?.city?.type})`,
      });
    });
  }

  function handleStockSelect(
    e: SingleValue<{
      id: number;
      value: number | null | undefined;
      label: string;
    }>
  ) {
    if (product && product.StoreHasProduct) {
      setStock(product?.StoreHasProduct[e?.id!]?.qty!);
      setLastUpdate(product?.StoreHasProduct[e?.id!]?.updatedAt ?? "");
      setSelectedStore(e?.value || null); // Set selected store
    }
  }

  const mutation = useMutation({
    mutationFn: addProductItemToCart,
    onSuccess: () => {
      // route.refresh();
      cartContext.refreshCart()
      toast.success("Success add to cart", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        // containerId:10912
      });
    },
    onError: (err) => {
      toast.error(`You maybe not set your address`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    },
  });

  function handleForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const requiredData = {
      productId: productDetail.id,
      storeId: Number(data.store_id),
      quantity: Number(data.qty),
    };
    mutation.mutate(requiredData);
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
          {/* Product Info */}
          <table className="mb-8 w-full text-gray-800">
            <tbody>
              {/* SKU */}
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
              {/* Category */}
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
              {/* Price */}
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
              {/* Last Update */}
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
                      }
                    )
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Store selection */}
          {tokenLoading ? (
            <span className="loading loading-spinner loading-lg text-primary"></span>
          ) : (
            data &&
            data.ok &&
            product &&
            product.StoreHasProduct &&
            product.StoreHasProduct?.length > 0 && (
              <form onSubmit={handleForm}>
                <div className="flex w-full max-w-full p-3 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
                  <div className="flex w-full flex-col items-center rounded">
                    {/* Nearest Store */}
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

                    {/* Available Stock */}
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

                    {/* Conditional Quantity and Add to Cart */}
                    {selectedStore !== null && stock && stock > 0 && (
                      <>
                        {/* Quantity Box */}
                        <div className="mt-2 inline-flex w-full justify-between">
                          <p className="mr-8 inline-flex items-center font-semibold">
                            Buy quantity
                          </p>
                          {isLoading ? (
                            <span className="loading loading-spinner loading-sm text-primary"></span>
                          ) : (
                            <QuantityBoxV2 fieldName="qty" maximumQty={stock} />
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          className="mt-4 flex w-full items-center justify-center self-end rounded bg-primary px-4 py-2 text-white hover:bg-[#46c073] active:bg-[#0ea345] disabled:opacity-50"
                          type="submit"
                        >
                          + Add to Cart
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            )
          )}
        </div>
      </div>
    </div>
  );
}
