"use server";
import CommonPaginatedResultInterface from "@/interfaces/CommonPaginatedResultInterface";
import { getCookies } from "./cookies";
import { CategoryCompleteInterface, CategoryInterface } from "@/interfaces/CategoryInterface";
import CommonResultInterface from "@/interfaces/CommonResultInterface";
import createQueryParams from "@/utils/createQueryParams";

export async function getProductCategoryList({
  order,
  search,
  orderField,
  page = 1,
  limit = 20,
}: {
  search?: string;
  order?: "asc" | "desc" | string;
  orderField?: "name" | "display_name" | string;
  page?: number;
  limit?: number;
}): Promise<CommonPaginatedResultInterface<CategoryCompleteInterface[]>> {
  let result = {
    ok: false,
  } as CommonPaginatedResultInterface<CategoryCompleteInterface[]>;
  try {
    const response = await fetch(
      createQueryParams({
        url: `${process.env.BACKEND_URL}/categories`,
        params: { search, order, order_field: orderField, page, limit },
      }),
    );
    if (!response.ok) {
      result.error = `Failed to fetch product category list: ${response.statusText}`;
      return result;
    }
    const data =
      (await response.json()) as unknown as CommonPaginatedResultInterface<
        CategoryCompleteInterface[]
      >;
    console.log(`${process.env.BACKEND_URL}/categories`);
    // console.log(response);
    // console.log(data.data.pagination);
    result = data;
  } catch (error) {
    result.ok = false;
    result.error =
      error instanceof Error
        ? error.message
        : "Failed to fetch product category list";
  }
  return result;
}

export async function createCategory(
  category: CategoryInterface,
): Promise<CommonResultInterface<CategoryInterface>> {
  const result = {
    ok: false,
  } as CommonResultInterface<CategoryInterface>;
  try {
    const token = await getCookies("token");
    if (!token) throw new Error("403");
    const prep = await fetch(`${process.env.BACKEND_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    const response =
      (await prep.json()) as CommonResultInterface<CategoryInterface>;
    console.log(response);

    if (!response.ok) {
      result.error = ` ${response.error}`;
      throw new Error(JSON.stringify(response));
    }
    result.data = response.data as CategoryInterface;
    result.ok = true;
    result.message = "Data created";
  } catch (error) {
    throw new Error(JSON.stringify((error as Error).message));
  }
  return result;
}

export async function updateCategory(
  category: CategoryInterface,
): Promise<CommonResultInterface<CategoryInterface>> {
  const result = {
    ok: false,
  } as CommonResultInterface<CategoryInterface>;
  try {
    const token = await getCookies("token");
    if (!token) throw new Error("403");
    const prep = await fetch(`${process.env.BACKEND_URL}/categories/update`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    const response =
      (await prep.json()) as CommonResultInterface<CategoryInterface>;
    console.log(response);

    if (!response.ok) {
      result.error = ` ${response.error}`;
      throw new Error(JSON.stringify(response));
    }
    result.data = response.data as CategoryInterface;
    result.ok = true;
    result.message = "Data updated";
  } catch (error) {
    throw new Error(JSON.stringify((error as Error).message));
  }
  return result;
}

export async function deleteCategory(
  id: number,
): Promise<CommonResultInterface<boolean>> {
  let result: CommonResultInterface<boolean> = {
    ok: false,
  };
  console.log(`${process.env.BACKEND_URL}/categories/delete/${id}`);

  try {
    const token = await getCookies("token");
    if (!token) throw new Error("403");
    console.log(`${process.env.BACKEND_URL}/categories/delete/${id}`);

    const prep = await fetch(
      `${process.env.BACKEND_URL}/categories/delete/${id}`,
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
