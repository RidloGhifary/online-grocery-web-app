'use client'
import { AdminSideMenuInterface, adminSideMenuDatas } from "@/constants/adminSideMenuData";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";

export default function AdminNavMenu() {
  const { baseUrlGroup, menu } = adminSideMenuDatas;
  const pathname = usePathname();

  // Recursive function to check if the current path matches any of the sub-menu paths
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

  // Function to render the icon if it exists, otherwise render the displayName
  const renderIconOrDisplayName = (icon: string | React.ReactNode | IconType, displayName: string | React.ReactNode | IconType) => {
    if (icon) {
      if (React.isValidElement(icon)) {
        return <div className="flex items-center justify-center w-full h-full">{icon}</div>;
      } else if (typeof icon === "function") {
        const IconComponent = icon as IconType;
        return (
          <div className="flex items-center justify-center w-full h-full">
            <IconComponent className="inline-block" />
          </div>
        );
      }
    }

    // If no icon is provided, render the displayName
    if (typeof displayName === "string") {
      return <span className="flex items-center justify-center w-full h-full">{displayName}</span>;
    } else if (React.isValidElement(displayName)) {
      return <div className="flex items-center justify-center w-full h-full">{displayName}</div>;
    } else if (typeof displayName === "function") {
      const DisplayComponent = displayName as IconType;
      return (
        <div className="flex items-center justify-center w-full h-full">
          <DisplayComponent className="inline-block" />
        </div>
      );
    }

    return null;
  };

  const renderMenuItems = (items: AdminSideMenuInterface[]) => {
    return items.map((item) => {
      const isActive = `${baseUrlGroup}${item.href}` === pathname;

      if (item.subMenu && item.subMenu.length > 0) {
        return (
          <li key={item.name}>
            <details>
              <summary>{renderIconOrDisplayName(item.icon, item.displayName)}</summary>
              <ul>{renderMenuItems(item.subMenu)}</ul>
            </details>
          </li>
        );
      } else {
        return (
          <li key={item.name}>
            <Link
              className={`h-full min-h-full flex items-center justify-center ${isActive ? "font-bold" : ""}`}
              href={`${baseUrlGroup}${item.href}`}
            >
              {renderIconOrDisplayName(item.icon, item.displayName)}
            </Link>
          </li>
        );
      }
    });
  };

  return (
    <ul className="menu menu-horizontal rounded-box bg-base-200 m-4 lg:hidden">
      {renderMenuItems(menu)}
    </ul>
  );
}
