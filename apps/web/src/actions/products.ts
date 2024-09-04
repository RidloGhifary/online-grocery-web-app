"use server";

import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { ProductCompleteInterface, ProductRecordInterface } from "@/interfaces/ProductInterface";
import createQueryParams from "@/utils/createQueryParams";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export async function getProductListWithFilter({
  category,
  search,
  order ,
  orderField ,
}: {
  category?: string;
  search?: string;
  order?: "asc" | "desc"|string;
  orderField?: "product_name" | "category"|string;
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
    console.log(error);

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
  console.log(slug,' : sluggg');
  

  if (!slug) {
    result.error = "Slug is empty";
    return result;
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/products/${slug}`);

    
    if (!response.ok) {
      result.error = ` ${response.status}`;
      throw new Error(result.error);
      
      // return result;
    }
    const data = await response.json();
    result.data = data.data as ProductCompleteInterface;
    result.ok = true;
    result.message = "Got the product";
    console.log('result',result);
    
  } catch (error) {
    
    result.error = error instanceof Error ? error.message : "Failed to fetch product";
  }
  
  return result;
}

export async function createProduct(product:ProductRecordInterface) : Promise<CommonResultInterface<ProductCompleteInterface>> {
  const result = {
    ok: false,
  } as CommonResultInterface<ProductCompleteInterface>;
  try {
    const prep = await fetch( `${process.env.BACKEND_URL}/products`,
      {
        method : "POST",
        headers: {
          'Content-type': 'application/json',
      },
        body: JSON.stringify(product),
      }
    );
    const response = await prep.json()
    if (!response.ok) {
      result.error = ` ${response.status}`;
      throw new Error(result.error);
    }
    result.data = response.data as ProductCompleteInterface
    response.ok = true
    result.message = 'Data created'
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Failed to fetch product";
  }
  return result
}