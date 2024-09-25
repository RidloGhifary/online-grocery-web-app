'use client'
import { getAdmin } from "@/actions/user";
import LogoutButton from "@/components/navbar/LogoutButton";
import { queryKeys } from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function () {
  const {data, isLoading, error} = useQuery({
    queryKey: [queryKeys.adminInfo],
    queryFn: ()=> getAdmin(),
  })
  return (
    <>
      <div className="navbar bg-base-100">
        {/* Sidebar Toggle */}
        <div className="flex-none lg:hidden">
          <label
            htmlFor="my-drawer-3"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-6 w-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
        </div>
        
        {/* Profile on the right */}
        <div className="flex-none ml-auto">
          {isLoading?'loading . .  .': data?.data?.email}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="avatar btn btn-circle btn-ghost"
            >
              <div className="w-10 rounded-full">
                {/* <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                /> */}
                <Image src={data?.data?.image||"https://cdn-icons-png.flaticon.com/512/10412/10412383.png"} height={20} width={20} quality={20} alt={data?.data?.username!} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li>
                {/* <a>Logout</a> */}
                <LogoutButton/>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
