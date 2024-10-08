import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { useCart } from "@/context/CartContext";

export interface CartItemProps {
  id: number;
  product_id: number;
  qty: number;
  user_id: number;
  store_id: number;
  totalPrice: number;
  product: {
    name: string;
    unit_in_gram: number;
    price: number;
    image: string;
    description: string;
  };
}

interface GetCartItemsResponse {
  data: CartItemProps[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

interface AddItemResponse {
  data: CartItemProps;
}

interface UpdateQuantityResponse {
  data: CartItemProps;
}

interface RemoveItemResponse {
  data: {
    message: string;
  };
}

interface GetCartItemsResponse {
  data: CartItemProps[];
}

interface SelectForCheckoutResponse {
  data: CartItemProps[];
}

function getToken(): string | undefined {
  return Cookies.get("token");
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api",
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export async function getCartItems(
  page: number = 1,
  pageSize: number = 8,
  sort: string = "name",
  order: string = "asc",
  search: string = "",
): Promise<AxiosResponse<GetCartItemsResponse>> {
  try {
    const response = await api.get<GetCartItemsResponse>("/cart/items", {
      params: { page, pageSize, sort, order, search },
    });
    // console.log(response);
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch cart items: ${error}`);
  }
}

export async function addItemToCart(
  productId: number,
  quantity: number,
  storeId: number,
): Promise<AxiosResponse<AddItemResponse>> {
  try {
    const response = await api.post<AddItemResponse>("/cart/items", {
      productId,
      quantity,
      storeId,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data.message || `Error: ${error.response.status}`,
        );
      } else if (error.request) {
        throw new Error("No response from server.");
      } else {
        throw new Error(error.message);
      }
    } else {
      throw new Error(`Failed to add item to cart: ${error}`);
    }
  }
}

export async function updateCartItemQuantity(
  productId: number,
  quantity: number,
): Promise<AxiosResponse<UpdateQuantityResponse>> {
  try {
    const response = await api.patch<UpdateQuantityResponse>(
      `/cart/items/${productId}`,
      { quantity },
    );
    return response;
  } catch (error) {
    throw new Error(`Failed to remove item from cart: ${error}`);
  }
}

export const selectForCheckout = async (
  productIds: number[],
  quantities: number[],
) => {
  const token = getToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await api.post<SelectForCheckoutResponse>(
      "/cart/select-for-checkout",
      { productIds, quantities },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export async function removeItemFromCart(
  productId: number,
): Promise<AxiosResponse<RemoveItemResponse>> {
  try {
    const response = await api.delete<RemoveItemResponse>(
      `/cart/items/${productId}`,
    );
    return response;
  } catch (error) {
    throw new Error(`Failed to remove item from cart: ${error}`);
  }
}
