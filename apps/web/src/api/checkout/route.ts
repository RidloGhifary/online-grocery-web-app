import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

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

function getToken(): string | undefined {
  return Cookies.get("token");
}

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// export const getNearestStore = async (
//   // productIds: number[],
//   // quantities: number[],
//   addressId: number,
// ): Promise<AxiosResponse<FindNearestStoreResponse>> => {
//   try {
//     const response = await api.get<FindNearestStoreResponse>(
//       "/checkout/store-location",
//       {
//         // params: { productIds, quantities, addressId },
//       },
//     );
//     return response;
//   } catch (error) {
//     throw new Error(`Failed to fetch the nearest store: ${error}`);
//   }
// };

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
