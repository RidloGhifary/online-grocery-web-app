"use client";
import React, { MouseEvent } from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import {
  currentAdminOperationAtom,
  currentDetailAdminAtom,
} from "@/stores/adminStores";
import AdminManageDetail from "./AdminManageDetail";
import PermissionWrapper from "../auth/PermissionWrapper";
import Button from "../ui/ButtonWithAction";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function () {
  const [currentAdmin] = useAtom(currentDetailAdminAtom);

  const [, setAdminOperation] = useAtom(currentAdminOperationAtom);
  function handleEdit(e: MouseEvent) {
    e.preventDefault();
    setAdminOperation("edit");
  }
  function handleDelete(e: MouseEvent) {
    e.preventDefault();
    setAdminOperation("delete");
  }

  if (!currentAdmin) {
    return <></>;
  }

  return (
    <>
      <div className="my-4 flex w-full max-w-full flex-col items-center justify-center">
        <div className="flex justify-center pb-2">
          <h1 className="mt-5 text-center text-3xl font-bold text-gray-800 lg:text-4xl">
            Admin Detail
          </h1>
        </div>
        <div className="max-w-full md:max-w-sm">
          <Image
            src={currentAdmin?.image ?? "https://placehold.co/600x400.svg"}
            alt={`Image`}
            className="aspect-square max-w-full rounded-lg object-scale-down"
            width={100}
            height={100}
            priority
          />
        </div>
        <AdminManageDetail />
        <div className="w-full">
          <div className="flex flex-row justify-end gap-3">
            <PermissionWrapper permissionRequired={"super"}>
              <Button
                replaceTWClass="btn btn-accent btn-sm"
                action={handleEdit}
                eventType="onClick"
                type="button"
                id={currentAdmin.id}
              >
                Edit
                <FaEdit />
              </Button>
            </PermissionWrapper>
            <PermissionWrapper permissionRequired={"super"}>
              <Button
                replaceTWClass="btn btn-error btn-sm"
                id={currentAdmin.id}
                action={handleDelete}
                eventType="onClick"
                type="button"
              >
                Delete
                <FaTrash />
              </Button>
            </PermissionWrapper>
          </div>
        </div>
      </div>
    </>
  );
}
