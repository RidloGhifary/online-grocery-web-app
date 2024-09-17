"use server";

import { cookies } from "next/headers";

export const setCookies = (cookieName: string, value: string) => {
  cookies().set(cookieName, value);
};

export async function getCookies(cookieName: string) {
  const token = cookies().get(cookieName)?.value;

  if (!token) {
    return null;
  }

  return token;
}

export async function deleteCookie(cookieName: string) {
  cookies().delete(cookieName);
}
