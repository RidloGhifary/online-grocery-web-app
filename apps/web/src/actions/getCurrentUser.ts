import axios from "axios";
import { getCookies } from "@/actions/cookies";
import { UserProps } from "@/interfaces/user";

const API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api";

export async function getCurrentUser() {
  const token = await getCookies("token");

  if (!token) {
    return null;
  }

  try {
    const response = await axios.get(`${API_URL}/users/current-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.user as UserProps;
  } catch (error) {
    throw new Error("Failed to fetch current user");
  }
}
