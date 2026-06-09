import type { Metadata } from "next";
import Link from "next/link";
import Photobox from "@/components/Photobox";
import PremiumGate from "@/components/PremiumGate";

export const metadata: Metadata = {
  title: "Photobox Comic Studio",
  description: "Upload 1-6 foto, pilih layout & filter komik, download collage. Gratis!",
};

export default function PhotoboxPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="comic-btn bg-black text-white text-xs !py-1.5 !px-3">← KEMBALI</Link>
        <h1 className="font-display text-headline-md uppercase italic">Photobox Comic Studio</h1>
      </div>
      <PremiumGate title="Photobox Comic Studio"><Photobox /></PremiumGate>
    </div>
  );
}
