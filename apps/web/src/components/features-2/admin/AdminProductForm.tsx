'use client'
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ButtonWithAction from "../ui/ButtonWithAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import Select from "react-select";
import CommonResultInterface from "@/interfaces/CommonResultInterface";
import {
  ProductCategoryInterface,
  ProductCompleteInterface,
  ProductRecordInterface,
} from "@/interfaces/ProductInterface";
import { UploadDropzone } from "@/utils/uploadthing";
import { FaCheck, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { Reorder, useDragControls } from "framer-motion";
import { IoReorderFour } from "react-icons/io5";
import { createProduct } from "@/actions/products";
import { Bounce, toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Define the Zod schema for validation
const productSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  product_category_id: z.number().int().min(1, "Category ID is required"),
  description: z.string().nullable(),
  unit: z.string().min(1, "Unit is required"),
  unit_in_gram: z.number({ message: "Unit in gram is required" }),
  price: z.number().min(0, "Price must be a positive number"),
  image: z.string().optional(), // Add the image field
});

// TypeScript type for the form values
type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const categoriesData = queryClient.getQueryData<
    CommonResultInterface<ProductCategoryInterface[]>
  >([queryKeys.productCategories]);

  // Check if categoriesData is valid and contains data
  const categories = Array.isArray(categoriesData?.data)
    ? categoriesData.data
    : [];

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: "",
      name: "",
      product_category_id: 0,
      description: null,
      unit: "",
      price: undefined,
      unit_in_gram: undefined,
      image: "[]", // Initialize image as an empty string
    },
  });
  const controls = useDragControls();
  const mutation = useMutation({
    mutationFn: createProduct,
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
      setTimeout(()=>{router.refresh();},2000)
      // router.refresh();
    },
    onError : (e)=>{
     let error : any  = ''
     if (typeof JSON.parse(e.message) === 'string') {
      error = JSON.parse(JSON.parse(e.message)) as unknown as CommonResultInterface<ProductCompleteInterface>
      error = (error as unknown as CommonResultInterface<ProductCompleteInterface>).error
     } else {
      error = JSON.parse(e.message) as unknown as CommonResultInterface<ProductCompleteInterface>
      error = (error as unknown as CommonResultInterface<ProductCompleteInterface>).error
     }
     
     if (typeof error === 'object') {
       if (Array.isArray(error)) {
          // console.log(error);
          (error as Array<{message:string}>).forEach((e,i)=>{
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
              // containerId:10912,
              toastId:i
            });
          })
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
          // containerId:10912
        });
      }
    }
  });
  const onSubmit = (data: ProductFormValues) => {
    // console.log("Form Data:", data);
    mutation.mutate(data as unknown as ProductRecordInterface);
  };
  

  // Transform categories data for React Select
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.display_name || category.name,
  }));

  // Handle successful upload and set image URLs
  const handleUploadComplete = (urls: string[]) => {
    const updatedImages = [...uploadedImages, ...urls];
    setUploadedImages(updatedImages);

    setValue("image", JSON.stringify(updatedImages));
  };

  // Handle image removal
  const removeImage = (url: string) => {
    const updatedImages = uploadedImages.filter((img) => img !== url);
    setUploadedImages(updatedImages);
    setValue("image", JSON.stringify(updatedImages));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-center text-xl font-extrabold">Add Product</h1>

      {/* SKU */}
      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">SKU</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className={`input input-bordered w-full ${errors.sku ? "input-error" : ""}`}
          disabled={mutation.isSuccess}
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
          disabled={mutation.isSuccess}
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
          value={categoryOptions.find(
            (option) => option.value === watch("product_category_id"),
          )}
          isDisabled={mutation.isSuccess}
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
          disabled={mutation.isSuccess}
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
          disabled={mutation.isSuccess}
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
          disabled={mutation.isSuccess}
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
          disabled={mutation.isSuccess}
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
              aria-disabled={mutation.isSuccess}
            >
              {uploadedImages.map((url) => (
                <Reorder.Item
                  key={url}
                  value={url}
                  className="flex w-full items-center justify-between"
                  aria-disabled={mutation.isSuccess}
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
            disabled={mutation.isSuccess}
          />
        </div>
      </div>

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
