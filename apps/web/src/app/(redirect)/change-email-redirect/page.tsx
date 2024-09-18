"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteCookie, setCookies } from "@/actions/cookies";
import { toast } from "react-toastify";
import { changeEmail } from "@/actions/credential";

export default function ChangeEmailRedirect() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const key = searchParams.get("key");

  const [cookiesSet, setCookiesSet] = useState<boolean>(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["change-email-redirect"],
    queryFn: async () => {
      if (!key) return; // If key is not present, skip the query
      const response = await changeEmail({ key: key as string });
      return response;
    },
    enabled: !!key, // Only run the query if the key is present
  });

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong!", {
        position: "top-center",
      });
      return;
    }

    if (data) {
      if (data.ok && !isLoading && !cookiesSet) {
        deleteCookie("token");
        setCookies("token", data.token as string);
        setCookiesSet(true); // Mark that cookies have been set
      }
    }
  }, [data, isLoading, isError, cookiesSet]);

  // Effect to handle the redirection after cookies are set
  useEffect(() => {
    if (cookiesSet) {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Email changed successfully, you can now login!", {
        position: "top-center",
      });
      router.push("/login");
      router.refresh();
    }
  }, [cookiesSet, queryClient, router]);

  // Redirect to home if key is not present
  useEffect(() => {
    if (!key) {
      router.push("/");
      router.refresh();
    }
  }, [key, router]);

  return (
    <div className="mt-10 min-h-[30vh] text-center">
      <p>Redirecting...</p>
    </div>
  );
}
