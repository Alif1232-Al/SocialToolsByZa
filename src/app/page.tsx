"use client";
import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import ErrorBoundary from "@/components/ErrorBoundary";
import PremiumGate from "@/components/PremiumGate";
import PromoPopup from "@/components/PromoPopup";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";

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

export default function Home() {
  const { lang } = useLang();
  return (
    <>
      <PromoPopup />
      <HeroSection />

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
        <div className="break-inside-avoid mb-6">
          <ErrorBoundary><PremiumGate title="TikTok Downloader"><TikTokDownloader /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid mb-6">
          <ErrorBoundary><PremiumGate title="Remove Background"><RemoveBackground /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid mb-6">
          <ErrorBoundary><PremiumGate title="PDF to Word"><PdfToWord /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid mb-6">
          <ErrorBoundary><PremiumGate title="OCR Picture to Text"><OcrPictureToText /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid mb-6">
          <ErrorBoundary><PremiumGate title="Picture to PDF"><PictureToPdf /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid mb-6">
          <ErrorBoundary><PremiumGate title="Dorking OSINT"><Dorking /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid mb-6">
          <ErrorBoundary><PremiumGate title="JSON Formatter"><JsonFormatter /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid mb-6">
          <ErrorBoundary><PremiumGate title="Quote Generator"><QuoteGenerator /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid mb-6">
          <ErrorBoundary><PremiumGate title="Barber Kalkulator"><BarberCalculator /></PremiumGate></ErrorBoundary>
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 mt-2">
        {subTools.map((st) => (
          <div key={st.href} className="break-inside-avoid mb-6">
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
