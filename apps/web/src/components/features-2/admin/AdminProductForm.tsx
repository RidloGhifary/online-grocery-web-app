import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ButtonWithAction from "../ui/ButtonWithAction";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import Select from "react-select";
import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { ProductCategoryInterface } from "@/interfaces/ProductInterface";

// Define the Zod schema for validation
const productSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  product_category_id: z.number().int().min(1, "Category ID is required"),
  description: z.string().nullable(),
  current_stock: z.number().nullable().optional(),
  unit: z.string().min(1, "Unit is required"),
  price: z.number().min(0, "Price must be a positive number"),
  image: z.string().nullable(),
  store_id: z.number().nullable(),
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
      price: 0,
      image: null,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <label className="form-control w-full">
        <div className="label">
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
        <div className="label">
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
        <div className="label">
          <span className="label-text">Product Category</span>
        </div>
        <Select
          instanceId={"adminProductFormInModal"}
          options={categoryOptions}
          onChange={(option) =>
            setValue("product_category_id", option?.value || 0)
          }
          placeholder="Select a category"
          // isClearable
          value={categoryOptions.find(
            (option) => option.value === watch("product_category_id"),
          )}
        />
        {errors.product_category_id && (
          <p className="text-red-500">{errors.product_category_id.message}</p>
        )}
      </label>

      <label className="form-control w-full">
        <div className="label">
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
        <div className="label">
          <span className="label-text">Price</span>
        </div>
        <input
          type="number"
          placeholder="Type here"
          className={`input input-bordered w-full ${errors.price ? "input-error" : ""}`}
          {...register("price", { valueAsNumber: true })}
        />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </label>

      <label className="form-control w-full">
        <div className="label">
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

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Image URL</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className={`input input-bordered w-full ${errors.image ? "input-error" : ""}`}
          {...register("image")}
        />
        {errors.image && <p className="text-red-500">{errors.image.message}</p>}
      </label>

      <div className="flex max-w-full justify-end py-5">
        <ButtonWithAction type="submit" replaceTWClass="btn btn-primary">
          Add
        </ButtonWithAction>
      </div>
    </form>
  );
}
