import { getAllAdminList, getAllCustomerList } from "@/actions/admin";
import { queryKeys } from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useCustomerWithFilter({
  search,
  order,
  orderField,
  page,
  limit,
}: {
  search?: string;
  order?: "asc" | "desc";
  orderField?: string;
  page?: number;
  limit?: number;
}) {
  let keys: {} | undefined = undefined;
  if ( search || order || orderField || page || limit) {
    keys = {
      search,
      order,
      orderField,
      page: page ?? undefined,
      limit: limit ?? undefined,
    };
  }
  return useQuery({
    queryKey: [queryKeys.customers, keys || undefined],
    queryFn: () => {
      const data = getAllCustomerList({
        search: search,
        orderField: orderField,
        order: order,
        page: page,
        limit: limit,
      });
      return data;
    },
  });
}


export function useAdminWithFilter({
  search,
  order,
  orderField,
  page,
  limit,
}: {
  search?: string;
  order?: "asc" | "desc";
  orderField?: string;
  page?: number;
  limit?: number;
}) {
  let keys: {} | undefined = undefined;
  if ( search || order || orderField || page || limit) {
    keys = {
      search,
      order,
      orderField,
      page: page ?? undefined,
      limit: limit ?? undefined,
    };
  }
  return useQuery({
    queryKey: [queryKeys.adminList, keys || undefined],
    queryFn: () => {
      const data = getAllAdminList({
        search: search,
        orderField: orderField,
        order: order,
        page: page,
        limit: limit,
      });
      return data;
    },
  });
}
