import React from "react";
import { IconType } from "react-icons";
import { FaHome, FaShoppingBag, FaUserFriends } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";

export interface AdminSideMenuInterface {
  name?: string;
  displayName?: string | React.ReactNode | IconType; // Adjusted type to accept JSX.Element
  href?: string;
  permission?: string;
  icon?: string | React.ReactNode | IconType;
  subMenu?: AdminSideMenuInterface[];
}

const adminSideMenuDatas: {
  baseUrlGroup: string;
  menu: AdminSideMenuInterface[];
} = {
  baseUrlGroup: "/admin",
  menu: [
    {
      name: "admin.dashboard.menu",
      displayName: "Dashboard",
      icon: <FaHome size={"1.5em"} />,
      href: "",
      permission: "admin_dashboard_access",
    },
    {
      name: "admin.users.menu",
      displayName: "User",
      icon: <FaUserFriends size={"1.5em"} />,
      permission: "admin_users_access",
      subMenu: [
        {
          name: "admin.users.list",
          displayName: "User",
          href: "/user",
          permission: "admin_users_list",
        },
        {
          name: "admin.users.roles.list",
          displayName: "Roles",
          href: "/roles",
          permission: "admin_users_roles_list",
        },
        {
          name: "admin.users.permissions.list",
          displayName: "Permissions",
          href: "/permissions",
          permission: "admin_users_permissions_list",
        },
      ],
    },
    {
      name: "admin.manage.menu",
      displayName: "Manage",
      icon: <GrTransaction size={"1.5em"} />,
      permission: "admin_users_access",
      subMenu: [
        {
          name: "admin.orders.list",
          displayName: "Orders",
          href: "/manage/orders",
          permission: "admin_access",
        },
      ],
    },
    {
      name: "admin.products.menu",
      displayName: "Products",
      permission: "admin_product_access",
      icon: <FaShoppingBag size={"1.5em"} />,
      subMenu: [
        {
          name: "admin.products.list",
          displayName: "Products",
          href: "/products",
          permission: "admin_product_list",
        },
        {
          name: "admin.products.category",
          displayName: "Categories",
          href: "/categories",
          permission: "admin_product_category",
        },
      ],
    },
    {
      name: "admin.stores.menu",
      displayName: "Stores",
      permission: "super",
      icon: <FaShoppingBag size={"1.5em"} />,
      subMenu: [
        {
          name: "admin.stores.list",
          displayName: "Stores",
          href: "/stores",
          permission: "super",
        },
        {
          name: "admin.stores.admin",
          displayName: "Admins",
          href: "/admins",
          permission: "super",
        },
      ],
    },
  ],
};

export { adminSideMenuDatas };

// export default <{ baseUrlGroup: string; menu: AdminSideMenuInterface[] }>{
//   baseUrlGroup: "/admin",
//   menu: [
//     {
//       name: "admin.dashboard.menu",
//       displayName: RxDashboard,
//       href: "",
//       permission: "admin_dashboard_access",
//     },
//     {
//       name: "admin.users.menu",
//       displayName: "Users",
//       permission: "admin_users_access",
//       subMenu: [
//         {
//           name: "admin.users.list",
//           displayName: "User",
//           href: "/user",
//           permission: "admin_users_list",
//         },
//         {
//           name: "admin.users.roles.list",
//           displayName: "Roles",
//           href: "/roles",
//           permission: "admin_users_roles_list",
//         },
//         {
//           name: "admin.users.permissions.list",
//           displayName: "Permissions",
//           href: "/permissions",
//           permission: "admin_users_permissions_list",
//         },
//       ],
//     },
//     {
//       name: "admin.products.menu",
//       displayName: "Products",
//       permission: "admin_product_access",
//       subMenu: [
//         {
//           name: "admin.products.list",
//           displayName: "Products",
//           href: "/products",
//           permission: "admin_product_list",
//         },
//         {
//           name: "admin.products.category",
//           displayName: "Categories",
//           href: "/categories",
//           permission: "admin_product_category",
//         },
//       ],
//     },
//   ],
// };
