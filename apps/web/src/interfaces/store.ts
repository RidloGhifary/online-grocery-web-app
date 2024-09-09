import { CityProps, ProvinceProps, UserProps } from "./user";

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
  province?: ProvinceProps;
  city?: CityProps;
}

export interface StoreHasProductProps {
  id: number;
  qty: number;
  product_id: number;
  store_id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  store?: StoreProps;
}

export interface DetailStoreProps extends StoreProps {
  store_admins?: StoreAdmins[];
}

export interface StoreAdmins {
  id: number;
  user_id: number;
  store_id: number;
  assignee_id: number;
  createdAt: string;
  updatedAt: any;
  deletedAt: any;
  user?: UserProps;
}
