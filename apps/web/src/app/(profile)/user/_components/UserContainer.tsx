import Container from "@/components/Container";
import LeftSideProfile from "./LeftSideProfile";
import ProfileNavigation from "./ProfileNavigation";
import RightSideProfile from "./RightSideProfile";
import { getCurrentUser } from "@/actions/getCurrentUser";

interface UserContainerProps {
  children: React.ReactNode;
}

export default async function UserContainer({ children }: UserContainerProps) {
  const user = await getCurrentUser();

  return (
    <Container>
      <div className="flex w-full justify-start gap-4">
        <LeftSideProfile user={user} />
        <div className="w-full">
          <ProfileNavigation userRole={user?.role}/>
          <hr />
          <RightSideProfile>{children}</RightSideProfile>
        </div>
      </div>
    </Container>
  );
}
