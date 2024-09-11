"use client";

import { getCookies } from "@/actions/cookies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UsePrimaryAddressButtonProps {
  id: number;
}

export default function UsePrimaryAddressButton({
  id,
}: UsePrimaryAddressButtonProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const token = await getCookies("token");
      const { data } = await axios.patch(
        `http://localhost:8000/api/users/addresses/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    },
    onSuccess: (res) => {
      if (res.ok) {
        toast.success("Address set as primary");
        queryClient.invalidateQueries({ queryKey: ["user"] });
        router.refresh();
      } else {
        toast.error(res.message || "Something went wrong!");
      }
    },
    onError: (res) => {
      toast.error(res.message || "Something went wrong!");
    },
  });

  return (
    <button
      onClick={() => mutate()}
      className="btn btn-primary btn-xs text-white"
    >
      Use as a primary address
    </button>
  );
}
