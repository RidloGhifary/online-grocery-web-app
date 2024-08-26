"use client";

import { setCookies } from "@/actions/cookies";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Redirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      setCookies("token", token);
      router.push(`/`);
    } else {
      router.push(`/login`);
    }
  }, []);

  return <div className="mt-10 text-center">Loading...</div>;
}
