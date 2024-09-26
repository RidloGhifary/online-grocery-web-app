"use server";

import { LoginFormData } from "@/app/(auth)/login/_components/FormLogin";
import { RegisterFormData } from "@/app/(auth)/register/page";
import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { UserProps } from "@/interfaces/user";

export async function registerAuth(formData: RegisterFormData) {
  const result = { ok: false } as CommonResultInterface<any>;

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const responseData = await response.json();
    result.ok = responseData.ok;
    result.message = responseData.message;
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to register";
  }

  return result;
}

export async function loginAuth(formData: LoginFormData) {
  const result = { ok: false } as {
    ok: boolean;
    message?: string;
    token?: string;
    error?: string;
    data?: UserProps | undefined;
  };

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const responseData = await response.json();
    result.ok = responseData.ok;
    result.message = responseData.message || "Logged in successfully";
    result.token = responseData.token;
    result.data = responseData.data;
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Failed to login";
  }

  return result;
}

export async function verifyAccount({
  key,
  password,
}: {
  key: string;
  password: string;
}) {
  const result = { ok: false } as CommonResultInterface<{}>;

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/auth/verify-account`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key,
          password,
        }),
      },
    );

    const responseData = await response.json();
    result.ok = responseData.ok;
    result.message = responseData.message;
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Failed to verify";
  }

  return result;
}
