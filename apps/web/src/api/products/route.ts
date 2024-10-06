import axios, { AxiosResponse } from "axios";

interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  current_stock: number;
  unit: string;
  price: number;
  image: string | null;
  store_id: number | null;
  updatedAt: Date;
}

interface GetAllProductsResponse {
  data: Product[];
}

interface GetProductByIdResponse {
  data: Product;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api",
});

export async function getAllProducts(): Promise<
  AxiosResponse<GetAllProductsResponse>
> {
  try {
    const response = await api.get<GetAllProductsResponse>("/products");
    // console.log(response);
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch products: ${error}`);
  }
}

export async function getProductById(id: number) {
  try {
    const response = await api.get<GetProductByIdResponse>(
      `/products/details/${id}`,
    );
    // console.log(response);
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch product by ID: ${error}`);
  }
}
