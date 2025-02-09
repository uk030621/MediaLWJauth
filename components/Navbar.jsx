"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const Navbar = () => {
  const pathname = usePathname();
  const hideNavbarPaths = ["/register", "/"];

  // Conditionally render Navbar
  if (hideNavbarPaths.includes(pathname)) {
    return null;
  }

  return (
    <header>
      <nav className="navbar">
        {/* 🔹 Scrollable container for horizontal navigation */}
        <div className="nav-links-container">
          <ul className="nav-links flex justify-center items-center">
            <li>
              <Link href="/" className="text-xs md:text-lg lg:text-xl">
                Home
              </Link>
            </li>
            <li>
              <Link href="/youtube" className="text-xs md:text-lg lg:text-xl">
                YouTube
              </Link>
            </li>
            <li>
              <Link
                href="/customsearch"
                className="text-xs md:text-lg lg:text-xl"
              >
                URL
              </Link>
            </li>
            <li>
              <Link href="/enhanced" className="text-xs md:text-lg lg:text-xl">
                Library
              </Link>
            </li>
            <li>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default link behavior
                  signOut(); // Call signOut function
                }}
                className="text-xs md:text-lg lg:text-xl cursor-pointer"
              >
                Exit
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
