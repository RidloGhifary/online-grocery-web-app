import { UserAddressProps, UserProps } from "@/interfaces/user";
import { FaCheck } from "react-icons/fa";

interface Props {
  address: UserAddressProps | null;
  currentUser?: UserProps | null;
  use_primary_button?: boolean;
  setSelectedAddress?: (address: UserAddressProps | null) => void;
  selectedAddress?: UserAddressProps | null;
}

const AddressCard: React.FC<Props> = ({
  address,
  currentUser,
  use_primary_button,
  setSelectedAddress,
  selectedAddress,
}) => {
  return (
    <div className="flex items-center justify-between rounded-md border border-primary p-4">
      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          <p className="badge badge-primary truncate text-sm text-white">
            {address?.label}
          </p>
          {selectedAddress?.id === address?.id && (
            <FaCheck className="block text-primary md:hidden" />
          )}
        </div>
        <p className="text-sm">{currentUser?.phone_number}</p>
        <p className="text-sm">{address?.address}</p>
        <div className="text-sm">
          {address?.city?.city_name}, {address?.city?.province?.province},{" "}
          <i>{selectedAddress?.postal_code}</i>
        </div>

        {use_primary_button && selectedAddress?.id !== address?.id && (
          <button
            onClick={() => setSelectedAddress?.(address)}
            className="btn btn-primary btn-xs w-fit text-white md:text-sm"
          >
            Choose
          </button>
        )}
      </div>
      <div className="hidden md:block">
        {selectedAddress?.id === address?.id && (
          <FaCheck className="text-primary" />
        )}
      </div>
    </div>
  );
};

export default AddressCard;
