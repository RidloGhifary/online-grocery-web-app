"use client";

import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { RxCaretDown } from "react-icons/rx";

import { ProfileDropDownItems } from "@/constants";

export default function ProfileItem() {
  const router = useRouter();

  return (
    <div className="dropdown dropdown-bottom md:dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="md:avatar md:btn md:btn-circle md:btn-ghost"
      >
        <FaUser size={20} className="hidden md:block" />
        <div className="flex items-center justify-between md:hidden">
          <p className="md:hidden">User Profile</p>
          <RxCaretDown size={25} className="md:hidden" />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content menu-sm z-50 w-52 space-y-4 rounded-box bg-white p-4 shadow md:space-y-3"
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
