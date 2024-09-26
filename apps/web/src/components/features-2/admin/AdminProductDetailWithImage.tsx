"use client";
import React, { MouseEvent, useState } from "react";
import CarouselWithThumb from "@/components/features-2/ui/CarouselWithThumb";
import AdminProductDetail from "./AdminProductDetail";
import { useAtom } from "jotai";
import {
  currentDetailProductsAtom,
  currentProductOperation,
} from "@/stores/productStores";
import Button from "../ui/ButtonWithAction";
import { FaEdit, FaTrash } from "react-icons/fa";
import PermissionWrapper from "../auth/PermissionWrapper";

export default function AdminProductDetailWithImage() {
  const [currentProduct] = useAtom(currentDetailProductsAtom);
  const [, setProductOperation] = useAtom(currentProductOperation);
  function handleEdit(e: MouseEvent) {
    e.preventDefault();
    setProductOperation("edit");
  }
  function handleDelete(e: MouseEvent) {
    e.preventDefault();
    setProductOperation("delete");
  }
  const [tab, setTab] = useState<"Detail" | "Images">("Detail");
  function handleTabClick(e: MouseEvent<HTMLInputElement>) {
    // e.preventDefault();
    setTab(e.currentTarget.value as "Detail" | "Images");
  }

  if (!currentProduct) {
    return <></>;
  }

  return (
    <>
      <div className="flex max-w-full flex-row items-center justify-center">
        <div role="tablist" className="tabs-boxed tabs mt-5">
          <input
            type="radio"
            defaultChecked={tab === "Detail"}
            name="detail_menu"
            role="tab"
            className="tab font-bold"
            aria-label="Detail"
            onClick={handleTabClick}
            value={"Detail"}
          />
          <input
            type="radio"
            name="detail_menu"
            role="tab"
            className="tab font-bold"
            aria-label="Images"
            value={"Images"}
            onClick={handleTabClick}
            defaultChecked={tab === "Images"}
          />
        </div>
      </div>
      <div className="my-4 flex w-full max-w-full items-center justify-center">
        {tab === "Detail" ? <AdminProductDetail /> : ""}
        {tab === "Images" ? (
          <>
            <div className="max-w-full md:max-w-sm">
              <CarouselWithThumb images={JSON.parse(currentProduct?.image!)} />
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-row justify-end gap-3">
        <PermissionWrapper permissionRequired={"admin_product_update"}>
          <Button
            replaceTWClass="btn btn-accent btn-sm"
            action={handleEdit}
            eventType="onClick"
            type="button"
            id={currentProduct.id}
          >
            Edit
            <FaEdit />
          </Button>
        </PermissionWrapper>
        <PermissionWrapper permissionRequired={"admin_product_delete"}>
          <Button
            replaceTWClass="btn btn-error btn-sm"
            id={currentProduct.id}
            action={handleDelete}
            eventType="onClick"
            type="button"
          >
            Delete
            <FaTrash />
          </Button>
        </PermissionWrapper>
      </div>
    </>
  );
}
