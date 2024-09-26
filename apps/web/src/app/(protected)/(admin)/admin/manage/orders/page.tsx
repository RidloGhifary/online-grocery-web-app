import React from "react";
import { getCurrentUser } from "@/actions/getCurrentUser";
import OrdersContentAdmin from "./_components/OrdersContentAdmin";

export default async function OrderManagementPage() {
  const user = await getCurrentUser();
  return (
    <div>
      <OrdersContentAdmin user={user} />
    </div>
  );
}
