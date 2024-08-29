import UserContainer from "../_components/UserContainer";
import AddressContent from "./_components/AddressContent";

export default function AddressPage() {
  const userAddresses = [
    {
      label: "Home",
      address: "Jln. Cempedak No. 1 Kota Bandung, Jawa Barat",
      is_primary: true,
    },
    {
      label: "Office",
      address:
        "Jl. KH. Wahid Hasyim No.21, RT.007/RW.005, Tj. Duren, Kec. Grogol, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11470",
      is_primary: false,
    },
  ];

  return (
    <UserContainer>
      <AddressContent userAddresses={userAddresses} />
    </UserContainer>
  );
}
