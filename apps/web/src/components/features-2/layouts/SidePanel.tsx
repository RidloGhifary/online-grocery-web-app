import { ReactNode } from 'react';

export default function SidePanel({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <>
      <div className="drawer-side">
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
        <div className="bg-base min-h-full w-64 p-4">{children}</div>
      </div>
    </>
  );
}
