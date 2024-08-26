"use client";

import { FcGoogle } from "react-icons/fc";

interface GoogleLoginButtonProps {
  disabled?: boolean;
}

export default function GoogleLoginButton({
  disabled,
}: GoogleLoginButtonProps) {
  const onClick = () => {
    alert("Login with google");
  };

  return (
    <button
      onClick={onClick}
      type="button"
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
    >
      <FcGoogle size={20} />
      Login with google
    </button>
  );
}
