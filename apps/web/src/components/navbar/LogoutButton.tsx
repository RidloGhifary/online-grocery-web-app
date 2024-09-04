"use client";

import { deleteCookie } from "@/actions/cookies";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        deleteCookie("token");
        router.push("/login");
        router.refresh();
      }}
      className={`${className}`}
    >
      Logout
    </button>
  );
}
