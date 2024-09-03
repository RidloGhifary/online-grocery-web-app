import { getCurrentUser } from "@/actions/getCurrentUser";

interface AddressCardProps {
  address: {
    id: number;
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

const AddressCard: React.FC<AddressCardProps> = async ({ address }) => {
  // const user = await getCurrentUser();
  return (
    <div className="address-card rounded-md border p-4">
      <h3 className="font-bold">{address.name}</h3>
      <p>{address.addressLine1}</p>
      <p>{address.addressLine2}</p>
      <p>
        {address.city}, {address.state}, {address.postalCode}
      </p>
    </div>
  );
};

export default AddressCard;
