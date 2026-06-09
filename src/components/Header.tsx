"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Shield, LogIn, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Tools" },
  { href: "/features", label: "Features" },
  { href: "/showcase", label: "Showcase" },
];

export default function Header() {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => { setMenuOpen(false); }, [path]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const isActive = (p: string) =>
    path === p ? "border-b-4 border-pink-500" : "";

  return (
    <header className="fixed top-0 w-full z-50 bg-white dark:bg-gray-800 border-b-4 border-black dark:border-gray-600 shadow-comic">
      <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-3 max-w-7xl mx-auto">
        <Link href="/" className="font-display text-lg sm:text-headline-md uppercase italic bg-yellow-400 text-black px-3 sm:px-4 py-2 border-4 border-black shadow-comic -rotate-2 leading-none shrink-0 hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
          SOCIAL TOOLS BY ZA!!
        </Link>

        <div className="hidden md:flex items-center gap-gutter">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className={`text-black dark:text-gray-200 font-body font-bold uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] transition-all ${isActive(l.href)}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin" className="font-body font-bold text-[10px] sm:text-xs uppercase text-yellow-600 hover:text-yellow-800 transition-colors flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span className="hidden sm:inline">Admin</span>
                </Link>
              )}
              <span className="font-body font-bold text-[10px] sm:text-xs text-gray-500 hidden sm:inline max-w-[100px] truncate">{user.name}</span>
              <button onClick={handleLogout} className="font-body font-bold text-[10px] sm:text-xs uppercase text-red-500 hover:text-red-700 transition-colors flex items-center gap-1">
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link href="/login" className="font-body font-bold text-[10px] sm:text-xs uppercase text-black hover:text-cyan-600 transition-colors flex items-center gap-1">
              <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span className="hidden sm:inline">Login</span>
            </Link>
          )}

          {!user && (
            <Link href="/" className="hidden sm:inline-flex bg-cyan-500 text-white border-4 border-black px-4 sm:px-6 py-2 font-body font-bold uppercase text-xs sm:text-sm comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
              GET STARTED
            </Link>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1 border-2 border-black" aria-label="Menu">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t-4 border-black dark:border-gray-600 comic-shadow">
          <div className="px-margin-mobile py-4 space-y-3">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href}
                className={`block font-body font-bold uppercase tracking-widest text-sm py-2 ${isActive(l.href) ? "text-pink-600" : "text-black"}`}>
                {l.label}
              </Link>
            ))}
            <div className="border-t-2 border-black pt-3 mt-3">
              {user ? (
                <div className="space-y-2">
                  <p className="font-body font-bold text-xs text-gray-500">Logged in as <span className="text-black">{user.name}</span></p>
                  {user.role === "admin" && <Link href="/admin" className="block font-body font-bold text-xs uppercase text-yellow-600">Admin Panel</Link>}
                  <button onClick={handleLogout} className="block font-body font-bold text-xs uppercase text-red-500">Logout</button>
                </div>
              ) : (
                <Link href="/login" className="block font-body font-bold text-xs uppercase text-cyan-600">Login</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
