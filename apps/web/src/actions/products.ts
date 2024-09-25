"use server";

import CommonPaginatedResultInterface from "@/interfaces/CommonPaginatedResultInterface";
import CommonResultInterface from "@/interfaces/CommonResultInterface";
import {
  ProductCompleteInterface,
  ProductRecordInterface,
  UpdateProductInputInterface,
} from "@/interfaces/ProductInterface";
import createQueryParams from "@/utils/createQueryParams";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { getCookies } from "./cookies";

export async function getProductListWithFilter({
  category,
  search,
  order,
  orderField,
  page = 1,
  limit = 20,
  latitude,
  longitude,
}: {
  category?: string;
  search?: string;
  order?: "asc" | "desc" | string;
  orderField?: "product_name" | "category" | string;
  page?: number;
  limit?: number;
  latitude?: number | null | string;
  longitude?: number | null | string;
}): Promise<CommonPaginatedResultInterface<ProductCompleteInterface[]>> {
  let result = {
    ok: false,
  } as unknown as CommonPaginatedResultInterface<ProductCompleteInterface[]>;
  const token = await getCookies("token");
  const header:HeadersInit = {
    "Content-type": "application/json",
    Authorization: `Bearer ${token}`,
  } 
  try {
    const response = await fetch(
      createQueryParams({
        url: `${process.env.BACKEND_URL}/products`,
        params: {
          category,
          search,
          order,
          order_field: orderField,
          page,
          limit,
          latitude, 
          longitude
        },
      }), {headers:header}
    );
    
    if (!response.ok) {
      result.error = `Failed to fetch product list: ${response.statusText}`;
      return result;
    }

    const data =
      (await response.json()) as unknown as CommonPaginatedResultInterface<
        ProductCompleteInterface[]
      >;
    result = data;
    // result.data.data = data.data.data;
    // result.ok = true;
    // result.message = "Got the product";
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to fetch product list";
    console.log(error);
  }

  return result;
}

export async function getSingleProduct({
  slug,
  latitude,
  longitude,
}: {
  slug: string | Params;
  latitude?: number | null | string;
  longitude?: number | null | string;
}): Promise<CommonResultInterface<ProductCompleteInterface>> {
  const result = {
    ok: false,
  } as CommonResultInterface<ProductCompleteInterface>;

  if (!slug) {
    result.error = "Slug is empty";
    return result;
  }
  
  try {
    const url = `${process.env.BACKEND_URL}/products/${slug}`;
    const token = await getCookies("token");
    const header:HeadersInit = {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    } 
    console.log(createQueryParams({
      url: url,
      params: { latitude, longitude },
    }));
    
    const response = await fetch(
      createQueryParams({
        url: url,
        params: { latitude, longitude },
      }),{
        headers : header
      }
    );

    if (!response.ok) {
      result.error = ` ${response.status}`;
      throw new Error(result.error);

      // return result;
    }
    const data = await response.json();
    result.data = data.data as ProductCompleteInterface;
    result.ok = true;
    result.message = "Got the product";
    // console.log('result',result);
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to fetch product";
  }

  return result;
}

export async function createProduct(
  product: ProductRecordInterface,
): Promise<CommonResultInterface<ProductCompleteInterface>> {
  const result = {
    ok: false,
  } as CommonResultInterface<ProductCompleteInterface>;
  try {
    const token = await getCookies("token");
    if (!token) throw new Error("403");
    const prep = await fetch(`${process.env.BACKEND_URL}/products`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    const response =
      (await prep.json()) as CommonResultInterface<ProductCompleteInterface>;
    console.log(response);

    if (!response.ok) {
      result.error = ` ${response.error}`;
      throw new Error(JSON.stringify(response));
    }
    result.data = response.data as ProductCompleteInterface;
    result.ok = true;
    result.message = "Data created";
  } catch (error) {
    throw new Error(JSON.stringify((error as Error).message));
  }
  return result;
}

export async function updateProduct(
  product: UpdateProductInputInterface,
): Promise<CommonResultInterface<ProductCompleteInterface>> {
  const result = {
    ok: false,
  } as CommonResultInterface<ProductCompleteInterface>;
  try {
    const token = await getCookies("token");
    if (!token) throw new Error("403");
    const prep = await fetch(`${process.env.BACKEND_URL}/products/update`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    const response =
      (await prep.json()) as CommonResultInterface<ProductCompleteInterface>;
    console.log(response);

    if (!response.ok) {
      result.error = ` ${response.error}`;
      throw new Error(JSON.stringify(response));
    }
    result.data = response.data as ProductCompleteInterface;
    result.ok = true;
    result.message = "Data updated";
  } catch (error) {
    throw new Error(JSON.stringify((error as Error).message));
  }
  return result;
}

export async function deleteProduct(
  id: number,
): Promise<CommonResultInterface<boolean>> {
  let result: CommonResultInterface<boolean> = {
    ok: false,
  };
  console.log(`${process.env.BACKEND_URL}/products/delete/${id}`);

  try {
    const token = await getCookies("token");
    if (!token) throw new Error("403");
    console.log(`${process.env.BACKEND_URL}/products/delete/${id}`);

    const prep = await fetch(
      `${process.env.BACKEND_URL}/products/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const res = (await prep.json()) as CommonResultInterface<boolean>;
    if (!res.ok) {
      result = res;
      throw new Error(JSON.stringify(result));
    }
    result = res;
    res.ok = true;
  } catch (error) {
    throw new Error((error as Error).message);
  }
  return result;
}
