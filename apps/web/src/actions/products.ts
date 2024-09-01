"use server";

import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { ProductCompleteInterface } from "@/interfaces/ProductInterface";
import createQueryParams from "@/utils/createQueryParams";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export async function getProductListWithFilter({
  category,
  search,
  order = "asc",
  orderField = "product_name",
}: {
  category?: string;
  search?: string;
  order?: "asc" | "desc";
  orderField?: "product_name" | "category";
}): Promise<CommonResultInterface<ProductCompleteInterface[]>> {
  const result = {
    ok: false,
  } as CommonResultInterface<ProductCompleteInterface[]>;

  try {
    const response = await fetch(
      createQueryParams({
        url: `${process.env.BACKEND_URL}/products`,
        params: { category, search, order, orderField },
      })
    );

    if (!response.ok) {
      result.error = `Failed to fetch product list: ${response.statusText}`;
      return result;
    }

    const data = await response.json();
    result.data = data.data as ProductCompleteInterface[];
    result.ok = true;
    result.message = "Got the product";
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Failed to fetch product list";
  }

  return result;
}

export async function getSingleProduct({
  slug,
}: {
  slug: string | Params;
}): Promise<CommonResultInterface<ProductCompleteInterface>> {
  const result = {
    ok: false,
  } as CommonResultInterface<ProductCompleteInterface>;

  if (!slug) {
    result.error = "Slug is empty";
    return result;
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/products/${slug}`);

    if (!response.ok) {
      result.error = `Failed to fetch product: ${response.statusText}`;
      return result;
    }

    const data = await response.json();
    result.data = data.data as ProductCompleteInterface;
    result.ok = true;
    result.message = "Got the product";
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Failed to fetch product";
  }

  return result;
}
