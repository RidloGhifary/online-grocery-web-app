"use client";

import React, { useState } from "react";
import QuantityBox from "../ui/QuantityBox";
import { addItemToCart } from "@/api/cart/route";
import { useCart } from "@/context/CartContext";
import convertToRupiah from "@/utils/convertRupiah";

export default function PublicProductDetail({ product }) {
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStock, setCurrentStock] = useState<number>(
    product.current_stock,
  );
  const { refreshCart } = useCart();

  const handleAddToCart = async () => {
    setLoading(true);
    setError(null);

    try {
      if (currentStock >= quantity) {
        const response = await addItemToCart(
          product.id,
          quantity,
          product.store_id,
        );
        console.log("Item added to cart:", response.data);
        alert("Item added to cart!");
        setCurrentStock((prevStock) => prevStock - quantity);
        setQuantity(1);
        refreshCart();
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to add item to cart.";
      console.error("Failed to add item to cart:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-5 mt-6 max-w-xl">
      <div className="flex justify-center pb-2">
        <h1 className="mt-2 text-xl font-bold text-gray-800 lg:text-2xl">
          {product.name}
        </h1>
      </div>
      <div>
        <div className="my-7 p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
          <table className="w-full text-gray-800">
            <tbody>
              <tr className="border-b">
                <td className="py-2 text-sm">ID</td>
                <td className="py-2 text-right text-sm">{product.id}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm">SKU</td>
                <td className="py-2 text-right text-sm">{product.sku}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm">Name</td>
                <td className="py-2 text-right text-sm">{product.name}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm">Price</td>
                <td className="py-2 text-right text-sm">
                  {convertToRupiah(product.price)}
                </td>
              </tr>
              <tr className="">
                <td className="py-2 text-sm">Last Update</td>
                <td className="py-2 text-right text-sm">
                  {new Date(product.updatedAt).toDateString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-justify text-base leading-normal text-gray-600 lg:leading-tight dark:text-slate-600">
          {product.description}
        </p>
        <table className="mt-4 w-full text-gray-800">
          <tbody>
            <tr>
              <td className="py-2 text-sm">Stock</td>
              <td className="py-2 text-right text-sm">{currentStock}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex w-full max-w-full justify-end">
        <div className="flex w-80 flex-col items-center justify-end rounded">
          <div className="mt-2 inline-flex self-end">
            <QuantityBox
              qty={quantity}
              setQty={setQuantity}
              maxQty={currentStock}
            />
          </div>
          <button
            className="mt-4 flex w-40 items-center justify-center self-end rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50"
            onClick={handleAddToCart}
            disabled={loading || currentStock === 0}
          >
            {loading ? "Adding..." : "Add to order"}
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
          {error && (
            <p className="mt-2 flex w-40 items-center justify-center self-end text-red-500">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
