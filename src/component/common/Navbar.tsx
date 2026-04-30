"use client";

import Link from "next/link";
import { useState } from "react";

/* -------------------- types -------------------- */
type NavLink = {
  label: string;
  link: string;
};

type DesktopViewProps = {
  navLinks: NavLink[];
};

type MobileViewProps = {
  isOpenMenu: boolean;
  toggleMenu: () => void;
};

/* ---------------- DESKTOP VIEW ---------------- */

const DesktopView = ({ navLinks }: DesktopViewProps) => {
  return (
    <nav className="w-full bg-background">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="font-bold text-2xl tracking-tight text-foreground uppercase">
          <Link href={"/"}>Priyanshu</Link>
        </div>

        {navLinks.map((nav) => (
          <div
            key={nav.link}
            className="tracking-widest text-foreground text-lg uppercase hover:underline"
          >
            <Link href={nav.link}>{nav.label}</Link>
          </div>
        ))}
      </div>
    </nav>
  );
};

/* ---------------- MOBILE VIEW ---------------- */

const MobileView = ({ isOpenMenu, toggleMenu }: MobileViewProps) => {
  return (
    <div className="w-full bg-background">
      <div className="flex justify-between items-center px-4 py-3 space-x-1">
        <div className="font-bold text-foreground text-[clamp(2rem,8vw,3.5rem)] tracking-tight uppercase">
          <Link href={"/"}>Priyanshu</Link>
        </div>

        <div className="h-[clamp(4rem,16vw,9rem)] aspect-square bg-foreground flex items-center justify-center">
          <button
            role="button"
            onClick={toggleMenu}
            className="text-[clamp(2rem,8vw,4.4rem)] text-background"
          >
            ☰
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- MAIN NAVBAR ---------------- */

const Navbar = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const navLinks: NavLink[] = [
    { label: "Projects", link: "/projects" },
    { label: "Achievements", link: "/achievements" },
    { label: "Extras", link: "/extras" },
  ];

  function toggleMenu() {
    setIsOpenMenu((prev) => !prev);
  }

  return (
    <header className="pb-px md:pb-0 bg-foreground relative">
      {/* 
        RESPONSIVE BEHAVIOR NOW HANDLED BY TAILWIND (NO JS WIDTH TRACKING)
        - Desktop shows DesktopView
        - Mobile shows MobileView
      */}

      <div className="hidden md:block">
        <DesktopView navLinks={navLinks} />
      </div>

      <div className="block md:hidden">
        <MobileView isOpenMenu={isOpenMenu} toggleMenu={toggleMenu} />
      </div>

      {/* MOBILE MENU OVERLAY (UNCHANGED LOGIC + UI) */}
      <div
        className={`
          absolute left-0 top-full h-[calc(100vh-64px)] w-full bg-background 
          backdrop-blur-md text-foreground z-50 transition-all duration-300
          ${isOpenMenu ? "flex flex-col" : "hidden"} 
          md:hidden 
        `}
      >
        <nav className="flex flex-col p-6 space-y-4">
          {navLinks.map((navigation) => {
            return (
              <Link
                key={navigation.link}
                href={navigation.link}
                onClick={() => setIsOpenMenu(false)}
                className="text-xl font-medium border-b border-foreground pb-4"
              >
                {navigation.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
