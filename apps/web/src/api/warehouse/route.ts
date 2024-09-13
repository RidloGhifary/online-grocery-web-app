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
    image?: string;
  };
}

export interface OrderResponse {
  id: number;
  invoice: string;
  customer_id: number;
  managed_by_id: number;
  store_id: number;
  expedition_id: number;
  order_status_id: number;
  address_id: number;
  order_details: OrderItem[];
  totalProductPrice: number;
  deliveryPrice: number;
  order_status: string;
  createdAt: string;
  customer: {
    username: string;
    first_name: string;
    last_name: string;
  };
  store: {
    name: string;
    address: string;
    kecamatan: string;
    city: {
      city_name: string;
    };
  };
  expedition: {
    name: string;
    display_name: string;
  };
  address: {
    address: string;
    kecamatan: string;
    kelurahan: string;
    city: {
      city_name: string;
    };
  };
}

export interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface OrdersForAdminResponse {
  orders: OrderResponse[];
  pagination: PaginationInfo;
}

function getToken(): string | undefined {
  return Cookies.get("token");
}

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
});

export const getOrdersForAdmin = async (
  filter:
    | "all"
    | "waiting_payment_confirmation"
    | "processing"
    | "delivered"
    | "completed"
    | "cancelled" = "all",
  search?: string,
  sortBy: "name" | "createdAt" = "createdAt",
  order: "asc" | "desc" = "asc",
  page: number = 1,
  limit: number = 10,
  storeId?: number,
  startDate?: string,
  endDate?: string,
): Promise<AxiosResponse<OrdersForAdminResponse>> => {
  const token = getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await api.get<OrdersForAdminResponse>(
      "/warehouse/manage-orders",
      {
        params: {
          filter,
          search,
          sortBy,
          order,
          page,
          limit,
          storeId,
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
    throw new Error(
      "An unknown error occurred while fetching orders for admin.",
    );
  }
};
