"use client";

import { useRouter } from "next/navigation";
import { NavbarItems, NavbarItemAuth } from "@/constants";
import ProfileItem from "./ProfileItem";
import { UserProps } from "@/interface/user";

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
              <div key={i} className="relative">
                {" "}
                {/* Add relative positioning */}
                {item.name === "Profile" ? (
                  <ProfileItem />
                ) : (
                  <div
                    onClick={() => router.push(`${item.href}`)}
                    className="cursor-pointer hover:underline"
                  >
                    {item.name}
                    {item.name === "Cart" &&
                      cartItemCount! > 0 && ( // Only display for Cart and if cartItemCount is greater than 0
                        <span className="absolute left-[-20px] top-[-10px] rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
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
              <div key={i} className="relative">
                {" "}
                {/* Add relative positioning */}
                <div
                  onClick={() => router.push(`${item.href}`)}
                  className="cursor-pointer hover:underline"
                >
                  {item.name}
                  {item.name === "Cart" &&
                    cartItemCount! > 0 && ( // Only display for Cart and if cartItemCount is greater than 0
                      <span className="absolute left-[-20px] top-[-10px] rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                        {" "}
                        {/* Position to the left side */}
                        {cartItemCount}
                      </span>
                    )}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
