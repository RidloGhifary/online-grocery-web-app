'use client'
import { getProductListWithFilter } from "@/actions/products";
import { useQuery } from "@tanstack/react-query";

export function useProductWithFilter({
  category,
  search,
  order = "asc",
  orderField = "product_name",
}: {
  category?: string;
  search?: string;
  order?: "asc" | "desc";
  orderField?: string;
}) {

  return useQuery({
    queryKey: [
      "publicProductList",
      {
        search: search,
        orderField: orderField || "product_name",
        order: order || "asc",
        category: category,
      },
    ],
    queryFn: async () => {
      const data = await getProductListWithFilter({
        search: search,
        orderField: orderField || "product_name",
        order: order || "asc",
        category: category,
      });
      return data;
    },
  });
}
