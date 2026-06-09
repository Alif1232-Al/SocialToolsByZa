"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Shield, LogIn, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import LangToggle from "@/components/LangToggle";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";

const NAV_KEYS = [
  { href: "/", key: "nav.tools" },
  { href: "/features", key: "nav.features" },
  { href: "/showcase", key: "nav.showcase" },
];

export default function Header() {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { lang } = useLang();

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
          {NAV_KEYS.map((l) => (
            <Link key={l.href} href={l.href}
              className={`text-black dark:text-gray-200 font-body font-bold uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] transition-all ${isActive(l.href)}`}>
              {t(l.key, lang)}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangToggle />
          <ThemeToggle />
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin" className="font-body font-bold text-[10px] sm:text-xs uppercase text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 transition-colors flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span className="hidden sm:inline">{t("nav.admin", lang)}</span>
                </Link>
              )}
              <span className="font-body font-bold text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hidden sm:inline max-w-[100px] truncate">{user.name}</span>
              <button onClick={handleLogout} className="font-body font-bold text-[10px] sm:text-xs uppercase text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors flex items-center gap-1">
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span className="hidden sm:inline">{t("nav.logout", lang)}</span>
              </button>
            </>
          ) : (
            <Link href="/login" className="font-body font-bold text-[10px] sm:text-xs uppercase text-black dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1">
              <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span className="hidden sm:inline">{t("nav.login", lang)}</span>
            </Link>
          )}

          {!user && (
            <Link href="/" className="hidden sm:inline-flex bg-cyan-500 text-white border-4 border-black px-4 sm:px-6 py-2 font-body font-bold uppercase text-xs sm:text-sm comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
              {t("nav.getStarted", lang)}
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
            {NAV_KEYS.map((l) => (
              <Link key={l.href} href={l.href}
                className={`block font-body font-bold uppercase tracking-widest text-sm py-2 dark:text-gray-200 ${isActive(l.href) ? "text-pink-600" : "text-black"}`}>
                {t(l.key, lang)}
              </Link>
            ))}
            <div className="border-t-2 border-black dark:border-gray-600 pt-3 mt-3">
              {user ? (
                <div className="space-y-2">
                  <p className="font-body font-bold text-xs text-gray-500 dark:text-gray-400">{t("nav.loggedInAs", lang)} <span className="text-black dark:text-gray-100">{user.name}</span></p>
                  {user.role === "admin" && <Link href="/admin" className="block font-body font-bold text-xs uppercase text-yellow-600 dark:text-yellow-400">{t("nav.admin", lang)}</Link>}
                  <button onClick={handleLogout} className="block font-body font-bold text-xs uppercase text-red-500 dark:text-red-400">{t("nav.logout", lang)}</button>
                </div>
              ) : (
                <Link href="/login" className="block font-body font-bold text-xs uppercase text-cyan-600">{t("nav.login", lang)}</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
