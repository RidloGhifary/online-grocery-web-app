import AdminNavMenu from "@/components/features-2/admin/AdminNavMenu";
import AdminSideMenu from "@/components/features-2/admin/AdminSideMenu";
import Drawer from "@/components/features-2/layouts/Drawer";
import SidePanel from "@/components/features-2/layouts/SidePanel";
import { ReactNode } from "react";

export default function ({ children }: { children: ReactNode }) {
  return (
    <>
      <Drawer
        sidePanel={
          <SidePanel>
            <AdminSideMenu />
          </SidePanel>
        }
      >
        <AdminNavMenu/>
        <div className="m-4 rounded-md ">{children}</div>
      </Drawer>
    </>
  );
}
