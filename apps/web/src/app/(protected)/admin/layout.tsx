import AdminSideMenu from "@/components/features-2/layouts/admin/AdminSideMenu";
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
        <div className="m-4 min-h-screen rounded-md">{children}</div>
      </Drawer>
    </>
  );
}
