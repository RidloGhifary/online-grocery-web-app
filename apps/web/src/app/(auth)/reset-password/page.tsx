import AuthWrapper from "../_components/AuthWrapper";
import ForgotPasswordForm from "./_components/ResetPasswordForm";

const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function ForgotPassword() {
  return (
    <AuthWrapper>
      <ForgotPasswordForm api_url={api_url} />
    </AuthWrapper>
  );
}
