"use client";
import { getProductCategoryList } from "@/actions/categories";
import { queryKeys } from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useProductCategory() {
  return useQuery({
    queryKey: [queryKeys.productCategories],
    queryFn: async () => {
      return await getProductCategoryList()
    },
  });
}
