"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Select from "react-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Bounce } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { updateProduct } from "@/actions/products";
import {
  ProductCategoryInterface,
  ProductCompleteInterface,
  UpdateProductInputInterface,
} from "@/interfaces/ProductInterface";
import { UploadDropzone } from "@/utils/uploadthing";
import { FaCheck, FaTrash } from "react-icons/fa";
import Image from "next/image";
import ButtonWithAction from "../ui/ButtonWithAction";
import { Reorder, useDragControls } from "framer-motion";
import { IoReorderFour } from "react-icons/io5";
import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { queryKeys } from "@/constants/queryKeys";
import { useAtom } from "jotai";
import {
  currentDetailProductsAtom,
  currentProductOperation,
} from "@/stores/productStores";

// Define the Zod schema for validation
const updateProductSchema = z.object({
  id: z.number().positive(),
  sku: z.string().min(1, "SKU is required").optional(),
  name: z.string().min(1, "Name is required").optional(),
  product_category_id: z
    .number()
    .int()
    .min(1, "Category ID is required")
    .optional(),
  description: z.string().nullable().optional(),
  unit: z.string().min(1, "Unit is required").optional(),
  unit_in_gram: z
    .number()
    .positive("Unit in grams must be a positive number")
    .optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  image: z.string().nullable().optional(), // Handle image as a string or null
});

// TypeScript type for the form values
type UpdateProductFormValues = z.infer<typeof updateProductSchema>;

// interface ProductUpdateFormProps {
//   initialData?: UpdateProductInputInterface;
// }

export default function AdminProductUpdateForm() {
  const [initialData] = useAtom(currentDetailProductsAtom);
  const queryParams = useSearchParams();

  // const router = useRouter();
  const queryClient = useQueryClient();
  const categories = queryClient.getQueryData<
    CommonResultInterface<ProductCategoryInterface[]>
  >([queryKeys.productCategories]);

  const controls = useDragControls();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UpdateProductFormValues>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: initialData,
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [, setCurrentOperation] = useAtom(
    currentProductOperation,
  );

  useEffect(() => {
    if (initialData) {
      // Check if the image is a valid JSON string or already an array
      const parsedImages =
        typeof initialData.image === "string"
          ? JSON.parse(initialData.image)
          : Array.isArray(initialData.image)
            ? initialData.image
            : [];

      setUploadedImages(parsedImages);
      reset(initialData); // Reset form values with initial data
    }
  }, [initialData, reset]);

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const mutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success("Product updated successfully", {
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
        // containerId:10913
      });
      // setCurrentOperation('idle')
      const params = {
        search: queryParams.get("search") || "",
        orderField: queryParams.get("orderField") || "product_name",
        order: (queryParams.get("order") as "asc" | "desc") || "asc",
        category: queryParams.get("category") || "",
        page: Number(queryParams.get("page")) || 1,
        limit: Number(queryParams.get("limit")) || 20,
      };
      setTimeout(() => {
        mutation.reset();
      }, 500);
      return queryClient.invalidateQueries({
        queryKey: [queryKeys.products, { ...params }],
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
        // containerId:10913
      });
    },
  });

  const onSubmit = (data: UpdateProductFormValues) => {
    // Create a copy of the submitted data
    const modifiedData = { ...data };

    // Iterate over the keys of the submitted data
    Object.keys(data).forEach((key) => {
      // Skip the 'id' field
      if (key === "id") return;

      // Compare the submitted value with the initial value
      type CommonKeys = keyof UpdateProductFormValues &
        keyof ProductCompleteInterface;

      if (data[key as CommonKeys] === initialData?.[key as CommonKeys]) {
        // If the value is the same as the initial data, delete the field
        delete modifiedData[key as keyof UpdateProductFormValues];
      }
    });

    // Check if there are any changes (i.e., modifiedData contains more than just the 'id')
    if (Object.keys(modifiedData).length > 1) {
      // Submit the modified data
      mutation.mutate(modifiedData as UpdateProductInputInterface);
    } else {
      // No changes, notify the user or handle accordingly
      // setCurrentOperation("idle");
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
        toastId:3,
        containerId:10913
      });
    }
  };

  const categoryOptions = categories?.data?.map((category) => ({
    value: category.id,
    label: category.display_name || category.name,
  }));

  const handleUploadComplete = (urls: string[]) => {
    setUploadedImages((prev) => [...prev, ...urls]);
    setValue("image", JSON.stringify(urls));
  };

  const removeImage = (url: string) => {
    const updatedImages = uploadedImages.filter((img) => img !== url);
    setUploadedImages(updatedImages);
    setValue("image", JSON.stringify(updatedImages));
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      console.log("success");
      setCurrentOperation("idle");
    }
  }, [mutation.isSuccess]);

  if (!initialData) {
    return <></>;
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-center text-xl font-extrabold">Update Product</h1>

      {/* SKU */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">SKU</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className={`input input-bordered w-full ${errors.sku ? "input-error" : ""}`}
          {...register("sku")}
        />
        {errors.sku && <p className="text-red-500">{errors.sku.message}</p>}
      </label>

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

      {/* Product Category */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">Product Category</span>
        </div>
        <Select
          instanceId={"adminProductFormInModal"}
          options={categoryOptions}
          onChange={(option) =>
            setValue("product_category_id", option?.value || 0)
          }
          placeholder="Select a category"
          value={categoryOptions?.find(
            (option) => option.value === watch("product_category_id"),
          )}
        />
        {errors.product_category_id && (
          <p className="text-red-500">{errors.product_category_id.message}</p>
        )}
      </label>

      {/* Unit */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">Unit</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className={`input input-bordered w-full ${errors.unit ? "input-error" : ""}`}
          {...register("unit")}
        />
        {errors.unit && <p className="text-red-500">{errors.unit.message}</p>}
      </label>

      {/* Unit in gram */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">Unit in gram</span>
        </div>
        <input
          type="number"
          min={0}
          placeholder="Type here"
          className={`input input-bordered w-full ${errors.unit_in_gram ? "input-error" : ""}`}
          {...register("unit_in_gram", { valueAsNumber: true })}
        />
        {errors.unit_in_gram && (
          <p className="text-red-500">{errors.unit_in_gram.message}</p>
        )}
      </label>

      {/* Price */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">Price</span>
        </div>
        <input
          min={0}
          type="number"
          placeholder="Type here"
          className={`input input-bordered w-full ${errors.price ? "input-error" : ""}`}
          {...register("price", { valueAsNumber: true })}
        />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </label>

      {/* Description */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">Description</span>
        </div>
        <textarea
          placeholder="Type here"
          className={`textarea textarea-bordered w-full ${errors.description ? "textarea-error" : ""}`}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </label>

      {/* Image upload section */}
      <div className="form-control">
        <div className="label font-bold">
          <span className="label-text">Images</span>
        </div>
        <div className="collapse collapse-arrow w-full">
          <input type="checkbox" className="peer" />
          <div className="collapse-title bg-base-100 text-primary-content peer-checked:bg-base-100 peer-checked:text-secondary-content">
            Uploaded Images ({uploadedImages.length})
          </div>
          <div className="collapse-content bg-base-100 text-primary-content peer-checked:bg-base-100 peer-checked:text-secondary-content">
            <Reorder.Group
              axis="y"
              values={uploadedImages}
              onReorder={(newImages) => {
                setUploadedImages(newImages);

                setValue("image", JSON.stringify(newImages));
              }}
              className="space-y-2"
            >
              {uploadedImages.map((url) => (
                <Reorder.Item
                  key={url}
                  value={url}
                  className="flex w-full items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Image
                      className="aspect-square max-w-16 object-scale-down"
                      src={url}
                      alt="Uploaded"
                      width={50}
                      height={50}
                      quality={25}
                    />
                  </div>
                  <span className="truncate">
                    {url.slice(0, 30).concat(" . . .")}
                  </span>
                  <div className="flex flex-row items-center gap-2">
                    <ButtonWithAction
                      replaceTWClass="btn btn-error btn-sm"
                      action={() => removeImage(url)}
                      type="button"
                      eventType="onClick"
                    >
                      <FaTrash />
                    </ButtonWithAction>
                    <div
                      className="reorder-handle"
                      onPointerDown={(e) => controls.start(e)}
                    >
                      <IoReorderFour />
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        </div>
        <div className="flex max-w-full flex-col items-center justify-center">
          <UploadDropzone
            className="w-full cursor-pointer"
            endpoint="productImage"
            config={{ mode: "auto" }}
            onClientUploadComplete={(res) => {
              const urls = res.map((file) => file.url);
              handleUploadComplete(urls);
            }}
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="flex max-w-full justify-end py-5">
        <ButtonWithAction type="submit" replaceTWClass="btn btn-primary">
          Save{" "}
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
