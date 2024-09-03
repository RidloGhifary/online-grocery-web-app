import UserContainer from "../_components/UserContainer";
import StoreLists from "./_components/StoreLists";

const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function StorePage() {
  return (
    <UserContainer>
      <StoreLists api_url={api_url} />
    </UserContainer>
  );
}
