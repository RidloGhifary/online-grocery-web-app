import { getCurrentUser } from "@/actions/getCurrentUser";
import UserContainer from "../_components/UserContainer";
import AddressContent from "./_components/AddressContent";
import { UserAddressProps } from "@/interfaces/user";

export default async function AddressPage() {
  const user = await getCurrentUser();

  return (
    <UserContainer>
      <AddressContent
        userAddresses={user?.addresses as UserAddressProps[]}
        username={user?.username as string}
      />
    </UserContainer>
  );
}
