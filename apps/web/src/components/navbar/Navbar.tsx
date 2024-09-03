"use client";

import { IoMenu } from "react-icons/io5";

import Container from "../Container";
import Logo from "../Logo";
import NavbarItem from "./NavbarItem";
import { useState, useEffect } from "react";
import { UserProps } from "@/interface/user";
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  user?: UserProps;
}

export default function Navbar({ user }: NavbarProps) {
  const { cartItemCount } = useCart();
  const [showNavbar, setShowNavbar] = useState<boolean>(false);

  return (
    <div className="w-full bg-white">
      <Container>
        <div className="navbar flex w-full items-center justify-between bg-base-100 py-4">
          <div className="flex-1">
            <Logo />
          </div>

          <div className="flex md:hidden">
            <IoMenu
              size={35}
              onClick={() => setShowNavbar(!showNavbar)}
              className="ml-3 cursor-pointer text-slate-500 transition hover:scale-105 hover:text-black"
            />

            <div
              className={`absolute bottom-0 left-0 top-0 z-50 h-screen w-1/2 border-r bg-white p-4 ${showNavbar ? "translate-x-0" : "-translate-x-full"} transition`}
            >
              <Logo />
              <NavbarItem user={user} cartItemCount={cartItemCount} />
            </div>
          </div>

          <div className="hidden flex-1 justify-end md:flex">
            <NavbarItem user={user} cartItemCount={cartItemCount} />
          </div>
        </div>
      </Container>
    </div>
  );
}
