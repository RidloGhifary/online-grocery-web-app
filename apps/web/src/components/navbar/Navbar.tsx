"use client";

import Container from "../Container";
import Logo from "../Logo";
import NavbarItem from "./NavbarItem";

export default function Navbar() {
  return (
    <div className="w-full bg-white">
      <Container>
        <div className="navbar flex w-full items-center justify-between bg-base-100 py-4">
          <Logo />
          <NavbarItem />
        </div>
      </Container>
    </div>
  );
}
