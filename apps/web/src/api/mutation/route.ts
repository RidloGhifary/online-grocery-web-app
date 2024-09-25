import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

export interface StockMutation {
  id: number;
  qty_change: number;
  type: string;
  mutation_type: string | null;
  managed_by_id: number;
  product_id: number;
  detail: string;
  from_store_id: number | null;
  destinied_store_id: number | null;
  order_detail_id: number | null;
  adjustment_related_id: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface StoreDetails {
  id: number;
  name: string;
  address: string;
  city_name: string;
}

export interface GetMutationsResponse {
  mutations: StockMutation[];
  storeDetails: StoreDetails[];
}

export interface ConfirmMutationPayload {
  mutationId: number;
}

export interface ConfirmMutationResponse {
  success: boolean;
  message: string;
}

function getToken(): string | undefined {
  return Cookies.get("token");
}

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const getPendingStockMutations = async (
  storeId?: number,
  page: number = 1,
  limit: number = 10,
): Promise<AxiosResponse<GetMutationsResponse>> => {
  const token = getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await api.get<GetMutationsResponse>(
      "/mutations/get-mutations",
      {
        params: {
          storeId,
          page,
          limit,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error: any) {
    if (error.response) {
      console.error("API call error:", error.response.data);
      throw new Error(
        `Failed to fetch stock mutations: ${error.response.data.message || error.message}`,
      );
    }
    console.error("Unknown error:", error.message);
    throw new Error(
      "An unknown error occurred while fetching stock mutations.",
    );
  }
};

export const confirmStockMutation = async (
  payload: ConfirmMutationPayload,
): Promise<AxiosResponse<ConfirmMutationResponse>> => {
  const token = getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await api.post<ConfirmMutationResponse>(
      "/mutations/confirm-mutations",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error: any) {
    if (error.response) {
      console.error("API call error:", error.response.data);
      throw new Error(
        `Failed to confirm stock mutation: ${error.response.data.message || error.message}`,
      );
    }
    console.error("Unknown error:", error.message);
    throw new Error(
      "An unknown error occurred while confirming the stock mutation.",
    );
  }
};
