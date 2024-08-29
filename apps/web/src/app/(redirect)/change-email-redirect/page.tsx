"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteCookie, setCookies } from "@/actions/cookies";
import { toast } from "react-toastify";

export default function ChangeEmailRedirect() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const key = searchParams.get("key");

  const [cookiesSet, setCookiesSet] = useState<boolean>(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (!key) return; // If key is not present, skip the query
      const response = await axios.get(
        `http://localhost:8000/api/credentials/change-email?key=${key}`,
      );
      return response.data;
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

    if (data && !isLoading && !cookiesSet) {
      deleteCookie("token");
      setCookies("token", data.token);
      setCookiesSet(true); // Mark that cookies have been set
    }
  }, [data, isLoading, isError, cookiesSet]);

  // Effect to handle the redirection after cookies are set
  useEffect(() => {
    if (cookiesSet) {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Email changed successfully, you can now login!", {
        position: "top-center",
      });
      router.refresh();
      router.push("/login");
    }
  }, [cookiesSet, queryClient, router]);

  // Redirect to home if key is not present
  useEffect(() => {
    if (!key) {
      router.push("/");
    }
  }, [key, router]);

  return (
    <div className="mt-10 min-h-[30vh] text-center">
      <p>Redirecting...</p>
    </div>
  );
}
