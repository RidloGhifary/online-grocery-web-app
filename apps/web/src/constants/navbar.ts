import { IoCart } from "react-icons/io5";
import { LuLogIn } from "react-icons/lu";
import { FiSearch } from "react-icons/fi";
import { FaUser, FaStore, } from "react-icons/fa";
import { BiSolidCoupon } from "react-icons/bi";
import { IoMdCreate } from "react-icons/io";
import {  MdSpaceDashboard } from "react-icons/md";

export const AdminNavbarItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: MdSpaceDashboard,
  },
  {
    name: "Add Store",
    href: "/admin/stores?actions=create-store",
    icon: FaStore,
  },
];

export const NavbarItems = [
  {
    name: "Search",
    href: "/products",
    icon: FiSearch,
  },
  {
    name: "Login",
    href: "/login",
    icon: LuLogIn,
  },
  {
    name: "Register",
    href: "/register",
    icon: LuLogIn,
  },
];

export const NavbarItemAuth = [
  {
    name: "Search",
    href: "/products",
    icon: FiSearch,
  },
  {
    name: "Vouchers",
    href: "/my-vouchers",
    icon: BiSolidCoupon,
  },
  {
    name: "Cart",
    href: "/cart",
    icon: IoCart,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: FaUser,
  },
];

export const ProfileDropDownItems = [
  {
    name: "Profile",
    href: "/user/settings",
    requireAuth: true,
    icon: FaUser,
  }
];

export const ProfileDropDownSuperAdminItems = [
  {
    name: "Profile",
    href: "/user/settings",
    requireAuth: true,
    icon: FaUser,
  },
  {
    name: "My Store",
    href: "/my-store",
    requireAuth: true,
    icon: FaStore,
  },
  {
    name: "Create Store",
    href: "/create-store",
    requireAuth: true,
    icon: IoMdCreate,
  },
];