import type { Metadata } from "next";
import Link from "next/link";
import LinktreeGenerator from "@/components/LinktreeGenerator";

export const metadata: Metadata = {
  title: "Linktree Generator",
  description: "Buat halaman linktree pribadi dengan 15+ platform sosial media. Gratis!",
};

export default function LinktreePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="comic-btn bg-black text-white text-xs !py-1.5 !px-3">← KEMBALI</Link>
        <h1 className="font-display text-headline-md uppercase italic">Linktree Generator</h1>
      </div>
      <LinktreeGenerator />
    </div>
  );
}
