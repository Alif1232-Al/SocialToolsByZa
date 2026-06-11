"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { Lock, MessageCircle, CreditCard, Crown, Zap, User, LogIn } from "lucide-react";
import { getRemaining, getLimit, isPremium, isLoggedIn, ToolId } from "@/lib/credits";

interface Props {
  toolId: ToolId;
  toolName: string;
  limitReached: boolean;
  children: ReactNode;
}

function LimitLabel({ limit, premium }: { limit: number; premium: boolean }) {
  if (premium) return "♾️ Unlimited";
  if (limit >= 999) return "♾️ Unlimited";
  return `${limit}/hari`;
}

export default function CreditGate({ toolId, toolName, limitReached, children }: Props) {
  const remaining = getRemaining(toolId);
  const limit = getLimit(toolId);
  const premium = isPremium();
  const loggedIn = isLoggedIn();

  if (!limitReached) {
    return (
      <div className="relative">
        <div className="absolute -top-2 right-2 z-10 flex items-center gap-1">
          <span className={`border-2 border-black px-1.5 py-0.5 text-[8px] font-body font-bold uppercase tracking-wider ${
            premium ? "bg-green-500 text-white" : "bg-gray-800 text-white"
          }`}>
            <LimitLabel limit={limit} premium={premium} />
          </span>
          {!premium && limit < 999 && (
            <span className={`border-2 border-black px-1.5 py-0.5 text-[8px] font-body font-bold uppercase tracking-wider ${
              remaining <= 1 ? "bg-red-500 text-white" : "bg-yellow-400 text-black"
            }`}>
              {remaining === 0 ? "Habis" : `Sisa ${remaining}`}
            </span>
          )}
        </div>
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

        <div className="bg-gray-800 border-2 border-gray-600 rounded p-3 w-full max-w-xs space-y-1.5 text-left">
          <p className="font-body font-bold text-[10px] uppercase text-gray-400 text-center tracking-wider">Kredit Hari Ini</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1"><User className="w-3 h-3" /> Guest</span>
            <span className="text-white font-bold">{loggedIn ? "—" : "2 /hari"}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1"><LogIn className="w-3 h-3" /> Login</span>
            <span className="text-white font-bold">{loggedIn ? "5 /hari" : "—"}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1"><Crown className="w-3 h-3" /> Premium</span>
            <span className="text-green-400 font-bold">♾️ Unlimited</span>
          </div>
        </div>

        <p className="font-body text-sm text-gray-300 max-w-xs">
          Kredit gratis reset tiap hari. Atau ambil <strong>Premium Rp15rb/bulan</strong> — unlimited semua tools.
        </p>
        <Link
          href="/payment"
          className="bg-yellow-400 text-black border-4 border-black px-6 py-3 font-body font-bold uppercase text-sm comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
        >
          <CreditCard className="w-5 h-5" /> BAYAR 15RB
        </Link>
        <Link
          href={loggedIn ? "/pricing" : "/register"}
          className="text-[11px] text-gray-400 hover:text-white underline underline-offset-2 transition-colors flex items-center gap-1"
        >
          {loggedIn ? "Lihat paket Premium" : "Buat akun dulu — gratis"}
        </Link>
      </div>
    </div>
  );
}
