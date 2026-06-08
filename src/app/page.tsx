import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import ErrorBoundary from "@/components/ErrorBoundary";
import PremiumGate from "@/components/PremiumGate";

const TikTokDownloader = dynamic(() => import("@/components/TikTokDownloader"), { ssr: false });
const PdfToWord = dynamic(() => import("@/components/PdfToWord"), { ssr: false });
const Dorking = dynamic(() => import("@/components/Dorking"), { ssr: false });
const JurnalFinder = dynamic(() => import("@/components/JurnalFinder"), { ssr: false });
const RemoveBackground = dynamic(() => import("@/components/RemoveBackground"), { ssr: false });
const OcrPictureToText = dynamic(() => import("@/components/OcrPictureToText"), { ssr: false });
const PictureToPdf = dynamic(() => import("@/components/PictureToPdf"), { ssr: false });
const JsonFormatter = dynamic(() => import("@/components/JsonFormatter"), { ssr: false });
const MarkdownPreviewer = dynamic(() => import("@/components/MarkdownPreviewer"), { ssr: false });
const QuoteGenerator = dynamic(() => import("@/components/QuoteGenerator"), { ssr: false });

export default function Home() {
  return (
    <>
      <HeroSection />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" style={{ contentVisibility: "auto" }}>
        <ErrorBoundary>
          <PremiumGate title="TikTok Downloader"><TikTokDownloader /></PremiumGate>
        </ErrorBoundary>
        <ErrorBoundary>
          <PremiumGate title="Remove Background"><RemoveBackground /></PremiumGate>
        </ErrorBoundary>
        <ErrorBoundary>
          <PremiumGate title="PDF to Word"><PdfToWord /></PremiumGate>
        </ErrorBoundary>
        <ErrorBoundary>
          <PremiumGate title="OCR Picture to Text"><OcrPictureToText /></PremiumGate>
        </ErrorBoundary>
        <ErrorBoundary>
          <PremiumGate title="Jurnal Finder"><JurnalFinder /></PremiumGate>
        </ErrorBoundary>
        <ErrorBoundary>
          <PremiumGate title="Picture to PDF"><PictureToPdf /></PremiumGate>
        </ErrorBoundary>
        <ErrorBoundary>
          <PremiumGate title="Dorking OSINT"><Dorking /></PremiumGate>
        </ErrorBoundary>
        <ErrorBoundary>
          <PremiumGate title="JSON Formatter"><JsonFormatter /></PremiumGate>
        </ErrorBoundary>
        <ErrorBoundary>
          <PremiumGate title="Markdown Previewer"><MarkdownPreviewer /></PremiumGate>
        </ErrorBoundary>
        <ErrorBoundary>
          <PremiumGate title="Quote Generator"><QuoteGenerator /></PremiumGate>
        </ErrorBoundary>
      </div>
    </>
  );
}
