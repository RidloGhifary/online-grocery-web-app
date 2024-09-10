import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  sub_total: number;
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
}

interface OrdersByUserResponse {
  orders: OrderResponse[];
  pagination: PaginationInfo;
}

interface CancelOrderRequest {
  orderId: number;
}

interface UploadPaymentProofRequest {
  orderId: number;
  paymentProof: File;
}

interface ConfirmDeliveryRequest {
  orderId: number;
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
  filter: "all" | "ongoing" | "completed" | "cancelled" = "all",
  search?: string,
  sortBy: "invoice" | "createdAt" = "invoice",
  order: "asc" | "desc" = "asc",
  page: number = 1,
  limit: number = 12,
  startDate?: string,
  endDate?: string,
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

// export const uploadPaymentProof = async (
//   orderId: number,
//   paymentProofUrl: string,
// ): Promise<AxiosResponse<GenericResponse>> => {
//   const token = getToken();

//   if (!token) {
//     throw new Error("User is not authenticated");
//   }

//   try {
//     const response = await api.post<GenericResponse>(
//       `/orders/upload-payment/${orderId}`,
//       { payment_proof: paymentProofUrl },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       },
//     );

//     return response;
//   } catch (error: any) {
//     if (error.response) {
//       console.error("API call error:", error.response.data);
//       throw new Error(
//         `Failed to upload payment proof: ${error.response.data.message || error.message}`,
//       );
//     }
//     console.error("Unknown error:", error.message);
//     throw new Error(
//       "An unknown error occurred while uploading the payment proof.",
//     );
//   }
// };
