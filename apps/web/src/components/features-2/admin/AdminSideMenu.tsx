'use client'
import  { AdminSideMenuInterface, adminSideMenuDatas } from "@/constants/adminSideMenuData";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";

export default function AdminSideMenu() {
  const { baseUrlGroup, menu } = adminSideMenuDatas;
  const pathname = usePathname();

  const isAnyChildActive = (items: AdminSideMenuInterface[]): boolean => {
    return items.some(item => {
      const isActive = `${baseUrlGroup}${item.href}` === pathname;
      if (isActive) return true;
      if (item.subMenu && item.subMenu.length > 0) {
        return isAnyChildActive(item.subMenu);
      }
      return false;
    });
  };

  const renderDisplayName = (displayName: string | React.ReactNode | IconType) => {
    if (typeof displayName === "string") {
      return displayName;
    } else if (React.isValidElement(displayName)) {
      return displayName;
    } else if (typeof displayName === "function") {
      const IconComponent = displayName as IconType;
      return <IconComponent className="inline-block mr-2" />;
    }
    return null;
  };

  const renderMenuItems = (items: AdminSideMenuInterface[]) => {
    return items.map((item) => {
      const isActive = `${baseUrlGroup}${item.href}` === pathname;
      const shouldOpen = isActive || (item.subMenu && isAnyChildActive(item.subMenu));

      if (item.subMenu && item.subMenu.length > 0) {
        return (
          <li key={item.name}>
            <details open={shouldOpen}>
              <summary>{renderDisplayName(item.displayName)}</summary>
              <ul>{renderMenuItems(item.subMenu)}</ul>
            </details>
          </li>
        );
      } else {
        return (
          <li key={item.name}>
            <Link className={` ${isActive ? "font-bold" : ""}`} href={`${baseUrlGroup}${item.href}`}>
              {renderDisplayName(item.displayName)}
            </Link>
          </li>
        );
      }
    });
  };

  return (
    <ul className="menu w-56 rounded-box text-lg bg-neutral shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] min-h-[96vh]">
      {renderMenuItems(menu)}
    </ul>
  );
}
