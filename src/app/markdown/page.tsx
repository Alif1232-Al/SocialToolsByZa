import type { Metadata } from "next";
import Link from "next/link";
import MarkdownPreviewer from "@/components/MarkdownPreviewer";

export const metadata: Metadata = {
  title: "Markdown Previewer",
  description: "Tulis Markdown, lihat preview HTML secara real-time. Gratis!",
};

export default function MarkdownPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <Link href="/" className="comic-btn bg-black text-white text-[10px] sm:text-xs !py-1.5 !px-3 self-start">← KEMBALI</Link>
        <h1 className="font-display text-headline-md uppercase italic">Markdown Previewer</h1>
      </div>
      <MarkdownPreviewer />
    </div>
  );
}
