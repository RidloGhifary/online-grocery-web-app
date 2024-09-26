import React from "react";
import { getCurrentUser } from "@/actions/getCurrentUser";
import MutationsContentAdmin from "./_components/MutationsContentAdmin";

export default async function MutationManagementPage() {
  const user = await getCurrentUser();
  return (
    <div>
      <MutationsContentAdmin user={user} />
    </div>
  );
}
