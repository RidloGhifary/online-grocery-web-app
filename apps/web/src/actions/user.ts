'use server'
import { jwtVerify } from "jose";
import { cookies } from "next/headers";


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
    const token = cookies().get('token');
    if (token) {
      const token = cookies().get('token')?.value as unknown as string;
      const jwtRes = await jwtVerify(token, jwtSecret);
      if (jwtRes && jwtRes.payload) {
        result.ok = true;
      } else {
        throw new Error("Token verification failed");
      }
    }
  } catch (error) {
    let errorMessage = (error as Error).message
    result.error = errorMessage;
  }
  
  return result;
};

