"use client";

import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

import { ProfileDropDownItems } from "@/constants";

export default function ProfileItem() {
  const router = useRouter();

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="avatar btn btn-circle btn-ghost"
      >
        <FaUser size={20} />
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content menu-sm z-50 w-52 space-y-3 rounded-box bg-white p-4 shadow"
      >
        {ProfileDropDownItems.map((item, i) => (
          <li
            key={i}
            className="flex cursor-pointer capitalize transition hover:translate-x-1"
            onClick={() => router.push(`${item.href}`)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
