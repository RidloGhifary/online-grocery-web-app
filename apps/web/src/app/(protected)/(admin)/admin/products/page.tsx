import { getProductListWithFilter } from "@/actions/products";
import AdminProductPage from "./_components/AdminProductPage";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { getProductCategoryList } from "@/actions/categories";

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.products],
    queryFn: () => getProductListWithFilter({}),
  });
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.productCategories],
    queryFn: async () => await getProductCategoryList({}),
  });
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AdminProductPage />
      </HydrationBoundary>
    </>
  );
}
