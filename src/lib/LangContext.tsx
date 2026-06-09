"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Lang } from "./translations";

const LangContext = createContext<{ lang: Lang; toggle: () => void }>({ lang: "id", toggle: () => {} });

export function useLang() { return useContext(LangContext); }

export default function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("id");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored) setLang(stored);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Lang = lang === "id" ? "en" : "id";
    setLang(next);
    try { localStorage.setItem("lang", next); } catch (e) {}
  };

  if (!mounted) return <>{children}</>;

  return (
    <LangContext.Provider value={{ lang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}
