import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { getProductCategoryList } from "@/actions/categories";
import AdminCategoriesPage from "./_components/AdminCategoriesPage";

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.productCategories],
    queryFn: async () => await getProductCategoryList(),
  });
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* <AdminProductPage /> */}
        <AdminCategoriesPage/>
      </HydrationBoundary>
    </>
  );
}
