"use client";
import { getProductCategoryList } from "@/actions/categories";
import { useQuery } from "@tanstack/react-query";

export function useProductCategory() {
  return useQuery({
    queryKey: ["publicProductCategoryList"],
    queryFn: async () => {
      return await getProductCategoryList()
    },
  });
}
