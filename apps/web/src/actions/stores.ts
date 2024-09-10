"use server";

import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { getCookies } from "./cookies";
import { DetailStoreProps, StoreProps } from "@/interfaces/store";

export async function getStores(): Promise<
  CommonResultInterface<StoreProps[]>
> {
  const result = {
    ok: false,
  } as CommonResultInterface<StoreProps[]>;

  try {
    const token = await getCookies("token");
    if (!token) return result;

    const response = await fetch(`${process.env.BACKEND_URL}/stores`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      result.error = `Failed to stores: ${response.statusText}`;
      return result;
    }

    const data = await response.json();
    result.data = data.data as StoreProps[];
    result.ok = true;
    result.message = "Got the Stores";
    return result;
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to stores";
    console.log(error);
  }

  return result;
}

export async function getDetailStores({
  storeId,
}: {
  storeId: number;
}): Promise<CommonResultInterface<DetailStoreProps>> {
  const result = {
    ok: false,
  } as CommonResultInterface<DetailStoreProps>;

  try {
    const token = await getCookies("token");
    if (!token) return result;

    const response = await fetch(
      `${process.env.BACKEND_URL}/stores/${storeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      result.error = `Failed to store detail: ${response.statusText}`;
      return result;
    }

    const data = await response.json();
    result.data = data.data as DetailStoreProps;
    result.ok = true;
    result.message = "Got the Detail Store";
    return result;
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to store detail";
    console.log(error);
  }

  return result;
}

type FormData = {
  name: string;
  store_type: "central" | "branch";
  province: string;
  province_id: number;
  city: string;
  city_id: number;
  address: string;
  kelurahan: string;
  kecamatan: string;
};

export async function createStore({
  formData,
}: {
  formData: FormData;
}): Promise<CommonResultInterface<StoreProps[]>> {
  const result = {
    ok: false,
  } as CommonResultInterface<StoreProps[]>;

  try {
    const token = await getCookies("token");
    if (!token) return result;

    const response = await fetch(`${process.env.BACKEND_URL}/stores`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      result.error = `Failed to create store: ${response.statusText}`;
      return result;
    }

    const data = await response.json();
    result.data = data.data;
    result.ok = true;
    result.message = "Store created successfully";
    return result;
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to create store";
    console.log(error);
  }

  return result;
}

export async function editStore({
  storeId,
  formData,
}: {
  storeId: number;
  formData: FormData;
}): Promise<CommonResultInterface<StoreProps[]>> {
  const result = {
    ok: false,
  } as CommonResultInterface<StoreProps[]>;

  try {
    const token = await getCookies("token");
    if (!token) return result;

    const response = await fetch(
      `${process.env.BACKEND_URL}/stores/${storeId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    );

    if (!response.ok) {
      result.error = `Failed to update store: ${response.statusText}`;
      return result;
    }

    const data = await response.json();
    result.data = data.data;
    result.ok = true;
    result.message = "Store updated successfully";
    return result;
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to update store";
    console.log(error);
  }

  return result;
}

export async function deleteStore({
  storeId,
}: {
  storeId: number;
}): Promise<CommonResultInterface<any>> {
  const result = {
    ok: false,
  } as CommonResultInterface<any>;

  try {
    const token = await getCookies("token");
    if (!token) return result;

    const response = await fetch(
      `${process.env.BACKEND_URL}/stores/${storeId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      result.error = `Failed to delete store: ${response.statusText}`;
      return result;
    }

    const data = await response.json();
    result.ok = true;
    result.message = data.message|| "Store deleted successfully";
    return result;
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to delete store";
    console.log(error);
  }

  return result;
}
