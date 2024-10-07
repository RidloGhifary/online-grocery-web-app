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
import { StockAdjustment, Store } from "@/interfaces/StockInterface";

export async function getJournals({
  page = 1,
  limit = 20,
  store_id,
}: {
  page?: number;
  limit?: number;
  store_id?: number;
}): Promise<CommonPaginatedResultInterface<StockAdjustment[]>> {
  let result = {
    ok: false,
  } as CommonPaginatedResultInterface<StockAdjustment[]>;

  try {
    const token = await getCookies("token");
    const header: HeadersInit = {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const response = await fetch(
      createQueryParams({
        url: `${process.env.BACKEND_URL}/stocks/journals`,
        params: {
          page,
          limit,
          store_id,
        },
      }),
      { headers: header },
    );

    if (!response.ok) {
      result.error = ` ${response.status}`;
      throw new Error(result.error);

      // return result;
    }
    const data = (await response.json()) as CommonPaginatedResultInterface<
      StockAdjustment[]
    >;
    result = data;
    // console.log('result',result);
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to fetch product";
  }

  return result;
}

export async function getStoreForStock(): Promise<
  CommonResultInterface<Store[]>
> {
  let result: CommonResultInterface<Store[]> = {
    ok: false,
  };

  try {
    const token = await getCookies("token");
    const header: HeadersInit = {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const response = await fetch(
      `${process.env.BACKEND_URL}/stocks/store-list`,
      { headers: header },
    );
    const data = (await response.json()) as CommonResultInterface<Store[]>;
    if (!response.ok) {
      result.error = ` ${response.status}`;
      throw new Error(result.error);
    }
    if (!data.ok) {
      result.error = ` ${data.error}`;
      throw new Error(result.error);
    }
    result = data;
  } catch (error) {
    throw new Error(JSON.stringify((error as Error).message));
  }
  return result;
}

export async function getProductStock({
  search,
  order,
  orderField,
  page = 1,
  limit = 20,
}: {
  search?: string;
  order?: "asc" | "desc" | string;
  orderField?: string;
  page?: number;
  limit?: number;
}): Promise<CommonPaginatedResultInterface<ProductCompleteInterface[]>> {
  let result = {
    ok: false,
  } as unknown as CommonPaginatedResultInterface<ProductCompleteInterface[]>;

  try {
    const response = await fetch(
      createQueryParams({
        url: `${process.env.BACKEND_URL}/products`,
        params: { search, order, order_field: orderField, page, limit },
      }),
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
    // console.log(error);
  }

  return result;
}
