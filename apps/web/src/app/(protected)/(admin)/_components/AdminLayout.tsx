import AdminDrawer from "@/components/features-2/admin/AdminDrawer";
import AdminNavMenu2 from "@/components/features-2/admin/AdminNavMenu2";
import AdminSideMenu from "@/components/features-2/admin/AdminSideMenu";
import AdminSidePanel from "@/components/features-2/admin/AdminSidePanel";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminDrawer
        sidePanel={
          <AdminSidePanel>
            <AdminSideMenu />
          </AdminSidePanel>
        }
      >
        {/* <AdminNavMenu/> */}
        <div className="mb-4 w-full">
          <AdminNavMenu2 />
        </div>
        {/* <input id="my-drawer-3" type="checkbox" className="drawer-toggle w-full" /> */}
        <div className="m-4 rounded-md p-2">
          {/* <AdminNavMenu2 /> */}
          {children}
        </div>
      </AdminDrawer>
    </>
  );
}
