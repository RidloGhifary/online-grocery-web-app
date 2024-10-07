"use server";
import CommonPaginatedResultInterface from "@/interfaces/CommonPaginatedResultInterface";
import createQueryParams from "@/utils/createQueryParams";
import { getCookies } from "./cookies";
import { RoleInterface } from "@/interfaces/RoleInterface";

export async function getAllRoleList({
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
}): Promise<CommonPaginatedResultInterface<RoleInterface[]>> {
  let result = {
    ok: false,
  } as CommonPaginatedResultInterface<RoleInterface[]>;
  try {
    const token = await getCookies("token");
    if (!token) throw new Error("403");
    const response = await fetch(
      createQueryParams({
        url: `${process.env.BACKEND_URL}/roles`,
        params: { search, order, order_field: orderField, page, limit },
      }),
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      // console.log(await response.json());

      result.error = `Failed to fetch some of role list: ${response.statusText}`;
      return result;
    }
    const data =
      (await response.json()) as unknown as CommonPaginatedResultInterface<
        RoleInterface[]
      >;
    result = data;
  } catch (error) {
    result.ok = false;
    result.error =
      error instanceof Error
        ? error.message
        : "Failed to fetch some of role list";
  }
  return result;
}
