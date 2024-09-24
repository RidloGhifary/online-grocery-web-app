"use client";

import { deleteCookie } from "@/actions/cookies";
import { useRouter } from "next/navigation";
import { HiLogout } from "react-icons/hi";

interface LogoutButtonProps {
  className?: string;
  icon?: boolean;
}

export default function LogoutButton({ className, icon }: LogoutButtonProps) {
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
      {icon && <HiLogout />}
      Logout
    </button>
  );
}
