"use client";

import { useRouter } from "next/navigation";
import { NavbarItems, NavbarItemAuth } from "@/constants";
import ProfileItem from "./ProfileItem";
import { UserProps } from "@/interfaces/user";

interface NavbarItemProps {
  user?: UserProps;
  cartItemCount?: number; // Add prop for cart item count
}

export default function NavbarItem({ user, cartItemCount }: NavbarItemProps) {
  const isLoggedIn = !!user;
  const router = useRouter();

  return (
    <div className="mt-10 h-full w-full md:mt-0 md:w-fit">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
        {isLoggedIn
          ? NavbarItemAuth.map((item, i) => (
              <div key={i} className="w-full md:w-fit">
                {item.name === "Profile" ? (
                  <ProfileItem />
                ) : (
                  <div
                    onClick={() => router.push(`${item.href}`)}
                    className={`btn btn-secondary btn-sm w-full transition md:btn-ghost md:w-fit`}
                  >
                    {item.name === "Search" ? (
                      <item.icon size={23} />
                    ) : (
                      <>
                        <item.icon size={23} />
                        {item.name}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          : NavbarItems.map((item, i) => (
              <div
                key={i}
                onClick={() => router.push(`${item.href}`)}
                className={`btn ${i === 2 ? "btn-primary text-white" : "btn-secondary"} btn-sm w-full transition md:w-fit`}
              >
                <item.icon />
                {item.name}
              </div>
            ))}
      </div>
    </div>
  );
}
