"use client";

import { useRouter } from "next/navigation";

type UserProfileDetailProps = {
  label: string;
  value: string | undefined;
};

export default function UserProfileDetail({
  label,
  value,
}: UserProfileDetailProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <p className="w-[150px] text-sm font-semibold md:text-base">{label}</p>
      <p className="text-sm md:text-base">{value || "-"}</p>
      <button
        className="btn btn-link btn-sm"
        onClick={() =>
          router.push(`/user/settings?action=edit-${label.toLowerCase()}`)
        }
      >
        Change
      </button>
    </div>
  );
}
