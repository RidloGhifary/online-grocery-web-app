import Container from "@/components/Container";
import LeftSideProfile from "./LeftSideProfile";
import ProfileNavigation from "./ProfileNavigation";
import RightSideProfile from "./RightSideProfile";

interface UserContainerProps {
  children: React.ReactNode;
}

export default function UserContainer({ children }: UserContainerProps) {
  return (
    <Container>
      <div className="flex w-full justify-start gap-4">
        <LeftSideProfile />
        <div className="w-full">
          <ProfileNavigation />
          <hr />
          <RightSideProfile>{children}</RightSideProfile>
        </div>
      </div>
    </Container>
  );
}
