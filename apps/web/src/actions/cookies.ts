"use server";

import { cookies } from "next/headers";

export const setCookies = (cookieName: string, value: string) => {
  cookies().set(cookieName, value, {
    sameSite: "strict",
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
  });
};
