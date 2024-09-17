"use client";
import React, { MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Bounce } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { updateProduct } from "@/actions/products";
import {
  ProductCompleteInterface,
  UpdateProductInputInterface,
} from "@/interfaces/ProductInterface";
import { FaCheck, FaInfo, FaRegSave, FaTrash } from "react-icons/fa";
import Button from "../ui/ButtonWithAction";
import { queryKeys } from "@/constants/queryKeys";
import { useAtom } from "jotai";
import CommonPaginatedResultInterface from "@/interfaces/CommonPaginatedResultInterface";
import { CategoryInterface } from "@/interfaces/CategoryInterface";
import { currentDetailCategorysAtom, currentProductCategoryOperation } from "@/stores/productCategoryStores";
import { updateCategory } from "@/actions/categories";

// Define the Zod schema for validation
const updateCategorySchema = z.object({
  id: z.number().positive().nullable().optional(),
  name: z.string().min(1, "Name is required"),
  display_name: z.string().min(1, "Display Name is required"),
});

// TypeScript type for the form values
type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>;

export default function AdminCategoryUpdateForm() {
  const [initialData, setInitialData] = useAtom(currentDetailCategorysAtom);
  const queryParams = useSearchParams();
  const queryClient = useQueryClient();
  const [, setCurrentOperation] = useAtom(currentProductCategoryOperation);

  function handleDelete(e: MouseEvent) {
    e.preventDefault();
    setCurrentOperation("delete");
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateCategoryFormValues>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const mutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      toast.success("Category updated successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        // toastId:1,
        // containerId:10912
      });
      const params = {
        search: queryParams.get("search") || "",
        orderField: queryParams.get("orderField") || "name",
        order: (queryParams.get("order") as "asc" | "desc") || "asc",
        category: queryParams.get("category") || "",
        page: Number(queryParams.get("page")) || 1,
        limit: Number(queryParams.get("limit")) || 20,
      };
      setTimeout(() => {
        mutation.reset();
      }, 500);
      return queryClient.invalidateQueries({
        queryKey: [queryKeys.productCategories, { ...params }],
      });
    },
    onError: (error) => {
      let errorMessage = "";
      try {
        const parsedError = JSON.parse(error.message);
        errorMessage = parsedError.error || "An error occurred";
      } catch {
        errorMessage = "An error occurred";
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        // toastId:2,
        containerId:10912
      });
    },
  });

  const onSubmit = (data: UpdateCategoryFormValues) => {
    // Create a copy of the submitted data
    const modifiedData = { ...data };
    // console.log(data);
    
    // Iterate over the keys of the submitted data
    Object.keys(data).forEach((key) => {
      // Skip the 'id' field
      if (key === "id") return;

      // Compare the submitted value with the initial value
      type CommonKeys = keyof UpdateCategoryFormValues &
        keyof ProductCompleteInterface;

      if (data[key as CommonKeys] === initialData?.[key as CommonKeys]) {
        // If the value is the same as the initial data, delete the field
        delete modifiedData[key as keyof UpdateCategoryFormValues];
      }
    });

    // Check if there are any changes (i.e., modifiedData contains more than just the 'id')
    if (Object.keys(modifiedData).length > 1) {
      // Submit the modified data
      mutation.mutate(modifiedData as CategoryInterface);
    } else {
      // No changes, notify the user or handle accordingly
      toast.info("No changes to update", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        toastId: 3,
        containerId: 10912,
      });
    }
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      console.log("success");
      const params = {
        search: queryParams.get("search") || "",
        orderField: queryParams.get("orderField") || "name",
        order: (queryParams.get("order") as "asc" | "desc") || "asc",
        page: Number(queryParams.get("page")) || 1,
        limit: Number(queryParams.get("limit")) || 20,
      };
      const updatedData = (queryClient.getQueryData([queryKeys.productCategories,{...params}]) as CommonPaginatedResultInterface<CategoryInterface[]>).data?.data?.filter(category=>category.id == initialData?.id )[0]
      if (updatedData) {
        setInitialData(updatedData)
      }
      queryClient.invalidateQueries({
        queryKey: [queryKeys.productCategories, { ...params }],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.productCategories],
      });
      setCurrentOperation("idle");
    }
  }, [mutation.isSuccess]);

  if (!initialData) {
    return <></>;
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-center text-xl font-extrabold">Update Product</h1>

      {/* Name */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">Name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
          {...register("name")}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </label>

      {/* SKU */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">Display Name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className={`input input-bordered w-full ${errors.display_name ? "input-error" : ""}`}
          {...register("display_name")}
        />
        {errors.display_name && <p className="text-red-500">{errors.display_name.message}</p>}
      </label>

      {/* Submit button */}
      <div className="flex max-w-full justify-end py-5">
        <div className="flex flex-row justify-end gap-3">
          <Button
            replaceTWClass="btn btn-error btn-sm"
            id={initialData.id}
            action={handleDelete}
            eventType="onClick"
            type="button"
          >
            Delete
            <FaTrash />
          </Button>

          <Button type="submit" replaceTWClass="btn btn-primary btn-sm">
            Save <FaRegSave />
            {mutation.isPending ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : mutation.isSuccess ? (
              <>
                <FaCheck />
              </>
            ) : (
              ""
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
