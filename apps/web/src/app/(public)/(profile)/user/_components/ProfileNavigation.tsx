"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileNavigation() {
  const path = usePathname();

  const navigations = [
    {
      name: "Profile",
      href: "/user/settings",
      isActive: path === "/user/settings",
      isDisabled: false,
    },
    {
      name: "Address",
      href: "/user/address",
      isActive: path === "/user/address",
      isDisabled: false,
    },
    // {
    //   name: "Stores",
    //   href: "/user/stores",
    //   isActive: path === "/user/stores",
    //   isDisabled: userRole !== "super_admin",
    // },
  ];

  return (
    <div className="flex w-full items-center gap-8">
      {navigations.map((navigation) => (
        <Link
          key={navigation.name}
          href={navigation.href}
          className={`${navigation.isActive && "text-primary"} mb-[-1px] w-full max-w-[120px] text-center text-base font-semibold transition hover:text-primary md:max-w-[150px] md:text-lg`}
        >
          {navigation.name}
          {navigation.isActive && <hr className="border-primary" />}
        </Link>
      ))}
    </div>
  );
}
