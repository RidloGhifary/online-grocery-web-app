export interface AdminSideMenuInterface {
  name?: string;
  displayName?: string;
  href?: string;
  permission?: string;
  subMenu?: AdminSideMenuInterface[];
}

export default <{ baseUrlGroup: string; menu: AdminSideMenuInterface[] }>{
  baseUrlGroup: "/admin",
  menu: [
    {
      name: "admin.home",
      displayName: "Home",
      href: "",
      permission: "admin_access",
    },
    {
      name: "admin.products",
      displayName: "Products",
      href: "/products",
      permission: "admin_product_access",
    },
  ],
};
