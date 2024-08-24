import { FaUser } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { PiStorefrontFill } from "react-icons/pi";

export const NavbarItems = [
  {
    requireAuth: [
      {
        name: "Cart",
        href: "/cart",
      },
      {
        name: "Profile",
        href: "/profile",
      },
    ],
  },
  {
    name: "Cart",
    href: "/cart",
  },
  {
    name: "Login",
    href: "/login",
  },
  {
    name: "Register",
    href: "/register",
  },
];

export const ProfileDropDownItems = [
  {
    name: "Profile",
    href: "/profile",
    requireAuth: true,
    icon: FaUser,
  },
  {
    name: "My Store",
    href: "/my-store",
    requireAuth: true,
    icon: PiStorefrontFill,
  },
  {
    name: "Logout",
    href: "/logout",
    requireAuth: true,
    icon: LuLogOut,
  },
];
