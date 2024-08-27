import UserContainer from "../_components/UserContainer";
import UserDetail from "./_components/UserDetail";
import UserPhotoBox from "./_components/UserPhotoBox";

export default function SettingsPage() {
  return (
    <UserContainer>
      <div className="flex flex-col items-start gap-5 pb-10 md:flex-row">
        <UserPhotoBox />
        <UserDetail />
      </div>
    </UserContainer>
  );
}
