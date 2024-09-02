"use client";

import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

import { ProfileDropDownItems } from "@/constants";
import { deleteCookie } from "@/actions/cookies";

export default function ProfileItem() {
  const router = useRouter();

  return (
    <div className="dropdown dropdown-bottom w-full md:dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-secondary btn-sm w-full md:w-fit"
      >
        <FaUser size={20} />
        Profile
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content menu-sm z-50 w-52 space-y-4 rounded-box bg-white p-4 shadow md:space-y-3"
      >
        {ProfileDropDownItems.map((item, i) => (
          <li
            key={i}
            className="cursor-pointer capitalize transition hover:translate-x-1"
            onClick={() => router.push(`${item.href}`)}
          >
            {item.name}
          </li>
        ))}
        <li
          onClick={() => {
            deleteCookie("token");
            router.refresh();
          }}
          className="flex cursor-pointer capitalize transition hover:translate-x-1"
        >
          Logout
        </li>
      </ul>
    </div>
  );
}
