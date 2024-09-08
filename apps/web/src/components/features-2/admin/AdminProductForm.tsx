import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ButtonWithAction from "../ui/ButtonWithAction";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import Select from "react-select";
import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { ProductCategoryInterface } from "@/interfaces/ProductInterface";
import { UploadDropzone } from "@/utils/uploadthing";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";

// Define the Zod schema for validation
const productSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  product_category_id: z.number().int().min(1, "Category ID is required"),
  description: z.string().nullable(),
  current_stock: z.number().nullable().optional(),
  unit: z.string().min(1, "Unit is required"),
  unit_in_gram: z.number({ message: "Unit in gram is required" }),
  price: z.number().min(0, "Price must be a positive number"),
  store_id: z.number().nullable(),
  images: z.array(z.string()).optional(), // Add the images field
});

// TypeScript type for the form values
type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductForm() {
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
      current_stock: null,
      unit: "",
      price: undefined,
      unit_in_gram: undefined,
      images: [], // Initialize images as an empty array
      store_id: null,
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    console.log("Form Data:", data);
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
    setValue("images", updatedImages);
  };

  // Handle image removal
  const removeImage = (url: string) => {
    const updatedImages = uploadedImages.filter((img) => img !== url);
    setUploadedImages(updatedImages);
    setValue("images", updatedImages);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-center text-xl font-extrabold">Add Product</h1>
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
        />
        {errors.product_category_id && (
          <p className="text-red-500">{errors.product_category_id.message}</p>
        )}
      </label>

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

      <label className="form-control w-full">
        <div className="label font-bold">
          <span className="label-text">Unit in gram</span>
        </div>
        <input
          type="number"
          min={0}
          placeholder="Type here"
          className={`input input-bordered w-full ${errors.unit_in_gram ? "input-error" : ""}`}
          {...register("unit_in_gram")}
        />
        {errors.unit_in_gram && (
          <p className="text-red-500">{errors.unit_in_gram.message}</p>
        )}
      </label>

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
            <table className="table border-none">
              <tbody>
                {uploadedImages.map((url) => (
                  <tr key={url}>
                    {/* <td>{url}</td> */}
                    <td><Image className="aspect-square object-scale-down max-w-16" src={url} alt="https://placehold.co/600x400.svg" width={50} height={50} quality={25}/></td>
                    <td className="flex items-end justify-end">
                      <ButtonWithAction
                        replaceTWClass="btn btn-error btn-sm"
                        action={() => removeImage(url)}
                        type="button"
                        eventType="onClick"
                      >
                        <FaTrash />
                      </ButtonWithAction>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      <div className="flex max-w-full justify-end py-5">
        <ButtonWithAction type="submit" replaceTWClass="btn btn-primary">
          Add Product
        </ButtonWithAction>
      </div>
    </form>
  );
}
