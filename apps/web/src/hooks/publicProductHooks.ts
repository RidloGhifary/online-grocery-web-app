"use client";
import { getProductListWithFilter } from "@/actions/products";
import { queryKeys } from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useProductWithFilter({
  category,
  search,
  order,
  orderField,
}: {
  category?: string;
  search?: string;
  order?: "asc" | "desc";
  orderField?: string;
}) {
  let keys: {} | undefined = undefined;
  if (category || search || order || orderField) {
    keys = {
      category,
      search,
      order,
      orderField,
    };
  }
  return useQuery({
    queryKey: [
      queryKeys.products,
      (keys||undefined),
    ],
    queryFn: async () => {
      const data = await getProductListWithFilter({
        search: search,
        orderField: orderField,
        order: order,
        category: category,
      });
      return data;
    },
  });
}
