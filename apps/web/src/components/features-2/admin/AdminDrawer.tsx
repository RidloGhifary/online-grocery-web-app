import { ReactNode } from "react";

export default function AdminDrawer({ children, sidePanel }: { children?: ReactNode, sidePanel ?: ReactNode }) {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        
        <div className="drawer-content flex flex-col bg-neutral-100 p-2">
          {/* Page content here */}
          {children}
        </div>
        {sidePanel??''}
      </div>
    </>
  );
}
