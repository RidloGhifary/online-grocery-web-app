"use client";
import { getProductCategoryList } from "@/actions/categories";
import { queryKeys } from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useProductCategory() {
  return useQuery({
    queryKey: [queryKeys.productCategories],
    queryFn: async () => {
      return await getProductCategoryList({})
    },
  });
}


export function useProductCategoryWithFilter({
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
    queryKey: [queryKeys.productCategories, keys || undefined],
    queryFn: () => {
      const data = getProductCategoryList({
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
