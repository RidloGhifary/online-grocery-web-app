import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

// Interface for the items being checked out
interface CheckoutItem {
  product_id: number;
  quantity: number;
  price: number;
}

// Interface for the request body of createOrder
interface CreateOrderRequest {
  userId: number;
  checkoutItems: CheckoutItem[];
  selectedAddressId: number;
  storeId: number;
  selectedCourier: string;
  selectedCourierPrice: number;
  note?: string; // Optional
}

interface CreateOrderResponse {
  message: string;
  orderId: number;
  invoice: string;
}

interface NearestStore {
  id: number;
  name: string;
  store_type: string;
  latitude: number;
  longtitude: number;
  city_id: number;
  city_name: string;
  province_name: string;
  address: string;
  kecamatan: string;
  kelurahan: string;
}

interface FindNearestStoreResponse {
  message: string;
  closestStore: NearestStore;
}

// Interface for a Voucher object
interface Voucher {
  id: number;
  voucher_type: string;
  product_id?: number;
  product_discount?: {
    discount: number;
    discount_type: string;
  };
  delivery_discount?: number;
  is_delivery_free?: boolean;
  applicableProducts: string[];
}

// Interface for the getVouchers API response
interface GetVouchersResponse {
  vouchers: Voucher[];
  message?: string; // Optional message if needed
}

interface VoucherByIdResponse {
  voucher: {
    id: string;
    code: string;
    discount_amount: number;
    discount_type: "percentage" | "fixed";
    valid_until: Date;
    minimum_purchase: number;
  };
}

function getToken(): string | undefined {
  return Cookies.get("token");
}

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getNearestStore = async (
  addressId: number,
): Promise<AxiosResponse<FindNearestStoreResponse>> => {
  const token = getToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }
  try {
    const response = await api.post<FindNearestStoreResponse>(
      "/checkout/store-location",
      {
        addressId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch the nearest store: ${error}`);
  }
};

export const createOrder = async (
  orderData: CreateOrderRequest,
): Promise<AxiosResponse<CreateOrderResponse>> => {
  const token = getToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }
  try {
    const response = await api.post<CreateOrderResponse>(
      "/checkout/create-order",
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token
        },
      },
    );
    return response; // Return the full Axios response
  } catch (error) {
    throw new Error(`Error creating order: ${error}`);
  }
};

export const getVouchers = async (): Promise<
  AxiosResponse<GetVouchersResponse>
> => {
  const token = getToken();
  const response = await api.get<GetVouchersResponse>(
    "/checkout/get-vouchers",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

export const getVoucherById = async (
  voucherId: string,
): Promise<VoucherByIdResponse> => {
  const token = getToken();
  const response = await api.get(`/checkout/get-voucher-id/${voucherId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
