"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Crown, LogOut, CreditCard, CheckCircle, XCircle, Calendar } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { getRemaining, getLimit, isPremium, isLoggedIn, ToolId } from "@/lib/credits";

const TOOL_NAMES: Record<string, string> = {
  tiktok: "TikTok Downloader", removebg: "Remove Background", pdftoword: "PDF to Word",
  ocr: "OCR Picture to Text", pictopdf: "Picture to PDF", dorking: "Dorking OSINT",
  jurnal: "Jurnal Finder", barber: "Barber Kalkulator", markdown: "Markdown Previewer",
  linktree: "Linktree Generator", photobox: "Photobox Studio",
};

const TOOL_IDS: ToolId[] = ["tiktok", "removebg", "pdftoword", "ocr", "pictopdf", "dorking", "jurnal", "barber", "markdown", "linktree", "photobox"];

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [premiumExpiry, setPremiumExpiry] = useState<string | null>(null);

  useEffect(() => {
    try {
      const exp = localStorage.getItem("stbz_premium_expiry");
      if (exp) setPremiumExpiry(exp);
    } catch {}
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="comic-panel bg-white dark:bg-gray-800 max-w-md w-full text-center py-8 px-6">
          <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <h1 className="font-display text-headline-md uppercase italic mb-2">Belum Login</h1>
          <p className="font-body text-sm text-gray-500 mb-4">Login atau daftar dulu buat liat profile.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/login" className="bg-cyan-500 text-white border-4 border-black px-6 py-2 font-body font-bold uppercase text-xs comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all">LOGIN</Link>
            <Link href="/register" className="bg-gray-200 text-black border-4 border-black px-6 py-2 font-body font-bold uppercase text-xs comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all">DAFTAR</Link>
          </div>
        </div>
      </div>
    );
  }

  const premium = isPremium();
  const remainingDays = premiumExpiry ? Math.ceil((new Date(premiumExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="comic-panel bg-white dark:bg-gray-800">
        <div className="comic-badge -top-4 -right-4 rotate-12 bg-cyan-500 text-white border-2 border-black">PROFILE!</div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-yellow-400 border-4 border-black flex items-center justify-center text-2xl font-black shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-headline-md uppercase italic">{user.name}</h1>
            <p className="font-body text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="border-t-4 border-black pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-body font-bold text-xs uppercase text-gray-500">Status Akun</span>
            <span className={`font-body font-bold text-xs uppercase px-2 py-0.5 border-2 border-black ${premium ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}>
              {premium ? "PREMIUM" : user.role === "admin" ? "ADMIN" : "USER"}
            </span>
          </div>

          {premium && premiumExpiry && (
            <div className="flex items-center justify-between">
              <span className="font-body font-bold text-xs uppercase text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> Premium Sampai</span>
              <span className="font-body font-bold text-xs">
                {new Date(premiumExpiry).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
                <span className="text-gray-400 ml-1">({remainingDays > 0 ? `sisa ${remainingDays} hari` : "kedaluwarsa"})</span>
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-body font-bold text-xs uppercase text-gray-500">Kredit Harian</span>
            <span className={`font-body font-bold text-xs px-2 py-0.5 border-2 border-black ${!premium && isLoggedIn() ? "bg-blue-100 text-blue-800" : premium ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"}`}>
              {premium ? "♾️ Unlimited" : isLoggedIn() ? "5 / hari" : "2 / hari"}
            </span>
          </div>
        </div>

        {!premium && (
          <div className="mt-4 border-t-4 border-black pt-4">
            <Link href="/payment" className="w-full bg-yellow-400 text-black border-4 border-black px-6 py-3 font-body font-bold uppercase text-sm comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" /> UPGRADE KE PREMIUM — Rp15.000
            </Link>
          </div>
        )}

        <div className="mt-4 border-t-4 border-black pt-4">
          <button onClick={handleLogout} className="w-full bg-red-500 text-white border-4 border-black px-4 py-2 font-body font-bold text-xs uppercase comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" /> LOGOUT
          </button>
        </div>
      </div>

      <div className="comic-panel bg-white dark:bg-gray-800">
        <h2 className="font-display text-headline-md uppercase italic mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> Sisa Kredit Hari Ini
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TOOL_IDS.map((id) => {
            const remaining = getRemaining(id);
            const limit = getLimit(id);
            if (!isFinite(limit)) return null;
            return (
              <div key={id} className="flex items-center justify-between border-2 border-black px-3 py-2 bg-gray-50 dark:bg-gray-900">
                <span className="font-body font-bold text-xs">{TOOL_NAMES[id] || id}</span>
                <span className={`font-body font-bold text-[10px] px-1.5 py-0.5 border border-black ${remaining === 0 ? "bg-red-500 text-white" : remaining <= 2 ? "bg-yellow-400 text-black" : "bg-green-500 text-white"}`}>
                  {remaining}/{limit}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {premium && premiumExpiry && remainingDays <= 7 && (
        <div className="comic-panel bg-yellow-400 text-center">
          <p className="font-body font-bold text-sm">Premium lo mau habis dalam {remainingDays} hari! Perpanjang sekarang biar gak putus.</p>
          <Link href="/payment" className="mt-2 inline-block bg-black text-white border-4 border-black px-6 py-2 font-body font-bold uppercase text-xs comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all">PERPANJANG</Link>
        </div>
      )}
    </div>
  );
}
