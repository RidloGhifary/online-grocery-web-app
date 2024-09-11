import { ReactNode } from "react";

export default function AdminSidePanel({
  children,
  extraContentTWClass,
}: {
  children?: ReactNode;
  extraContentTWClass?: string;
}) {
  return (
    <>
      <div className="no-scrollbar drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        {/* <ul className="menu bg-base-200 min-h-full w-64 p-4">
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul> */}
        {/* <div className="flex w-full items-center justify-center pb-3 pt-5 text-2xl">
          Logo
        </div>
        <div className={`w-64 bg-neutral ${extraContentTWClass || ""}`}>{children}</div> */}
        {children}
      </div>
    </>
  );
}
