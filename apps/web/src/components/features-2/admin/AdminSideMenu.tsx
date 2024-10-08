"use client";
import {
  AdminSideMenuInterface,
  adminSideMenuDatas,
} from "@/constants/adminSideMenuData";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import { IconType } from "react-icons";
import { useQuery } from "@tanstack/react-query";
import { getAdmin } from "@/actions/user";
import { queryKeys } from "@/constants/queryKeys";

export default function AdminSideMenu() {
  const { baseUrlGroup, menu } = adminSideMenuDatas;
  const pathname = usePathname();

  const {
    data: adminData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [queryKeys.adminInfo],
    queryFn: () => getAdmin(),
  });

  const hasPermission = (permission: string) => {
    const roles = adminData?.data?.role;
    // Check if admin has 'super' permission or 'super_admin' role
    if (roles?.some((role) => role.role?.name === "super_admin")) {
      return true;
    }
    // Check if admin has the required permission
    return roles?.some((role) =>
      role.role?.roles_permissions?.some(
        (rp) =>
          rp.permission?.name === permission || rp.permission?.name === "super",
      ),
    );
  };

  const isAnyChildActive = (items: AdminSideMenuInterface[]): boolean => {
    return items.some((item) => {
      const isActive = `${baseUrlGroup}${item.href}` === pathname;
      if (isActive) return true;
      if (item.subMenu && item.subMenu.length > 0) {
        return isAnyChildActive(item.subMenu);
      }
      return false;
    });
  };

  const renderDisplayName = (
    displayName: string | React.ReactNode | IconType,
  ) => {
    if (typeof displayName === "string") {
      return displayName;
    } else if (React.isValidElement(displayName)) {
      return displayName;
    } else if (typeof displayName === "function") {
      const IconComponent = displayName as IconType;
      return <IconComponent className="mr-2 inline-block" />;
    }
    return null;
  };

  const renderMenuItems = (items: AdminSideMenuInterface[]) => {
    return items.map((item) => {
      // Skip rendering menu items that the admin doesn't have permission to access
      if (!hasPermission(item.permission || "")) {
        return null;
      }

      const isActive = `${baseUrlGroup}${item.href}` === pathname;
      const shouldOpen =
        isActive || (item.subMenu && isAnyChildActive(item.subMenu));

      if (item.subMenu && item.subMenu.length > 0) {
        return (
          <li key={item.name+(Math.random() + 1).toString(36).substring(7)}>
            <details open={shouldOpen}>
              <summary>{item.icon as ReactNode?item.icon as ReactNode:''} {renderDisplayName(item.displayName)}</summary>
              <ul> {renderMenuItems(item.subMenu)}</ul>
            </details>
          </li>
        );
      } else {
        return (
          <li key={item.name+(Math.random() + 1).toString(36).substring(7)}>
            <Link className={` ${isActive ? "font-bold" : ""}`} href={`${baseUrlGroup}${item.href}`}>
            {item.icon as ReactNode?item.icon as ReactNode:''} {renderDisplayName(item.displayName)}
            </Link>
          </li>
        );
      }
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <ul className="menu min-h-full w-64 bg-base-100 p-4">
      {renderMenuItems(menu)}
    </ul>
  );
}
