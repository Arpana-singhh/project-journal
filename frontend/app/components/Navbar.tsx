"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="app-navbar">
      <div className="container app-navbar-inner">
        <Link href="/dashboard" className="app-navbar-brand">
          <span className="app-navbar-logo-badge">PJ</span>
          <span>Project Journal</span>
        </Link>

        <nav className="app-navbar-links">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`app-navbar-link${pathname === href ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}
            <button
              type="button"
              className="app-navbar-logout-btn"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <FiLogOut />
              Logout
            </button>
        </nav>


      </div>
    </header>
  );
}
