"use server";

import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { getCookies } from "./cookies";
import { UserInputInterface, UserInterface, UserProps, UserUpdateInputInterface } from "@/interfaces/user";
import CommonPaginatedResultInterface from "@/interfaces/CommonPaginatedResultInterface";
import createQueryParams from "@/utils/createQueryParams";

export async function getAvailableAdmin(): Promise<
  CommonResultInterface<UserProps[]>
> {
  const result = {
    ok: false,
  } as CommonResultInterface<UserProps[]>;

  try {
    const token = await getCookies("token");
    if (!token) return result;

    const response = await fetch(
      `${process.env.BACKEND_URL}/admins/available`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      result.error = `Failed to get available admin: ${response.statusText}`;
      return result;
    }

    const data = await response.json();
    result.data = data.data as UserProps[];
    result.ok = true;
    result.message = data.message || "Got the available admin";
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to unassign admin";
    console.log(error);
  }

  return result;
}

export async function assignAdmin({
  admin_id,
  store_id,
}: {
  admin_id: number;
  store_id: number;
}): Promise<CommonResultInterface<any>> {
  const result = {
    ok: false,
  } as CommonResultInterface<any>;

  try {
    const token = await getCookies("token");
    if (!token) return result;

    const response = await fetch(
      `${process.env.BACKEND_URL}/admins/assigns/${admin_id}/stores/${store_id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      result.error = `Failed to assign admin: ${response.statusText}`;
      return result;
    }

    const data = await response.json();
    // result.data = data.data;
    result.ok = true;
    result.message = data?.message || "Assigned admin";
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to assign admin";
    console.log(error);
  }

  return result;
}

export async function unAssignAdmin({
  admin_id,
  store_id,
}: {
  admin_id: number;
  store_id: number;
}): Promise<CommonResultInterface<any>> {
  const result = {
    ok: false,
  } as CommonResultInterface<any>;

  try {
    const token = await getCookies("token");
    if (!token) return result;

    const response = await fetch(
      `${process.env.BACKEND_URL}/admins/unassigned/${admin_id}/stores/${store_id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      result.error = `Failed to unassign admin: ${response.statusText}`;
      return result;
    }

    const data = await response.json();
    // result.data = data.data;
    result.ok = true;
    result.message = data?.message || "Unassigned admin";
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to unassign admin";
    console.log(error);
  }

  return result;
}


export async function getAllCustomerList({
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
}): Promise<CommonPaginatedResultInterface<UserInterface[]>> {
  let result = {
    ok: false,
  } as CommonPaginatedResultInterface<UserInterface[]>;
  try {
    const token = await getCookies("token");
    if (!token) throw new Error("403");
    const response = await fetch(
      createQueryParams({
        url: `${process.env.BACKEND_URL}/admins/manage-customer`,
        params: { search, order, order_field: orderField, page, limit },
      }),
      {
        headers: {
          'Content-type': 'application/json',
          'Authorization':`Bearer ${token}`
      },
      }
    );
    if (!response.ok) {
      result.error = `Failed to fetch customer list: ${response.statusText}`;
      return result;
    }
    const data =
      (await response.json()) as unknown as CommonPaginatedResultInterface<
        UserInterface[]
      >;
    result = data;
  } catch (error) {
    result.ok = false;
    result.error =
      error instanceof Error
        ? error.message
        : "Failed to fetch customer list";
  }
  return result;
}

export async function getAllAdminList({
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
}): Promise<CommonPaginatedResultInterface<UserInterface[]>> {
  let result = {
    ok: false,
  } as CommonPaginatedResultInterface<UserInterface[]>;
  try {
    const token = await getCookies("token");
    if (!token) throw new Error("403");
    const response = await fetch(
      createQueryParams({
        url: `${process.env.BACKEND_URL}/admins/manage-admin`,
        params: { search, order, order_field: orderField, page, limit },
      }),
      {
        headers: {
          'Content-type': 'application/json',
          'Authorization':`Bearer ${token}`
      },
      }
    );
    if (!response.ok) {
      console.log(await response.json());
      
      result.error = `Failed to fetch admin list: ${response.statusText}`;
      return result;
    }
    const data =
      (await response.json()) as unknown as CommonPaginatedResultInterface<
        UserInterface[]
      >;
    result = data;
  } catch (error) {
    result.ok = false;
    result.error =
      error instanceof Error
        ? error.message
        : "Failed to fetch admin list";
  }
  return result;
}


export async function createAdmin(admin:UserInputInterface) : Promise<CommonResultInterface<UserInterface>> {
  const result = {
    ok: false,
  } as CommonResultInterface<UserInterface>;
  try {
    const token = await getCookies("token");
    if (!token) throw new Error("403");
    const prep = await fetch( `${process.env.BACKEND_URL}/admins/manage-admin`,
      {
        method : "POST",
        headers: {
          'Content-type': 'application/json',
          'Authorization':`Bearer ${token}`
      },
        body: JSON.stringify(admin),
      }
    );
    const response = await prep.json() as CommonResultInterface<UserInterface>
    console.log(response);
    
    if (!response.ok) {
      result.error = ` ${response.error}`;
      throw new Error(JSON.stringify(response));
    }
    result.data = response.data as UserInterface
    result.ok = true
    result.message = 'Data created'
  } catch (error) {
    throw new Error(JSON.stringify((error as Error).message))
  }
  return result
}


export async function updateAdmin(admin:UserUpdateInputInterface) : Promise<CommonResultInterface<UserInterface>> {
  const result = {
    ok: false,
  } as CommonResultInterface<UserInterface>;
  try {
    const token = await getCookies("token");
    if (!token) throw new Error("403");
    const prep = await fetch( `${process.env.BACKEND_URL}/admins/manage-admin/update`,
      {
        method : "PATCH",
        headers: {
          'Content-type': 'application/json',
          'Authorization':`Bearer ${token}`
      },
        body: JSON.stringify(admin),
      }
    );
    const response = await prep.json() as CommonResultInterface<UserInterface>
    console.log(response);
    
    if (!response.ok) {
      result.error = ` ${response.error}`;
      throw new Error(JSON.stringify(response));
    }
    result.data = response.data as UserInterface
    result.ok = true
    result.message = 'Data updated'
  } catch (error) {
    throw new Error(JSON.stringify((error as Error).message))
  }
  return result
}