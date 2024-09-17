"use client";
import React, { MouseEvent } from "react";
import Image from "next/image";
// import { productDefault as products } from "@/mocks/productData";
import { FaInfoCircle } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { ProductCompleteInterface } from "@/interfaces/ProductInterface";
import ButtonWithAction from "../ui/ButtonWithAction";
import { useAtom } from "jotai";
import {
  currentDetailProductsAtom,
  currentProductOperation,
} from "@/stores/productStores";
import PermissionWrapper from "../auth/PermissionWrapper";

export default function ({
  products,
}: {
  products: ProductCompleteInterface[];
}) {
  const [, setCurrenctProduct] = useAtom(currentDetailProductsAtom);
  const [, setProductOperation] = useAtom(currentProductOperation);
  function handleDetail(e: MouseEvent) {
    e.preventDefault();
    const currentId = Number(e.currentTarget.id);
    const currentData = products.filter(
      (product) => product.id == currentId,
    )[0];
    setCurrenctProduct(currentData);
    setProductOperation("detail");
  }
  function handleEdit(e: MouseEvent) {
    e.preventDefault();
    const currentId = Number(e.currentTarget.id);
    const currentData = products.filter(
      (product) => product.id == currentId,
    )[0];
    setCurrenctProduct(currentData);
    setProductOperation("edit");
  }
  function handleDelete(e: MouseEvent) {
    e.preventDefault();
    const currentId = Number(e.currentTarget.id);
    const currentData = products.filter(
      (product) => product.id == currentId,
    )[0];
    setCurrenctProduct(currentData);
    setProductOperation("delete");
  }
  return (
    <div className="overflow-x-auto">
      <table className="table w-full text-base">
        <thead>
          <tr>
            <th className="text-lg font-extrabold">Product</th>
            <th className="hidden text-lg font-extrabold sm:table-cell">SKU</th>
            <th className="hidden text-lg font-extrabold sm:table-cell">
              Category
            </th>
            {/* <th className="hidden text-lg font-extrabold md:table-cell">
              Stock
            </th> */}
            <th className="hidden text-lg font-extrabold md:table-cell">
              Unit
            </th>
            <th className="hidden text-lg font-extrabold md:table-cell">
              Price
            </th>
            <th className="text-lg font-extrabold">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="flex min-w-40 flex-col items-start justify-start sm:flex-row sm:items-center sm:space-x-4">
                  <Image
                    src={
                      product.image && product.image !== "[]"
                        ? JSON.parse(product.image!)[0]
                        : "https://via.placeholder.com/150"
                    }
                    alt={product.name}
                    width={50}
                    height={50}
                    className="hidden aspect-square rounded-md object-scale-down sm:table-cell"
                  />
                  {/* {product.name} */}
                  <span>{product.name}</span>
                </div>
              </td>
              <td className="hidden sm:table-cell">{product.sku}</td>
              <td className="hidden sm:table-cell">
                {product.product_category?.display_name}
              </td>
              {/* <td className="hidden md:table-cell">{product.current_stock}</td> */}
              <td className="hidden md:table-cell">{product.unit}</td>
              <td className="hidden md:table-cell">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(product.price)}
              </td>
              <td>
                <div className="flex flex-wrap gap-2">
                  <PermissionWrapper
                    permissionRequired={"admin_product_detail"}
                  >
                    <ButtonWithAction
                      action={handleDetail}
                      replaceTWClass="btn btn-info btn-sm"
                      eventType="onClick"
                      type="button"
                      id={product.id}
                    >
                      <FaInfoCircle />
                    </ButtonWithAction>
                  </PermissionWrapper>
                  <PermissionWrapper
                    permissionRequired={"admin_product_update"}
                  >
                    <ButtonWithAction
                      replaceTWClass="btn btn-accent btn-sm"
                      action={handleEdit}
                      eventType="onClick"
                      type="button"
                      id={product.id}
                    >
                      <FaEdit />
                    </ButtonWithAction>
                  </PermissionWrapper>
                  <PermissionWrapper
                    permissionRequired={"admin_product_delete"}
                  >
                    <ButtonWithAction
                      replaceTWClass="btn btn-error btn-sm"
                      id={product.id}
                      action={handleDelete}
                      eventType="onClick"
                      type="button"
                    >
                      <FaTrash />
                    </ButtonWithAction>
                  </PermissionWrapper>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// export default ProductTable;
