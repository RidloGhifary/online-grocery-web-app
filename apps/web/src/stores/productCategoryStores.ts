import { getProductCategoryList } from "@/actions/categories";
import { queryKeys } from "@/constants/queryKeys";
import { atomWithQuery } from "jotai-tanstack-query";

export const productCategoriesAtom = atomWithQuery(() => ({
  queryKey:[queryKeys.productCategories],
  queryFn : async () => await getProductCategoryList()
}));

