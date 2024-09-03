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
