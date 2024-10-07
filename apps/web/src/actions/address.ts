"use server";

import { CreateAddressFormData } from "@/app/(public)/(profile)/user/address/_components/AddAddressForm";
import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { getCookies } from "./cookies";

export async function addAddress(formData: CreateAddressFormData) {
  const result = {
    ok: false,
  } as CommonResultInterface<{}>;

  const token = await getCookies("token");
  if (!token) return result;

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/users/addresses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    result.ok = data.ok;
    result.message = data.message;
    result.data = data.data;
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to delete address";
  }

  return result;
}

export async function asPrimaryAddress({ id }: { id: number }) {
  const result = {
    ok: false,
  } as CommonResultInterface<any>;

  const token = await getCookies("token");
  if (!token) return result;

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/users/addresses/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();
    result.ok = data.ok;
    result.message = data.message;
    result.data = data.data;
  } catch (error) {
    result.error =
      error instanceof Error
        ? error.message
        : "Failed to use address as primary";
  }

  return result;
}

export async function deleteAddress({ id }: { id: number }) {
  const result = {
    ok: false,
  } as CommonResultInterface<any>;

  const token = await getCookies("token");
  if (!token) return result;

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/users/addresses/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();
    result.ok = data.ok;
    result.message = data.message;
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to delete address";
  }

  return result;
}
