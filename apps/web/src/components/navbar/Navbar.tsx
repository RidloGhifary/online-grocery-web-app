"use client";

import Container from "../Container";
import Logo from "../Logo";
import NavbarItem from "./NavbarItem";

export default function Navbar() {
  return (
    <div className="w-full bg-white">
      <Container>
        <div className="navbar flex w-full items-center justify-between bg-base-100 py-4">
          <div className="flex-1">
            <Logo />
          </div>
          <div className="flex flex-1 justify-center">
            <input
              type="text"
              placeholder="Search"
              className="input input-sm input-bordered w-full max-w-xs"
            />
          </div>
          <div className="flex flex-1 justify-end">
            <NavbarItem />
          </div>
        </div>
      </Container>
    </div>
  );
}
