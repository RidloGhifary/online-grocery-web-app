"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  router.replace("/user/settings");

  return null;
}
