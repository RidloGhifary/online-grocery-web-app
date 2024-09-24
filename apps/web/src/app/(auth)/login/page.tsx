import AuthHeader from "../_components/AuthHeader";
import AuthWrapper from "../_components/AuthWrapper";
import FormLogin from "./_components/FormLogin";

export default function LoginPage() {
  return (
    <AuthWrapper>
      <AuthHeader title="Sign in to your account" />
      <FormLogin  />
    </AuthWrapper>
  );
}
