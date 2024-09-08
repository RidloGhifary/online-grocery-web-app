import { ReactNode } from "react";

export default function AdminDrawer({ children, sidePanel, navBar }: { children?: ReactNode, sidePanel ?: ReactNode , navBar?:ReactNode}) {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        
        <div className="drawer-content flex flex-col bg-neutral-100">
          {/* Page content here */}
          {children}
        </div>
        {sidePanel??''}
      </div>
    </>
  );
}
