"use client";

import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import LogoutButton from "./LogoutButton";

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
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content menu-sm z-50 w-52 space-y-4 rounded-box bg-white p-4 shadow md:space-y-3"
      >
        <li
          className="cursor-pointer capitalize transition"
          onClick={() => router.push("/user/settings")}
        >
          <button>
            {" "}
            <FaUser />
            Profile
          </button>
        </li>
        <li className="cursor-pointer capitalize transition">
          <LogoutButton icon />
        </li>
      </ul>
    </div>
  );
}
