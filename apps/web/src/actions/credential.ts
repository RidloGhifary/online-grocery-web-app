"use server";

import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { getCookies } from "./cookies";

export async function changeEmail({
  email,
  key,
}: {
  email?: string;
  key?: string;
}) {
  const result = {
    ok: false,
  } as {
    ok: boolean;
    message?: string;
    token?: string;
    error?: string;
  };

  const token = await getCookies("token");

  try {
    let response;
    if (key) {
      response = await fetch(
        `${process.env.BACKEND_URL}/credentials/change-email?key=${key}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const responseData = await response.json();
      result.ok = true;
      result.token = responseData?.token;
      result.message = responseData?.message;
      result.token = responseData?.token;
    } else {
      if (!token) return result;
      response = await fetch(
        `${process.env.BACKEND_URL}/credentials/change-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        },
      );
      const responseData = await response.json();
      result.ok = true;
      result.message = responseData?.message;
    }
  } catch (error) {
    console.log("🚀 ~ error:", error);
    result.error = (error as Error).message;
  }

  return result;
}

export async function changePassword({
  password,
  email,
  endpoint,
}: {
  key?: string | undefined;
  password?: string;
  email?: string;
  endpoint?: string;
}) {
  const result = {
    ok: false,
  } as CommonResultInterface<any>;

  const body = { password, email };

  try {
    const response = await fetch(`${process.env.BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();
    result.ok = true;
    result.message = responseData.message;
  } catch (error) {
    result.error = (error as Error).message;
  }

  return result;
}

export async function sendEmailChangePassword({ email }: { email: string }) {
  const result = {
    ok: false,
  } as CommonResultInterface<any>;

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/credentials/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );

    const responseData = await response.json();
    result.ok = true;
    result.message = responseData.message;
  } catch (error) {
    result.error = (error as Error).message;
  }

  return result;
}
