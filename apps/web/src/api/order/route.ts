import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  sub_total: number;
  product: {
    name: string;
  };
}

interface CreateOrderRequest {
  userId: number;
  checkoutItems: OrderItem[];
  selectedAddressId: number;
  storeId: number;
  selectedCourier: string;
  selectedCourierPrice: number;
}

interface CreateOrderResponse {
  invoice: string;
  customer_id: number;
  managed_by_id: number;
  store_id: number;
  expedition_id: number;
  order_status_id: number;
  address_id: number;
  order_details: OrderItem[];
}

interface OrderResponse {
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
}

interface OrdersByUserResponse {
  orders: OrderResponse[];
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

export const createOrder = async (
  orderData: CreateOrderRequest,
): Promise<AxiosResponse<CreateOrderResponse>> => {
  const token = getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    console.log("Sending order data to API:", orderData);

    const response = await api.post<CreateOrderResponse>(
      "/orders/create-order",
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("API response received:", response.data);
    return response;
  } catch (error: any) {
    if (error.response) {
      console.error("API call error:", error.response.data);
      throw new Error(
        `Failed to create order: ${error.response.data.message || error.message}`,
      );
    }
    console.error("Unknown error:", error.message);
    throw new Error("An unknown error occurred while creating the order.");
  }
};

export const getOrdersByUser = async (
  userId: number,
): Promise<AxiosResponse<OrdersByUserResponse>> => {
  const token = getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await api.get<OrdersByUserResponse>(
      `/orders/user-orders/${userId}`,
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
