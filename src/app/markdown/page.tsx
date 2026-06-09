import type { Metadata } from "next";
import Link from "next/link";
import MarkdownPreviewer from "@/components/MarkdownPreviewer";
import PremiumGate from "@/components/PremiumGate";

export const metadata: Metadata = {
  title: "Markdown Previewer",
  description: "Tulis Markdown, lihat preview HTML secara real-time. Gratis!",
};

export default function MarkdownPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="comic-btn bg-black text-white text-xs !py-1.5 !px-3">← KEMBALI</Link>
        <h1 className="font-display text-headline-md uppercase italic">Markdown Previewer</h1>
      </div>
      <PremiumGate title="Markdown Previewer"><MarkdownPreviewer /></PremiumGate>
    </div>
  );
}
