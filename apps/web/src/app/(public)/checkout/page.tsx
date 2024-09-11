import { getCurrentUser } from "@/actions/getCurrentUser";
import CheckOutContent from "./_components/CheckoutContentUnused";

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return <CheckOutContent user={user} />;
}
