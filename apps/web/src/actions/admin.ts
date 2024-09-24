"use server";

import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { getCookies } from "./cookies";
import { UserProps } from "@/interfaces/user";

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
    result.ok = data.ok || true;
    result.message = data.message || "Got the available admin";
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to get available admin";
  }

  return result;
}

export async function assignAdmin({
  admin_id,
  store_id,
}: {
  admin_id: number;
  store_id: number;
}): Promise<CommonResultInterface<{}>> {
  const result = {
    ok: false,
  } as CommonResultInterface<{}>;

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
    result.ok = data?.ok || true;
    result.message = data?.message || "Assigned admin";
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to assign admin";
  }

  return result;
}

export async function unAssignAdmin({
  admin_id,
  store_id,
}: {
  admin_id: number;
  store_id: number;
}): Promise<CommonResultInterface<{}>> {
  const result = {
    ok: false,
  } as CommonResultInterface<{}>;

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
    result.ok = data?.ok || true;
    result.message = data?.message || "Unassigned admin";
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to unassign admin";
  }

  return result;
}
