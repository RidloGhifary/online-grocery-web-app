import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { getAllAdminList, getAllCustomerList } from "@/actions/admin";
import { ReactNode } from "react";


export default async function Layout({children}:{children:ReactNode}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.customers],
    queryFn: () => getAllCustomerList({}),
  });
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.adminList],
    queryFn: () => getAllAdminList({}),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {children}
      </HydrationBoundary>
    </>
  );
}
