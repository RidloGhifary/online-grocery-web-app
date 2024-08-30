'use client'
import adminSideMenuData, { AdminSideMenuInterface } from "@/constants/adminSideMenuData";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSideMenu() {
  const { baseUrlGroup, menu } = adminSideMenuData;
  const pathname = usePathname();

  const renderMenuItems = (items: AdminSideMenuInterface[]) => {
    return items.map((item) => {
      const isActive = `${baseUrlGroup}${item.href}` === pathname;

      if (item.subMenu && item.subMenu.length > 0) {
        return (
          <li key={item.name}>
            <details>
              <summary className={isActive ? "font-bold" : " "}>{item.displayName}</summary>
              <ul>{renderMenuItems(item.subMenu)}</ul>
            </details>
          </li>
        );
      } else {
        return (
          <li className="" key={item.name}>
            <Link className={` ${isActive ? "font-bold active active:bg-black" : " "}`} href={`${baseUrlGroup}${item.href}`}>
              {item.displayName}
            </Link>
          </li>
        );
      }
    });
  };

  return (
    <ul className="menu w-56 rounded-box text-lg bg-base-200 min-h-[84vh]">
      {renderMenuItems(menu)}
    </ul>
  );
}
