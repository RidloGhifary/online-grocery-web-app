import { getProductListWithFilter } from "@/actions/products";
import AdminProductPage from "./_components/AdminProductPage";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.products],
    queryFn: () => getProductListWithFilter({}),
  });
  // await queryClient.prefetchQuery({
  //   queryKey: [queryKeys.productCategories],
  //   queryFn: () => getProductCategoryList({}),
  // });
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AdminProductPage />
      </HydrationBoundary>
    </>
  );
}
