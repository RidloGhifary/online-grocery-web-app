"use server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getCookies } from "./cookies";
import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { UserInterface } from "@/interfaces/user";

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);

export const verifyToken = async (): Promise<{
  ok: boolean;
  error?: string | Array<any>;
}> => {
  let result: {
    ok: boolean;
    error?: string | Array<any>;
  } = {
    ok: false,
  };
  try {
    const token = cookies().get("token");
    if (token) {
      const token = cookies().get("token")?.value as unknown as string;
      const jwtRes = await jwtVerify(token, jwtSecret);
      if (jwtRes && jwtRes.payload) {
        result.ok = true;
      } else {
        throw new Error("Token verification failed");
      }
    }
  } catch (error) {
    let errorMessage = (error as Error).message;
    result.error = errorMessage;
  }

  return result;
};

export async function getAdmin(): Promise<
  CommonResultInterface<UserInterface>
> {
  const token = await getCookies("token");
  // console.log(token);
  
  let result: CommonResultInterface<UserInterface> = {
    ok: false,
  };
  try {
    if (!token) throw new Error("404");

    const response = await fetch(`${process.env.BACKEND_URL}/users/admin/info`, {
      headers: {
        'Authorization':`Bearer ${token}`
      },
    });
    
    if (!response.ok) throw new Error("500");
    const data = await response.json()
    
    // console.log(response);
    result.data = data.data as UserInterface 
    result.ok = true

  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case '400':
        result.error = '404'
        result.message = 'Token not found or not provided'
        break;
      case '500' :
        result.error = '500'
        console.log(error);
        result.message = 'Something wrong'
        break;
      default:
        result.error = '500'
        result.message = 'Unknown'
        break;
    }
  }

  return result;
}
