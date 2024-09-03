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
              <div key={i} className="w-full md:w-fit relative">
                {item.name === "Profile" ? (
                  <ProfileItem user={user} />
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
                      {item.name === "Cart" &&
                        cartItemCount! > 0 && ( // Only display for Cart and if cartItemCount is greater than 0
                          <span className="absolute right-[-20px] top-[-10px] flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white lg:left-[-20px] lg:right-auto">
                            {" "}
                            {/* Position to the left side */}
                            {cartItemCount}
                          </span>
                      )}
                  </div>
                )}
              </div>
            ))
          : NavbarItems.map((item, i) => (
              <div
                key={i}
                onClick={() => router.push(`${item.href}`)}
                className={`btn ${i === 2 ? "btn-primary text-white" : "btn-secondary"} relative btn-sm w-full transition md:w-fit`}
              >
                <item.icon />
                {item.name}
                  {item.name === "Cart" &&
                    cartItemCount! > 0 && ( // Only display for Cart and if cartItemCount is greater than 0
                      <span className="absolute right-[-20px] top-[-10px] flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white lg:left-[-20px] lg:right-auto">
                        {" "}
                        {/* Position to the left side */}
                        {cartItemCount}
                      </span>
                    )
                  }
              </div>
            ))
        }
      </div>
    </div>
  );
}
