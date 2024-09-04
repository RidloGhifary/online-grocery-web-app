import AuthHeader from "../_components/AuthHeader";
import AuthWrapper from "../_components/AuthWrapper";
import FormLogin from "./_components/FormLogin";

const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function LoginPage() {
  return (
    <AuthWrapper>
      <AuthHeader title="Sign in to your account" />
      <FormLogin api_url={api_url} />
    </AuthWrapper>
  );
}
