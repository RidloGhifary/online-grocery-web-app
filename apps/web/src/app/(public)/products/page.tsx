import { getProductListWithFilter } from "@/actions/products";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { getProductCategoryList } from "@/actions/categories";
import ProductListPage from "./_components/ProductListPage";

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.products],
    queryFn: () => getProductListWithFilter({order:'asc',orderField:'product_name'}),
  });
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.productCategories],
    queryFn: async () => await getProductCategoryList(),
  });
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductListPage/>
      </HydrationBoundary>
    </>
  );
}
