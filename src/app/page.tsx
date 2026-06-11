"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { RotateCcw, Search } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import ErrorBoundary from "@/components/ErrorBoundary";
import PremiumGate from "@/components/PremiumGate";
import PromoPopup from "@/components/PromoPopup";
import LazyLoadWrapper from "@/components/LazyLoadWrapper";

import { useLang } from "@/lib/LangContext";
import { useSearch } from "@/lib/SearchContext";
import { t } from "@/lib/translations";
import toast from "react-hot-toast";

const TikTokDownloader = dynamic(() => import("@/components/TikTokDownloader"), { ssr: false });
const PdfToWord = dynamic(() => import("@/components/PdfToWord"), { ssr: false });
const Dorking = dynamic(() => import("@/components/Dorking"), { ssr: false });
const RemoveBackground = dynamic(() => import("@/components/RemoveBackground"), { ssr: false });
const OcrPictureToText = dynamic(() => import("@/components/OcrPictureToText"), { ssr: false });
const PictureToPdf = dynamic(() => import("@/components/PictureToPdf"), { ssr: false });
const JsonFormatter = dynamic(() => import("@/components/JsonFormatter"), { ssr: false });
const QuoteGenerator = dynamic(() => import("@/components/QuoteGenerator"), { ssr: false });
const BarberCalculator = dynamic(() => import("@/components/BarberCalculator"), { ssr: false });

type Category = {
  id: string;
  labelId: string;
  color: string;
};

const CATEGORIES: Category[] = [
  { id: "all", labelId: "category.all", color: "bg-black text-white" },
  { id: "social", labelId: "category.social", color: "bg-cyan-500 text-white" },
  { id: "image", labelId: "category.image", color: "bg-pink-500 text-white" },
  { id: "document", labelId: "category.document", color: "bg-yellow-400 text-black" },
  { id: "dev", labelId: "category.dev", color: "bg-gray-800 text-white" },
  { id: "osint", labelId: "category.osint", color: "bg-red-500 text-white" },
  { id: "academic", labelId: "category.academic", color: "bg-blue-500 text-white" },
  { id: "fun", labelId: "category.fun", color: "bg-green-500 text-white" },
];

const TOOL_CATEGORIES: Record<string, string> = {
  tiktok: "social",
  removebg: "image",
  pdftoword: "document",
  ocr: "document",
  pictopdf: "image",
  dorking: "osint",
  json: "dev",
  quote: "fun",
  barber: "fun",
  photobox: "image",
  jurnal: "academic",
  markdown: "dev",
  linktree: "social",
};

const subTools = [
  { id: "photobox", href: "/photobox", icon: "🎨", titleKey: "subtools.photobox", descKey: "subtools.photoboxDesc", bg: "from-purple-400 via-pink-300 to-yellow-200" },
  { id: "jurnal", href: "/jurnal", icon: "🔍", titleKey: "subtools.jurnal", descKey: "subtools.jurnalDesc", bg: "from-blue-400 via-cyan-300 to-teal-200" },
  { id: "markdown", href: "/markdown", icon: "📝", titleKey: "subtools.markdown", descKey: "subtools.markdownDesc", bg: "from-yellow-300 via-orange-200 to-red-200" },
  { id: "linktree", href: "/linktree", icon: "🔗", titleKey: "subtools.linktree", descKey: "subtools.linktreeDesc", bg: "from-green-300 via-emerald-200 to-teal-200" },
];

const TOOL_KEYWORDS: Record<string, string> = {
  tiktok: "tiktok video downloader",
  removebg: "remove background image bg hapus",
  pdftoword: "pdf word convert document docx",
  ocr: "ocr text scan picture image extract",
  pictopdf: "picture pdf convert image jpg png",
  dorking: "dorking osint search username social media",
  json: "json format validator code dev",
  quote: "quote generator story ig comic",
  barber: "barber kalkulator potong rambut hitung",
};

export default function Home() {
  const { lang } = useLang();
  const { query } = useSearch();
  const [resetCount, setResetCount] = useState(0);
  const [category, setCategory] = useState("all");

  const q = query.toLowerCase().trim();

  const handleResetAll = () => {
    setResetCount((c) => c + 1);
    toast.success("Semua tool sudah direset!");
  };

  const showTool = (id: string) => {
    const catMatch = category === "all" || TOOL_CATEGORIES[id] === category;
    if (!catMatch) return false;
    if (!q) return true;
    const keywords = TOOL_KEYWORDS[id] || "";
    return id.includes(q) || keywords.includes(q) || t(`f.${id}.title`, lang).toLowerCase().includes(q);
  };

  const showSubTool = (id: string) => {
    const catMatch = category === "all" || TOOL_CATEGORIES[id] === category;
    if (!catMatch) return false;
    if (!q) return true;
    const st = subTools.find(s => s.id === id);
    if (!st) return false;
    return t(st.titleKey, lang).toLowerCase().includes(q) || t(st.descKey, lang).toLowerCase().includes(q);
  };

  const filteredCount = useMemo(() => {
    let count = 0;
    const allIds = ["tiktok", "removebg", "pdftoword", "ocr", "pictopdf", "dorking", "json", "quote", "barber"];
    for (const id of allIds) { if (showTool(id)) count++; }
    for (const st of subTools) { if (showSubTool(st.id)) count++; }
    return count;
  }, [category, q, lang]);

  const activeCat = CATEGORIES.find(c => c.id === category);

  return (
    <>
      <PromoPopup />
      <HeroSection />

      {/*** CATEGORY PILLS ***/}
      <div className="mb-3 overflow-x-auto -mx-margin-mobile md:-mx-0 scrollbar-hide">
        <div className="flex gap-1.5 px-margin-mobile md:px-0 pb-1.5 min-w-max md:flex-wrap md:min-w-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`font-body font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 border-2 border-black transition-all shrink-0 ${
                category === cat.id
                  ? `${cat.color}`
                  : "bg-white text-black/60 hover:text-black hover:bg-gray-100"
              }`}
            >
              {cat.id === "all" ? "All" : t(cat.labelId, lang)}
            </button>
          ))}
        </div>
      </div>

      {/*** FILTER INFO (minimal) ***/}
      {(q || category !== "all") && (
        <div className="mb-3 flex items-center gap-2 text-[10px] font-body font-bold text-gray-500 uppercase">
          <Search className="w-3 h-3" />
          <span>
            {q ? `"${q}"` : t(activeCat!.labelId, lang)}
            {q && category !== "all" ? ` + ${t(activeCat!.labelId, lang)}` : ""}
          </span>
          <span className="text-gray-300 mx-0.5">·</span>
          <span>{filteredCount} tool{filteredCount !== 1 ? "s" : ""}</span>
          {q && (
            <>
              <span className="text-gray-300 mx-0.5">·</span>
              <span className="text-gray-400">ESC reset</span>
            </>
          )}
        </div>
      )}

      <div className="flex items-center justify-end mb-4">
        <button onClick={handleResetAll} className="comic-btn bg-gray-200 text-black border-2 border-black text-xs flex items-center gap-1.5 !py-1.5 !px-3 hover:bg-gray-300 transition-all">
          <RotateCcw className="w-3.5 h-3.5" /> Reset Semua Tool
        </button>
      </div>

      {/*** MAIN TOOLS ***/}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
        <div id="tiktok" className={`break-inside-avoid mb-6 ${showTool("tiktok") ? "" : "hidden"}`}>
          <LazyLoadWrapper><ErrorBoundary><PremiumGate title={t("f.tiktok.title", lang)}><TikTokDownloader key={`tiktok-${resetCount}`} /></PremiumGate></ErrorBoundary></LazyLoadWrapper>
        </div>
        <div id="removebg" className={`break-inside-avoid mb-6 ${showTool("removebg") ? "" : "hidden"}`}>
          <LazyLoadWrapper><ErrorBoundary><PremiumGate title={t("f.removebg.title", lang)}><RemoveBackground key={`removebg-${resetCount}`} /></PremiumGate></ErrorBoundary></LazyLoadWrapper>
        </div>
        <div id="pdftoword" className={`break-inside-avoid mb-6 ${showTool("pdftoword") ? "" : "hidden"}`}>
          <LazyLoadWrapper><ErrorBoundary><PremiumGate title={t("f.pdftoword.title", lang)}><PdfToWord key={`pdftoword-${resetCount}`} /></PremiumGate></ErrorBoundary></LazyLoadWrapper>
        </div>
        <div id="ocr" className={`break-inside-avoid mb-6 ${showTool("ocr") ? "" : "hidden"}`}>
          <LazyLoadWrapper><ErrorBoundary><PremiumGate title={t("f.ocr.title", lang)}><OcrPictureToText key={`ocr-${resetCount}`} /></PremiumGate></ErrorBoundary></LazyLoadWrapper>
        </div>
        <div id="pictopdf" className={`break-inside-avoid mb-6 ${showTool("pictopdf") ? "" : "hidden"}`}>
          <LazyLoadWrapper><ErrorBoundary><PremiumGate title={t("f.pictopdf.title", lang)}><PictureToPdf key={`pictopdf-${resetCount}`} /></PremiumGate></ErrorBoundary></LazyLoadWrapper>
        </div>
        <div id="dorking" className={`break-inside-avoid mb-6 ${showTool("dorking") ? "" : "hidden"}`}>
          <LazyLoadWrapper><ErrorBoundary><PremiumGate title={t("f.dorking.title", lang)}><Dorking key={`dorking-${resetCount}`} /></PremiumGate></ErrorBoundary></LazyLoadWrapper>
        </div>
        <div id="json" className={`break-inside-avoid mb-6 ${showTool("json") ? "" : "hidden"}`}>
          <LazyLoadWrapper><ErrorBoundary><PremiumGate title={t("f.json.title", lang)}><JsonFormatter key={`json-${resetCount}`} /></PremiumGate></ErrorBoundary></LazyLoadWrapper>
        </div>
        <div id="quote" className={`break-inside-avoid mb-6 ${showTool("quote") ? "" : "hidden"}`}>
          <LazyLoadWrapper><ErrorBoundary><PremiumGate title={t("f.quote.title", lang)}><QuoteGenerator key={`quote-${resetCount}`} /></PremiumGate></ErrorBoundary></LazyLoadWrapper>
        </div>
        <div id="barber" className={`break-inside-avoid mb-6 ${showTool("barber") ? "" : "hidden"}`}>
          <LazyLoadWrapper><ErrorBoundary><PremiumGate title={t("f.barber.title", lang)}><BarberCalculator key={`barber-${resetCount}`} /></PremiumGate></ErrorBoundary></LazyLoadWrapper>
        </div>
      </div>

      {/*** SUB TOOLS (separate pages) ***/}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 mt-2">
        {subTools.map((st) => (
          <div key={st.href} className={`break-inside-avoid mb-6 ${showSubTool(st.id) ? "" : "hidden"}`}>
            <a href={st.href} className={`block comic-panel bg-gradient-to-br ${st.bg} cursor-pointer group`}>
              <div className="comic-badge -top-3 -right-3 rotate-12 bg-black text-white">{t("home.subtools", lang)}</div>
              <div className="flex flex-col items-center justify-center text-center py-8 px-4">
                <span className="text-4xl mb-2">{st.icon}</span>
                <h3 className="font-display text-headline-md uppercase italic group-hover:underline">{t(st.titleKey, lang)}</h3>
                <p className="font-body text-body-md text-gray-700 mt-2">{t(st.descKey, lang)}</p>
                <span className="mt-3 comic-btn bg-black text-white text-xs !py-1.5 !px-4">{t("home.open", lang)}</span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
