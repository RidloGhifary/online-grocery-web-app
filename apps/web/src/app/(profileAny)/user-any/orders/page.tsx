import { getCurrentUser } from "@/actions/getCurrentUser";
import UserContainer from "../_components/UserContainer";
import AddressContent from "../address/_components/AddressContent";
import { UserAddressProps } from "@/interfaces/user";
import OrdersContent from "./_components/OrdersContent";

const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default async function AddressPage() {
  const user = await getCurrentUser();

  return (
    <UserContainer>
      <OrdersContent />
    </UserContainer>
  );
}
