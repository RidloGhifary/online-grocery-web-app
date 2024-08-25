"use client";

import { useRouter } from "next/navigation";

import { NavbarItems } from "@/constants";
import ProfileItem from "./ProfileItem";

export default function NavbarItem() {
  const isLoggedIn = true;
  const router = useRouter();

  return (
    <div className="mt-10 h-full w-full md:mt-0 md:w-fit">
      {NavbarItems.map((item, i) => (
        <div key={i} className="flex flex-col items-center gap-4 md:flex-row">
          {isLoggedIn &&
            item?.requireAuth?.map((item, i) => (
              <div key={i} className="mr-auto cursor-pointer hover:underline">
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
              className="cursor-pointer"
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
