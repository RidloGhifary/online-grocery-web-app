"use client";

import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

import {
  ProfileDropDownItems,
  ProfileDropDownSuperAdminItems,
} from "@/constants";
import { deleteCookie } from "@/actions/cookies";
import { UserProps } from "@/interfaces/user";

export default function ProfileItem({ user }: { user?: UserProps }) {
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
        {user?.role === "super_admin"
          ? ProfileDropDownSuperAdminItems.map((item, i) => (
              <li
                key={i}
                className="cursor-pointer capitalize transition hover:translate-x-1"
                onClick={() => router.push(item.href)}
              >
                {item.name}
              </li>
            ))
          : ProfileDropDownItems.map((item, i) => {
              return (
                <li
                  key={i}
                  className="cursor-pointer capitalize transition hover:translate-x-1"
                  onClick={() => router.push(item.href)}
                >
                  {item.name}
                </li>
              );
            })}
        <li
          onClick={() => {
            deleteCookie("token");
            router.push("/login");
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
