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
    queryFn: () =>
      getProductListWithFilter({
        search: "",
        orderField: "product_name",
        order: "asc",
        category: "",
        page: 1,
        limit: 20,
      }),
  });
  console.log('prefetch query');
  
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.productCategories],
    queryFn: async () => await getProductCategoryList({}),
  });
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductListPage />
      </HydrationBoundary>
    </>
  );
}
