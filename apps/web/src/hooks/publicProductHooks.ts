"use client";
import { getProductListWithFilter } from "@/actions/products";
import { queryKeys } from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useProductWithFilter({
  category,
  search,
  order,
  orderField,
  page,
  limit,
}: {
  category?: string;
  search?: string;
  order?: "asc" | "desc";
  orderField?: string;
  page?: number;
  limit?: number;
}) {
  let keys: {} | undefined = undefined;
  if (category || search || order || orderField || page || limit) {
    keys = {
      category,
      search,
      order,
      orderField,
      page: page ?? undefined,
      limit: limit ?? undefined,
    };
  }
  return useQuery({
    queryKey: [queryKeys.products, keys || undefined],
    queryFn: () => {
      const data = getProductListWithFilter({
        search: search,
        orderField: orderField,
        order: order,
        category: category,
        page: page,
        limit: limit,
      });
      return data;
    },
  });
}
