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
        <ul className="nav-links flex justify-center items-center">
          <li>
            <Link href="/" className="text-sm md:text-lg lg:text-xl">
              Home
            </Link>
          </li>
          <li>
            <Link href="/youtube" className="text-sm md:text-lg lg:text-xl">
              YouTube
            </Link>
          </li>
          <li>
            <Link
              href="/customsearch"
              className="text-sm md:text-lg lg:text-xl"
            >
              URL
            </Link>
          </li>
          <li>
            <Link href="/enhanced" className="text-sm md:text-lg lg:text-xl">
              Library
            </Link>
          </li>
          <li>
            <button
              onClick={() => signOut()}
              className="text-sm md:text-base lg:text-lg bg-[1b1818] text-white px-3 py-1 rounded-md hover:text-yellow-200 hover:underline"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
