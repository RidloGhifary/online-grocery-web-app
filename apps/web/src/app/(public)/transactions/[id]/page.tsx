import { getCurrentUser } from "@/actions/getCurrentUser";
import TransactionDetailedPage from "./components/TransactionDetailedPage";

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return <TransactionDetailedPage user={user} />;
}
