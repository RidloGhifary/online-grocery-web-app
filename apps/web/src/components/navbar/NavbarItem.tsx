"use client";

import { useRouter } from "next/navigation";

import { NavbarItems } from "@/constants";
import ProfileItem from "./ProfileItem";

export default function NavbarItem() {
  const isLoggedIn = false;
  const router = useRouter();

  return (
    <div className="space-x-4">
      {NavbarItems.map((item, i) => (
        <div
          key={i}
          className="flex cursor-pointer items-center gap-4 hover:underline"
        >
          {isLoggedIn &&
            item?.requireAuth?.map((item, i) => (
              <div key={i}>
                {item.name === "Profile" ? (
                  <ProfileItem />
                ) : (
                  <span onClick={() => router.push(`${item.href}`)}>
                    {item.name}
                  </span>
                )}
              </div>
            ))}

          {!isLoggedIn && (
            <span
              onClick={() =>
                router.push(
                  `${item.href === "/cart" ? "/login?callbackUrl=/cart" : item.href}`,
                )
              }
            >
              {item.name}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
