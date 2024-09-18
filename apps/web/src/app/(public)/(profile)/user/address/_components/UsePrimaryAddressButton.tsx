"use client";

import { asPrimaryAddress } from "@/actions/address";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
    mutationFn: () => asPrimaryAddress({ id }),
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
      disabled={isLoading}
      onClick={() => mutate()}
      className="btn btn-primary btn-xs text-white"
    >
      Use as a primary address
    </button>
  );
}
