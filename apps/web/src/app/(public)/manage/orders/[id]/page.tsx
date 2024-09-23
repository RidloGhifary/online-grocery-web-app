import React from "react";
import { getCurrentUser } from "@/actions/getCurrentUser";
import DetailedOrdersContentAdmin from "./_components/DetailedOrdersContentAdmin";

export default async function OrderManagementPage() {
  const user = await getCurrentUser();
  return (
    <div>
      <DetailedOrdersContentAdmin user={user} />
    </div>
  );
}
