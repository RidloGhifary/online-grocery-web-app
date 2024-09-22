import { ReactNode } from "react";
import AdminLayout from "./_components/AdminLayout";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { getAdmin } from "@/actions/user";
import AdminProvider from "@/providers/AdminProvider";

export default async function Layout({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.adminInfo],
    queryFn: getAdmin,
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AdminProvider>
          <AdminLayout>{children}</AdminLayout>
        </AdminProvider>
      </HydrationBoundary>
    </>
  );
}
