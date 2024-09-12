"use server";
import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { ProductCategoryInterface } from "@/interfaces/ProductInterface";

export async function getProductCategoryList(): Promise<
  CommonResultInterface<ProductCategoryInterface[]>
> {
  const result = {
    ok: false,
  } as CommonResultInterface<ProductCategoryInterface[]>;
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/categories`);
    const data = await response.json();
    result.ok = true;
    result.data = data.data;
  } catch (error) {
    result.ok = false;
    result.error =
      error instanceof Error
        ? error.message
        : "Failed to fetch product category list";
  }
  return result;
}
