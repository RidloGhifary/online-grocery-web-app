import { ReactNode } from "react";
import AdminLayout from "./_components/AdminLayout";

export default async function ({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminLayout>{children}</AdminLayout>
    </>
  );
}
