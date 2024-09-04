import { getCurrentUser } from "@/actions/getCurrentUser";
import UserContainer from "../_components/UserContainer";
import AddressContent from "./_components/AddressContent";
import { UserAddressProps } from "@/interfaces/user";

const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default async function AddressPage() {
  const user = await getCurrentUser();

  return (
    <UserContainer>
      <AddressContent
        userAddresses={user?.addresses as UserAddressProps[]}
        username={user?.username as string}
        api_url={api_url}
      />
    </UserContainer>
  );
}
