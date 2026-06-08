import type { Metadata } from "next";
import Link from "next/link";
import Photobox from "@/components/Photobox";

export const metadata: Metadata = {
  title: "Photobox Comic Studio",
  description: "Upload 1-6 foto, pilih layout & filter komik, download collage. Gratis!",
};

export default function PhotoboxPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <Link href="/" className="comic-btn bg-black text-white text-[10px] sm:text-xs !py-1.5 !px-3 self-start">← KEMBALI</Link>
        <h1 className="font-display text-headline-md uppercase italic">Photobox Comic Studio</h1>
      </div>
      <Photobox />
    </div>
  );
}
