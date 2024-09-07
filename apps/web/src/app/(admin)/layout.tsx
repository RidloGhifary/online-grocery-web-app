import AdminDrawer from "@/components/features-2/admin/AdminDrawer";
import AdminNavMenu from "@/components/features-2/admin/AdminNavMenu";
import AdminNavMenu2 from "@/components/features-2/admin/AdminNavMenu2";
import AdminSideMenu from "@/components/features-2/admin/AdminSideMenu";
import AdminSidePanel from "@/components/features-2/admin/AdminSidePanel";
import Drawer from "@/components/features-2/layouts/Drawer";
import SidePanel from "@/components/features-2/layouts/SidePanel";
import { ReactNode } from "react";

export default function ({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminDrawer
        sidePanel={
          <AdminSidePanel>
            <AdminSideMenu />
          </AdminSidePanel>
        }
      >
        <AdminNavMenu/>
        {/* <input id="my-drawer-3" type="checkbox" className="drawer-toggle w-full" /> */}
        <div className="m-4 rounded-md">
          {/* <AdminNavMenu2 /> */}
          {children}
        </div>
      </AdminDrawer>
    </>
  );
}
