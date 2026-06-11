"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Shield, LogIn, LogOut, Menu, X, Search, Command } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import LangToggle from "@/components/LangToggle";
import { useLang } from "@/lib/LangContext";
import { useSearch } from "@/lib/SearchContext";
import { t } from "@/lib/translations";

const NAV_KEYS = [
  { href: "/", key: "nav.tools" },
  { href: "/features", key: "nav.features" },
  { href: "/showcase", key: "nav.showcase" },
];

const ALL_TOOLS = [
  { name: "TikTok Downloader", href: "/", tag: "tiktok, video, download, mp4", id: "tiktok" },
  { name: "Remove Background", href: "/", tag: "background, remove, image, photo, bg", id: "removebg" },
  { name: "PDF to Word", href: "/", tag: "pdf, word, convert, document, docx", id: "pdftoword" },
  { name: "OCR Picture to Text", href: "/", tag: "ocr, text, scan, image, extract", id: "ocr" },
  { name: "Picture to PDF", href: "/", tag: "picture, pdf, convert, image, jpg", id: "pictopdf" },
  { name: "Dorking OSINT", href: "/", tag: "osint, dork, search, username, social media", id: "dorking" },
  { name: "JSON Formatter", href: "/", tag: "json, format, validate, code, dev", id: "json" },
  { name: "Quote Generator", href: "/", tag: "quote, story, ig, gen z, comic", id: "quote" },
  { name: "Barber Kalkulator", href: "/", tag: "barber, kalkulator, potong, rambut, hitung", id: "barber" },
  { name: "Photobox Studio", href: "/photobox", tag: "photo, collage, filter, comic, layout", id: "photobox" },
  { name: "Jurnal Finder", href: "/jurnal", tag: "jurnal, scholar, akademik, paper, research", id: "jurnal" },
  { name: "Markdown Previewer", href: "/markdown", tag: "markdown, preview, html, code, dev", id: "markdown" },
  { name: "Linktree Generator", href: "/linktree", tag: "linktree, bio, social, link, ig", id: "linktree" },
];

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const { user, logout } = useAuth();
  const { lang } = useLang();
  const { query, setQuery } = useSearch();
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [path]);

  useEffect(() => { if (menuOpen) setSearchOpen(false); }, [menuOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target as Node)) {
        if (searchOpen) setSearchOpen(false);
        setSearchFocus(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!searchOpen) {
          setSearchOpen(true);
          setTimeout(() => searchInputRef.current?.focus(), 100);
        } else {
          searchInputRef.current?.focus();
        }
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchFocus(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [searchOpen]);

  const filteredTools = query.trim()
    ? ALL_TOOLS.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.tag.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleSearchSelect = (tool: typeof ALL_TOOLS[number]) => {
    setQuery("");
    setSearchFocus(false);
    setSearchOpen(false);
    if (tool.href === "/") {
      document.getElementById(tool.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      router.push(tool.href);
    }
  };

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

        <div className="flex items-center gap-1 sm:gap-3">
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            <LangToggle />
            <ThemeToggle />
          </div>
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

          {path === "/" && !menuOpen && (
            <button onClick={() => { setSearchOpen(p => !p); if (!searchOpen) setTimeout(() => searchInputRef.current?.focus(), 150); }}
              className="p-1.5 border-2 border-black hover:bg-gray-100 transition-colors" aria-label="Search" title="Cari tools (Ctrl+K)">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1 border-2 border-black" aria-label="Menu">
            {menuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </nav>

      {/*** SEARCH PANEL (all screens) ***/}
      {path === "/" && searchOpen && (
        <div ref={searchPanelRef} className="border-t-4 border-black bg-white dark:bg-gray-800 comic-shadow">
          <div className="px-margin-mobile md:px-margin-desktop py-3 md:py-4 max-w-3xl md:mx-auto">
            <div className="flex items-center border-4 border-black bg-white dark:bg-gray-700">
              <span className="flex items-center px-3 md:px-4 bg-gray-100 dark:bg-gray-600 border-r-4 border-black shrink-0">
                <Search className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Cari tools... (Ctrl+K)"
                className="flex-1 px-3 md:px-4 py-2.5 md:py-3 font-body font-bold text-sm md:text-base outline-none bg-white dark:bg-gray-700 text-black dark:text-white min-w-0"
              />
              {query && (
                <button onClick={() => setQuery("")} className="px-2 md:px-3 text-gray-400 hover:text-black dark:hover:text-white text-lg md:text-xl font-bold">&times;</button>
              )}
              <span className="hidden sm:flex px-2 md:px-3 text-[10px] text-gray-300 dark:text-gray-500 font-body items-center gap-0.5 whitespace-nowrap">
                <Command className="w-3 h-3" />K
              </span>
            </div>
            {query.trim() && (
              <div className="mt-1 bg-white dark:bg-gray-700 border-4 border-black max-h-[300px] overflow-y-auto divide-y-2 divide-gray-100 dark:divide-gray-600">
                {filteredTools.length > 0 ? filteredTools.map(tool => (
                  <button key={tool.id} onClick={() => handleSearchSelect(tool)}
                    className="w-full text-left px-3 md:px-4 py-2.5 md:py-3 font-body font-bold text-sm md:text-base hover:bg-yellow-100 dark:hover:bg-yellow-900 transition-colors flex items-center gap-2"
                  >
                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-black dark:text-white">{tool.name}</span>
                    <span className="text-[10px] md:text-xs text-gray-400 uppercase ml-auto">{tool.tag.split(",")[0]}</span>
                  </button>
                )) : (
                  <p className="px-3 md:px-4 py-3 font-body font-bold text-xs md:text-sm text-gray-400">Tidak ada tool yang cocok</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t-4 border-black dark:border-gray-600 comic-shadow">
          <div className="px-margin-mobile py-4 space-y-3">
            {path === "/" && (
              <div className="pb-3 border-b-2 border-gray-300 dark:border-gray-600">
                <div className="flex items-center border-4 border-black bg-white dark:bg-gray-700">
                  <span className="flex items-center px-2 bg-gray-100 dark:bg-gray-600 border-r-4 border-black shrink-0">
                    <Search className="w-4 h-4 text-gray-500" />
                  </span>
                  <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="Cari tools..."
                    className="flex-1 px-2 py-2 font-body font-bold text-xs outline-none bg-white dark:bg-gray-700 text-black dark:text-white min-w-0"
                  />
                  {query && <button onClick={() => setQuery("")} className="px-1 text-gray-400 text-sm font-bold">&times;</button>}
                </div>
                {query.trim() && (
                  <div className="mt-1 max-h-[200px] overflow-y-auto">
                    {filteredTools.length > 0 ? filteredTools.map(tool => (
                      <button key={tool.id} onClick={() => handleSearchSelect(tool)}
                        className="w-full text-left px-2 py-1.5 font-body font-bold text-xs hover:bg-yellow-100 dark:hover:bg-yellow-900 transition-colors flex items-center gap-2 text-black dark:text-white">
                        <Search className="w-3 h-3 text-gray-400 shrink-0" />
                        {tool.name}
                      </button>
                    )) : <p className="px-2 py-1 text-[10px] text-gray-400">Tidak ada tool yang cocok</p>}
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 pb-3 border-b-2 border-gray-300 dark:border-gray-600">
              <span className="font-body text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 mr-auto">Pengaturan</span>
              <LangToggle />
              <ThemeToggle />
            </div>
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
