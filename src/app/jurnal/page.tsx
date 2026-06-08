import type { Metadata } from "next";
import Link from "next/link";
import JurnalFinder from "@/components/JurnalFinder";

export const metadata: Metadata = {
  title: "Jurnal Finder",
  description: "Cari jurnal akademik dari Google Scholar. Gratis!",
};

export default function JurnalPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="comic-btn bg-black text-white text-xs !py-1.5 !px-3">
          ← KEMBALI
        </Link>
        <h1 className="font-display text-headline-md uppercase italic">Jurnal Finder</h1>
      </div>
      <JurnalFinder />
    </div>
  );
}
