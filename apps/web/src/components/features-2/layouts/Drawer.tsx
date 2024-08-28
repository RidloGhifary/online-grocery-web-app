import { ReactNode } from "react";

export default function Drawer({ children, sidePanel }: { children?: ReactNode, sidePanel ?: ReactNode }) {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Page content here */}
          {children}
        </div>
        {sidePanel??''}
      </div>
    </>
  );
}
