import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import ErrorBoundary from "@/components/ErrorBoundary";
import PremiumGate from "@/components/PremiumGate";

const TikTokDownloader = dynamic(() => import("@/components/TikTokDownloader"), { ssr: false });
const PdfToWord = dynamic(() => import("@/components/PdfToWord"), { ssr: false });
const Photobox = dynamic(() => import("@/components/Photobox"), { ssr: false });
const Dorking = dynamic(() => import("@/components/Dorking"), { ssr: false });
const RemoveBackground = dynamic(() => import("@/components/RemoveBackground"), { ssr: false });
const OcrPictureToText = dynamic(() => import("@/components/OcrPictureToText"), { ssr: false });
const PictureToPdf = dynamic(() => import("@/components/PictureToPdf"), { ssr: false });
const JsonFormatter = dynamic(() => import("@/components/JsonFormatter"), { ssr: false });
const MarkdownPreviewer = dynamic(() => import("@/components/MarkdownPreviewer"), { ssr: false });
const QuoteGenerator = dynamic(() => import("@/components/QuoteGenerator"), { ssr: false });
const LinktreeGenerator = dynamic(() => import("@/components/LinktreeGenerator"), { ssr: false });
const BarberCalculator = dynamic(() => import("@/components/BarberCalculator"), { ssr: false });

export default function Home() {
  return (
    <>
      <HeroSection />

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        <div className="break-inside-avoid">
          <ErrorBoundary><PremiumGate title="Photobox Comic Studio"><Photobox /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid">
          <ErrorBoundary><PremiumGate title="TikTok Downloader"><TikTokDownloader /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid">
          <ErrorBoundary><PremiumGate title="Remove Background"><RemoveBackground /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid">
          <ErrorBoundary><PremiumGate title="PDF to Word"><PdfToWord /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid">
          <ErrorBoundary><PremiumGate title="OCR Picture to Text"><OcrPictureToText /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid">
          <ErrorBoundary><PremiumGate title="Picture to PDF"><PictureToPdf /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid">
          <ErrorBoundary><PremiumGate title="Dorking OSINT"><Dorking /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid">
          <ErrorBoundary><PremiumGate title="JSON Formatter"><JsonFormatter /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid">
          <ErrorBoundary><PremiumGate title="Markdown Previewer"><MarkdownPreviewer /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid">
          <ErrorBoundary><PremiumGate title="Quote Generator"><QuoteGenerator /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid">
          <ErrorBoundary><PremiumGate title="Linktree Generator"><LinktreeGenerator /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid">
          <ErrorBoundary><PremiumGate title="Barber Kalkulator"><BarberCalculator /></PremiumGate></ErrorBoundary>
        </div>
        <div className="break-inside-avoid">
          <a href="/jurnal" className="block comic-panel bg-gradient-to-br from-blue-400 via-cyan-300 to-teal-200 hover:scale-[1.02] transition-transform cursor-pointer group">
            <div className="comic-badge -top-3 -right-3 rotate-12 bg-black text-white">FULL PAGE</div>
            <div className="flex flex-col items-center justify-center text-center py-8 px-4">
              <span className="text-4xl mb-2">🔍</span>
              <h3 className="font-display text-headline-md uppercase italic group-hover:underline">Jurnal Finder</h3>
              <p className="font-body text-body-md text-gray-700 mt-2">Cari jurnal akademik dari Google Scholar</p>
              <span className="mt-3 comic-btn bg-black text-white text-xs !py-1.5 !px-4">BUKA →</span>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
