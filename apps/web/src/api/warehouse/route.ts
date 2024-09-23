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

export interface OrderDetailResponse {
  id: number;
  invoice: string;
  customer_id: number;
  store_id: number;
  expedition_id: number;
  order_status_id: number;
  address_id: number;
  order_status: string;
  createdAt: string;
  totalProductPrice: number;
  deliveryPrice: number;
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
  order_details: OrderItem[];
}

export interface DeliverProductResponse {
  message: string;
  status: string;
  updatedOrderStatus: string;
}

export interface PaymentProofResponse {
  message: string;
  status: string;
}

export interface CancelOrderResponse {
  message: string;
  status: string;
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

export const getOrderById = async (
  id: number,
): Promise<AxiosResponse<OrderDetailResponse>> => {
  const token = getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await api.get<OrderDetailResponse>(
      `/warehouse/manage-order/detail/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.data.totalProductPrice || !response.data.deliveryPrice) {
      throw new Error("Total product price or delivery price not calculated");
    }

    return response;
  } catch (error: any) {
    if (error.response) {
      console.error("API call error:", error.response.data);
      throw new Error(
        `Failed to fetch order: ${error.response.data.message || error.message}`,
      );
    }
    console.error("Unknown error:", error.message);
    throw new Error("An unknown error occurred while fetching order details.");
  }
};

export const handlePaymentProof = async (
  orderId: number,
  action: "accept" | "decline",
): Promise<AxiosResponse<PaymentProofResponse>> => {
  const token = getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await api.post<PaymentProofResponse>(
      `/warehouse/manage-order/handle-payment-proof`,
      { orderId, action },
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
        `Failed to handle payment proof: ${error.response.data.message || error.message}`,
      );
    }
    console.error("Unknown error:", error.message);
    throw new Error("An unknown error occurred while handling payment proof.");
  }
};

export const deliverProduct = async (
  orderId: number,
): Promise<AxiosResponse<DeliverProductResponse>> => {
  const token = getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await api.post<DeliverProductResponse>(
      `/warehouse/manage-order/deliver-product`,
      { orderId },
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
        `Failed to deliver product: ${error.response.data.message || error.message}`,
      );
    }
    console.error("Unknown error:", error.message);
    throw new Error("An unknown error occurred while delivering the product.");
  }
};

export const cancelOrder = async (
  orderId: number,
): Promise<AxiosResponse<CancelOrderResponse>> => {
  const token = getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await api.post<CancelOrderResponse>(
      `/warehouse/manage-order/cancel`,
      { orderId },
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
    throw new Error("An unknown error occurred while cancelling the order.");
  }
};
