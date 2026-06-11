"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { Lock, MessageCircle, CreditCard } from "lucide-react";
import { getRemaining, ToolId } from "@/lib/credits";

interface Props {
  toolId: ToolId;
  toolName: string;
  limitReached: boolean;
  children: ReactNode;
}

export default function CreditGate({ toolId, toolName, limitReached, children }: Props) {
  const remaining = getRemaining(toolId);

  if (!limitReached) {
    return (
      <div className="relative">
        {remaining <= 1 && (
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 bg-red-500 text-white border-2 border-black px-2 py-0.5 text-[9px] font-body font-bold uppercase tracking-wider whitespace-nowrap">
            Sisa {remaining} gratis
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <div className="relative comic-panel bg-gray-900 text-white border-4 border-red-500">
      <div className="comic-badge -top-4 -right-4 rotate-12 bg-red-500 text-white border-2 border-black">HABIS!</div>
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center gap-3">
        <Lock className="w-10 h-10 text-red-400" />
        <h3 className="font-display text-headline-md uppercase italic">{toolName}</h3>
        <p className="font-body text-sm text-gray-300 max-w-xs">
          Gratisan lo udah habis bro! Cuma <strong>15rb/bulan</strong> aja buat akses PREMIUM — unlimited semua tools.
        </p>
        <Link
          href="/payment"
          className="bg-yellow-400 text-black border-4 border-black px-6 py-3 font-body font-bold uppercase text-sm comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
        >
          <CreditCard className="w-5 h-5" /> BAYAR 15RB
        </Link>
        <a
          href="https://wa.me/6285177824235?text=Halo%20Za!%20Saya%20mau%20PREMIUM%20SocialToolsByZa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-gray-400 hover:text-white underline underline-offset-2 transition-colors flex items-center gap-1"
        >
          <MessageCircle className="w-3.5 h-3.5" /> Atau chat WA aja
        </a>
      </div>
    </div>
  );
}
