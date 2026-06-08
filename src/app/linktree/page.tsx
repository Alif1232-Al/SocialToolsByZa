import type { Metadata } from "next";
import Link from "next/link";
import LinktreeGenerator from "@/components/LinktreeGenerator";

export const metadata: Metadata = {
  title: "Linktree Generator",
  description: "Buat halaman linktree pribadi dengan 15+ platform sosial media. Gratis!",
};

export default function LinktreePage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <Link href="/" className="comic-btn bg-black text-white text-[10px] sm:text-xs !py-1.5 !px-3 self-start">← KEMBALI</Link>
        <h1 className="font-display text-headline-md uppercase italic">Linktree Generator</h1>
      </div>
      <LinktreeGenerator />
    </div>
  );
}
