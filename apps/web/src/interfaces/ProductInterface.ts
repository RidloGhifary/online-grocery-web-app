import { CategoryCompleteInterface } from "./CategoryInterface";
import { ProductDiscount } from "./product";
import { StoreInterface } from "./store";

export interface ProductCompleteInterface {
  id: number;
  sku: string;
  name: string;
  slug: string | null;
  product_category_id: number;
  description: string | null;
  // current_stock: number | null;
  unit: string;
  price: number;
  image: string | null;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  deletedAt: Date | string | null;
  store_id: number | null;
  product_discounts: ProductDiscount[];
  product_category?: CategoryCompleteInterface;
  StoreHasProduct?: StoreHasProductInterface[]
}


export interface ProductCardListInterface {
  name: string;
  price: number;
  slug: string;
  city?: string;
  image?: string
}

export interface ProductRecordInterface {
  sku: string;
  name: string;
  product_category_id: number;
  description?: string | null;
  current_stock?: number | null;
  unit: string;
  price: number;
  image?: string | null;
  store_id: number | null;
}

export interface StoreHasProductInterface {
  id: number;
  qty?: number | null;
  product_id?: number | null;
  store_id?: number | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  deletedAt?: string | Date | null;
  store?: StoreInterface
}

export interface UpdateProductInputInterface {
  id?: number;
  sku?: string;
  name?: string;
  slug?: string | null;
  product_category_id?: number;
  description?: string | null;
  unit?: string;
  price?: number;
  image?: string | null;
  unit_in_gram?: number ;
}
