export interface ProductCompleteInterface {
  id: number;
  sku: string;
  name: string;
  slug: string | null;
  product_category_id: number;
  description: string | null;
  current_stock: number | null;
  unit: string;
  price: number;
  image: string | null;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  deletedAt: Date | string | null;
  store_id: number | null;
  product_category ?: ProductCategoryInterface;
}

export interface ProductCategoryInterface {
  id: number;
  name: string;
  display_name: string | null;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  deletedAt: Date | string | null;
}

export interface ProductCardListInterface {
  name: string;
  price: number;
  slug: string,
  city ?: string
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