import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

interface CartItem {
  id: number;
  product_id: number;
  qty: number;
  user_id: number;
  store_id: number;
}

interface AddItemResponse {
  data: CartItem;
}

interface UpdateQuantityResponse {
  data: CartItem;
}

interface RemoveItemResponse {
  data: {
    message: string;
  };
}

interface GetCartItemsResponse {
  data: CartItem[];
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

export async function getCartItems(): Promise<
  AxiosResponse<GetCartItemsResponse>
> {
  try {
    const response = await api.get<GetCartItemsResponse>("/cart/items");
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
    throw new Error(`Failed to add item to cart: ${error}`);
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
