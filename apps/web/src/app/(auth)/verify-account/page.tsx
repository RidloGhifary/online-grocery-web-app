import AuthHeader from "../_components/AuthHeader";
import AuthWrapper from "../_components/AuthWrapper";
import VerifyAccountForm from "./_components/VerifyAccountForm";

const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function VerifyAccountPage() {
  return (
    <AuthWrapper>
      <AuthHeader title="Verify your account" />
      <VerifyAccountForm api_url={api_url} />
    </AuthWrapper>
  );
}
