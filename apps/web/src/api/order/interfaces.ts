export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  sub_total: number;
  createdAt: string;
  product: {
    name: string;
  };
}

export interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OrderResponse {
  id: number;
  invoice: string;
  customer_id: number;
  order_status: {
    status: string;
  };
  customer: {
    first_name: string;
    last_name: string;
  };
  address: {
    address: string;
    city: {
      city_name: string;
    };
  };
  expedition: {
    display_name: string;
  };
  store: {
    name: string;
    address: string;
    city: {
      city_name: string;
    };
  };
  managed_by_id: number;
  store_id: number;
  expedition_id: number;
  order_status_id: number;
  address_id: number;
  order_details: OrderItem[];
  totalProductPrice: number;
  deliveryPrice: number;
}

export interface OrdersByUserResponse {
  orders: OrderResponse[];
  pagination: PaginationInfo;
}

export interface GenericResponse {
  message: string;
}
