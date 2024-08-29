"use client";

import { useRouter } from "next/navigation";

import { NavbarItems, NavbarItemAuth } from "@/constants";
import ProfileItem from "./ProfileItem";
import { UserProps } from "@/interface/user";

interface NavbarItemProps {
  user?: UserProps;
}

export default function NavbarItem({ user }: NavbarItemProps) {
  const isLoggedIn = !!user;
  const router = useRouter();

  return (
    <div className="mt-10 h-full w-full md:mt-0 md:w-fit">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
        {isLoggedIn
          ? NavbarItemAuth.map((item, i) => (
              <div key={i}>
                {item.name === "Profile" ? (
                  <ProfileItem />
                ) : (
                  <div
                    onClick={() => router.push(`${item.href}`)}
                    className="cursor-pointer hover:underline"
                  >
                    {item.name}
                  </div>
                )}
              </div>
            ))
          : NavbarItems.map((item, i) => (
              <div
                key={i}
                onClick={() => router.push(`${item.href}`)}
                className="cursor-pointer hover:underline"
              >
                {item.name}
              </div>
            ))}
      </div>
    </div>
  );
}
