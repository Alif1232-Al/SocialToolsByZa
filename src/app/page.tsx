"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { RotateCcw, Search, X } from "lucide-react";
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

const subTools = [
  { href: "/photobox", icon: "🎨", titleKey: "subtools.photobox", descKey: "subtools.photoboxDesc", bg: "from-purple-400 via-pink-300 to-yellow-200" },
  { href: "/jurnal", icon: "🔍", titleKey: "subtools.jurnal", descKey: "subtools.jurnalDesc", bg: "from-blue-400 via-cyan-300 to-teal-200" },
  { href: "/markdown", icon: "📝", titleKey: "subtools.markdown", descKey: "subtools.markdownDesc", bg: "from-yellow-300 via-orange-200 to-red-200" },
  { href: "/linktree", icon: "🔗", titleKey: "subtools.linktree", descKey: "subtools.linktreeDesc", bg: "from-green-300 via-emerald-200 to-teal-200" },
];

const TOOL_FILTER_MAP: Record<string, string> = {
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

  const q = query.toLowerCase().trim();

  const handleResetAll = () => {
    setResetCount((c) => c + 1);
    toast.success("Semua tool sudah direset!");
  };

  const showTool = (id: string, keywords: string) => {
    if (!q) return true;
    return id.includes(q) || keywords.includes(q) || t(`f.${id}.title`, lang).toLowerCase().includes(q);
  };

  return (
    <>
      <PromoPopup />
      <HeroSection />

      {q && (
        <div className="mb-4 bg-cyan-500 border-4 border-black px-4 py-2 flex items-center gap-2">
          <Search className="w-4 h-4 text-white shrink-0" />
          <span className="font-body font-bold text-xs uppercase text-white">
            Filter: &quot;{q}&quot;
          </span>
        </div>
      )}

      <div className="flex items-center justify-end mb-4">
        <button onClick={handleResetAll} className="comic-btn bg-gray-200 text-black border-2 border-black text-xs flex items-center gap-1.5 !py-1.5 !px-3 hover:bg-gray-300 transition-all">
          <RotateCcw className="w-3.5 h-3.5" /> Reset Semua Tool
        </button>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
        <div id="tiktok" className={`break-inside-avoid mb-6 ${showTool("tiktok", TOOL_FILTER_MAP.tiktok) ? "" : "hidden"}`}>
          <LazyLoadWrapper><ErrorBoundary><PremiumGate title={t("f.tiktok.title", lang)}><TikTokDownloader key={`tiktok-${resetCount}`} /></PremiumGate></ErrorBoundary></LazyLoadWrapper>
        </div>
        <div id="removebg" className={`break-inside-avoid mb-6 ${showTool("removebg", TOOL_FILTER_MAP.removebg) ? "" : "hidden"}`}>
          <LazyLoadWrapper><ErrorBoundary><PremiumGate title={t("f.removebg.title", lang)}><RemoveBackground key={`removebg-${resetCount}`} /></PremiumGate></ErrorBoundary></LazyLoadWrapper>
        </div>
        <div id="pdftoword" className={`break-inside-avoid mb-6 ${showTool("pdftoword", TOOL_FILTER_MAP.pdftoword) ? "" : "hidden"}`}>
          <LazyLoadWrapper><ErrorBoundary><PremiumGate title={t("f.pdftoword.title", lang)}><PdfToWord key={`pdftoword-${resetCount}`} /></PremiumGate></ErrorBoundary></LazyLoadWrapper>
        </div>
        <div id="ocr" className={`break-inside-avoid mb-6 ${showTool("ocr", TOOL_FILTER_MAP.ocr) ? "" : "hidden"}`}>
          <LazyLoadWrapper><ErrorBoundary><PremiumGate title={t("f.ocr.title", lang)}><OcrPictureToText key={`ocr-${resetCount}`} /></PremiumGate></ErrorBoundary></LazyLoadWrapper>
        </div>
        <div id="pictopdf" className={`break-inside-avoid mb-6 ${showTool("pictopdf", TOOL_FILTER_MAP.pictopdf) ? "" : "hidden"}`}>
          <LazyLoadWrapper><ErrorBoundary><PremiumGate title={t("f.pictopdf.title", lang)}><PictureToPdf key={`pictopdf-${resetCount}`} /></PremiumGate></ErrorBoundary></LazyLoadWrapper>
        </div>
        <div id="dorking" className={`break-inside-avoid mb-6 ${showTool("dorking", TOOL_FILTER_MAP.dorking) ? "" : "hidden"}`}>
          <LazyLoadWrapper><ErrorBoundary><PremiumGate title={t("f.dorking.title", lang)}><Dorking key={`dorking-${resetCount}`} /></PremiumGate></ErrorBoundary></LazyLoadWrapper>
        </div>
        <div id="json" className={`break-inside-avoid mb-6 ${showTool("json", TOOL_FILTER_MAP.json) ? "" : "hidden"}`}>
          <LazyLoadWrapper><ErrorBoundary><PremiumGate title={t("f.json.title", lang)}><JsonFormatter key={`json-${resetCount}`} /></PremiumGate></ErrorBoundary></LazyLoadWrapper>
        </div>
        <div id="quote" className={`break-inside-avoid mb-6 ${showTool("quote", TOOL_FILTER_MAP.quote) ? "" : "hidden"}`}>
          <LazyLoadWrapper><ErrorBoundary><PremiumGate title={t("f.quote.title", lang)}><QuoteGenerator key={`quote-${resetCount}`} /></PremiumGate></ErrorBoundary></LazyLoadWrapper>
        </div>
        <div id="barber" className={`break-inside-avoid mb-6 ${showTool("barber", TOOL_FILTER_MAP.barber) ? "" : "hidden"}`}>
          <LazyLoadWrapper><ErrorBoundary><PremiumGate title={t("f.barber.title", lang)}><BarberCalculator key={`barber-${resetCount}`} /></PremiumGate></ErrorBoundary></LazyLoadWrapper>
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 mt-2">
        {subTools.map((st) => (
          <div key={st.href} className={`break-inside-avoid mb-6 ${!q || t(st.titleKey, lang).toLowerCase().includes(q) || t(st.descKey, lang).toLowerCase().includes(q) ? "" : "hidden"}`}>
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
