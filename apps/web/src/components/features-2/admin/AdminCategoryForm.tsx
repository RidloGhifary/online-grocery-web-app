"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ButtonWithAction from "../ui/ButtonWithAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { FaCheck, FaRegSave } from "react-icons/fa";
import { Bounce, toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { createCategory } from "@/actions/categories";
import { CategoryInterface } from "@/interfaces/CategoryInterface";
import { currentProductCategoryOperation } from "@/stores/productCategoryStores";

// Define the Zod schema for validation
const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  display_name: z.string().min(1, "Display Name is required"),
});

// TypeScript type for the form values
type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoryForm() {
  const queryClient = useQueryClient();
  const queryParams = useSearchParams();

  const [, setCurrentOperation] = useAtom(currentProductCategoryOperation);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      display_name: "",
      name: "",
    },
  });
  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Success add data", {
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
      const params = {
        search: queryParams.get("search") || "",
        orderField: queryParams.get("orderField") || "name",
        order: (queryParams.get("order") as "asc" | "desc") || "asc",
        page: Number(queryParams.get("page")) || 1,
        limit: Number(queryParams.get("limit")) || 20,
      };
      setTimeout(() => {
        mutation.reset();
      }, 500);
      return queryClient.invalidateQueries({
        queryKey: [queryKeys.productCategories, { ...params }],
      });
      // setTimeout(()=>{router.refresh();},2000)
      // router.refresh();
    },
    onError: (e) => {
      let error: any = "";
      if (typeof JSON.parse(e.message) === "string") {
        error = JSON.parse(
          JSON.parse(e.message),
        ) as unknown as CommonResultInterface<CategoryInterface>;
        error = (error as unknown as CommonResultInterface<CategoryInterface>)
          .error;
      } else {
        error = JSON.parse(
          e.message,
        ) as unknown as CommonResultInterface<CategoryInterface>;
        error = (error as unknown as CommonResultInterface<CategoryInterface>)
          .error;
      }

      if (typeof error === "object") {
        if (Array.isArray(error)) {
          // console.log(error);
          (error as Array<{ message: string }>).forEach((e, i) => {
            toast.error(e.message, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
              containerId: 10912,
              toastId: i,
            });
          });
        }
      } else {
        toast.error(error.error, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
          containerId: 10912,
        });
      }
    },
  });
  const onSubmit = (data: CategoryFormValues) => {
    // console.log("Form Data:", data);
    mutation.mutate(data as unknown as CategoryInterface);
  };

  // Transform categories data for React Select
  useEffect(() => {
    if (mutation.isSuccess) {
      // console.log("success");
      queryClient.invalidateQueries({
        queryKey: [queryKeys.productCategories],
      });
      setCurrentOperation("idle");
    }
  }, [mutation.isSuccess]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-center text-xl font-extrabold">Add Category</h1>

      {/* Name */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">Name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
          disabled={mutation.isSuccess}
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
          disabled={mutation.isSuccess}
          {...register("display_name")}
        />
        {errors.display_name && (
          <p className="text-red-500">{errors.display_name.message}</p>
        )}
      </label>

      <div className="flex max-w-full justify-end py-5">
        <ButtonWithAction type="submit" replaceTWClass="btn btn-primary btn-sm">
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
        </ButtonWithAction>
      </div>
    </form>
  );
}
