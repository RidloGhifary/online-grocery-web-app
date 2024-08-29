import { getCurrentUser } from "@/actions/getCurrentUser";
import UserContainer from "../_components/UserContainer";
import UserDetail from "./_components/UserDetail";
import UserPhotoBox from "./_components/UserPhotoBox";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <UserContainer>
      <div className="flex flex-col items-start gap-5 pb-10 md:flex-row">
        <UserPhotoBox />
        <UserDetail user={user} />
      </div>
    </UserContainer>
  );
}
