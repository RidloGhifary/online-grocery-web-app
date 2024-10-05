import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  sub_total: number;
  createdAt: string;
  product: {
    name: string;
  };
}

interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OrderResponse {
  id: number;
  invoice: string;
  customer_id: number;
  order_status: {
    status: string;
  };
  customer: {
    first_name: string;
    last_name: string;
  };
  address: {
    address: string;
    city: {
      city_name: string;
    };
  };
  expedition: {
    display_name: string;
  };
  store: {
    name: string;
    address: string;
    city: {
      city_name: string;
    };
  };
  managed_by_id: number;
  store_id: number;
  expedition_id: number;
  order_status_id: number;
  address_id: number;
  order_details: OrderItem[];
  totalProductPrice: number;
  deliveryPrice: number;
}

interface OrdersByUserResponse {
  orders: OrderResponse[];
  pagination: PaginationInfo;
}

interface GenericResponse {
  message: string;
}

function getToken(): string | undefined {
  return Cookies.get("token");
}

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const uploadApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getOrdersByUser = async (
  filter: "all" | "ongoing" | "completed" | "cancelled" = "all",
  search?: string,
  sortBy: "invoice" | "createdAt" | any = "invoice",
  order: "asc" | "desc" | any = "asc",
  page: number = 1,
  limit: number = 12,
  startDate?: string | null,
  endDate?: string | null,
): Promise<AxiosResponse<OrdersByUserResponse>> => {
  const token = getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await api.get<OrdersByUserResponse>(
      `/orders/user-orders/`,
      {
        params: {
          filter,
          search,
          sortBy,
          order,
          page,
          limit,
          startDate,
          endDate,
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
        `Failed to fetch orders: ${error.response.data.message || error.message}`,
      );
    }
    console.error("Unknown error:", error.message);
    throw new Error("An unknown error occurred while fetching user orders.");
  }
};

export const getOrderById = async (
  orderId: number,
): Promise<AxiosResponse<OrderResponse>> => {
  const token = getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await api.get<OrderResponse>(`/orders/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error: any) {
    if (error.response) {
      console.error("API call error:", error.response.data);
      throw new Error(
        `Failed to fetch order: ${error.response.data.message || error.message}`,
      );
    }
    console.error("Unknown error:", error.message);
    throw new Error("An unknown error occurred while fetching the order.");
  }
};

export const cancelOrder = async (
  orderId: number,
): Promise<AxiosResponse<GenericResponse>> => {
  const token = getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await api.post<GenericResponse>(
      `/orders/cancel-order/${orderId}`,
      {},
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
        `Failed to cancel order: ${error.response.data.message || error.message}`,
      );
    }
    console.error("Unknown error:", error.message);
    throw new Error("An unknown error occurred while canceling the order.");
  }
};

export const uploadPaymentProof = async (
  orderId: number,
  paymentProofUrl: string,
  fileType: string,
  fileSize: number,
): Promise<AxiosResponse<GenericResponse>> => {
  const token = getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await uploadApi.post<GenericResponse>(
      `/orders/upload-payment/${orderId}`,
      {
        payment_proof: paymentProofUrl,
        fileType,
        fileSize,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response;
  } catch (error: any) {
    if (error.response) {
      console.error("API call error:", error.response.data);
      throw new Error(
        `Failed to upload payment proof: ${error.response.data.message || error.message}`,
      );
    }
    console.error("Unknown error:", error.message);
    throw new Error(
      "An unknown error occurred while uploading the payment proof.",
    );
  }
};

export const confirmDelivery = async (
  orderId: number,
): Promise<AxiosResponse<GenericResponse>> => {
  const token = getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await api.post<GenericResponse>(
      `/orders/confirm-delivery/${orderId}`,
      {},
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
        `Failed to confirm delivery: ${error.response.data.message || error.message}`,
      );
    }
    console.error("Unknown error:", error.message);
    throw new Error("An unknown error occurred while confirming the delivery.");
  }
};
