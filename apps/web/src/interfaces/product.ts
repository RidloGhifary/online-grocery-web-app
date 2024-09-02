import { CityProps, ProvinceProps } from "./user";

export interface ProductProps {
  id: number;
  sku: string;
  name: string;
  product_category_id: number;
  description: string;
  current_stock: number;
  unit: string;
  price: number;
  image: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  store_id: number;
  product_discounts: ProductDiscount[];
  store: Store;
}

export interface ProductDiscount {
  id: number;
  discount: number;
  started_at: string;
  end_at: string;
  product_id: number;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  discount_type: string;
}

export interface Store {
  id: number;
  created_by: number;
  name: string;
  store_type: string;
  city_id: number;
  province_id: number;
  address: string;
  kecamatan: string;
  kelurahan: string;
  image: string | null;
  latitude: string;
  longtitude: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  city: CityProps;
  province: ProvinceProps;
}
