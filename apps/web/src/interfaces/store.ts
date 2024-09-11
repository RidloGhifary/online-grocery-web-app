import { CityProps, ProvinceProps } from "./user";

export interface StoreProps {
  id: number;
  created_by: number;
  name: string;
  store_type: string;
  city_id: number;
  province_id: number;
  address: string;
  kecamatan: string;
  kelurahan: string;
  image: string;
  latitude: string;
  longtitude: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  province: ProvinceProps;
  city: CityProps;
}

export interface StoreInterface {
  id: number;
  created_by: number;
  name: string;
  store_type: "branch" | "primary";
  city_id: number;
  address: string;
  kecamatan: string;
  kelurahan: string;
  image: string | null;
  latitude: string | number;
  longtitude: string | number;
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
  deletedAt: string | Date | null;
}

export interface StoreHasAdminInterface {
  id: number;
  user_id: number;
  store_id: number;
  assignee_id: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface StoreHasProductProps {
  id: number;
  qty: number;
  product_id: number;
  store_id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  store: StoreProps;
}
