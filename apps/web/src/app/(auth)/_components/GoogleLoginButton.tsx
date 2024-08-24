"use client";

import { FcGoogle } from "react-icons/fc";

export default function GoogleLoginButton() {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm shadow-sm"
    >
      <FcGoogle size={20} />
      Login with google
    </button>
  );
}
