"use client";

import { setCookies } from "@/actions/cookies";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Redirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  useEffect(() => {
    if (token) {
      setCookies("token", token);
      router.push(`/`);
      router.refresh();
    } else if (error) {
      toast.error(error, {
        position: "top-center",
      });
    } else {
      router.push(`/login`);
      router.refresh();
    }
  }, []);

  return (
    <div className="mt-10 min-h-[30vh] text-center">
      {error ? (
        <div className="space-y-3">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-7xl">Error</h1>
          <p>{error}</p>
          <Link href="/login" className="btn btn-primary btn-sm text-white">
            Back to Login
          </Link>
        </div>
      ) : (
        "Redirecting..."
      )}
    </div>
  );
}
