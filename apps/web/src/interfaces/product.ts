import { StoreHasProductProps, StoreProps } from "./store";
import { CityProps, ProvinceProps } from "./user";

export interface ProductProps {
  id: number;
  sku: string;
  name: string;
  slug: string;
  product_category_id: number;
  description: string;
  unit: string;
  price: number;
  image: any;
  unit_in_gram: any;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  product_discounts: ProductDiscount[];
  StoreHasProduct: StoreHasProductProps[];
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
