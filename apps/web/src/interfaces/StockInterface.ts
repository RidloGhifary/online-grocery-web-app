
export interface Product {
  id: number;
  sku: string;
  name: string;
  slug: string;
  product_category_id: number;
  description: string;
  unit: string;
  price: number;
  image: string[];
  unit_in_gram: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
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
  image: string;
  latitude: string;
  longtitude: string;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export interface OrderDetail {
  id: number;
  order_id: number;
  product_id: number;
  qty: number;
  store_id: number;
  price: number;
  sub_total: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  order: Order;
}

export interface Order {
  id: number;
  invoice: string;
  customer_id: number;
  managed_by_id: number;
  store_id: number;
  expedition_id: number;
  payment_proof: string;
  note: string | null;
  order_status_id: number;
  address_id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  cancelAt?: string | null;
  completeAt?: string | null;
  order_details: OrderDetail[];
}

export interface StockAdjustmentRelatedEnd {
  id: number;
  qty_change: number;
  type: string;
  mutation_type?: string | null;
  managed_by_id: number;
  product_id: number;
  detail: string;
  from_store_id?: number | null;
  destinied_store_id: number;
  order_detail_id?: number | null;
  adjustment_related_id?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface StockAdjustmentRelated {
  id: number;
  qty_change: number;
  type: string;
  mutation_type?: string | null;
  managed_by_id: number;
  product_id: number;
  detail: string;
  from_store_id?: number | null;
  destinied_store_id: number;
  order_detail_id?: number | null;
  adjustment_related_id?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  adjustment_related_end: StockAdjustmentRelatedEnd[];
}

export interface StockAdjustment {
  id: number;
  qty_change: number;
  type: string;
  mutation_type: string;
  managed_by_id: number;
  product_id: number;
  detail: string;
  from_store_id?: number | null;
  destinied_store_id?: number;
  order_detail_id?: number | null;
  adjustment_related_id?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  order_detail?: OrderDetail | null;
  product: Product;
  from_store?: Store | null;
  destinied_store: Store;
  adjustment_related_end?: StockAdjustmentRelatedEnd[];
  adjustment_related?: StockAdjustmentRelated | null;
}
