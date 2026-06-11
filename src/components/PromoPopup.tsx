"use client";
import { useState, useEffect } from "react";
import { X, Crown, Sparkles, Camera, Zap } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "stbz_promo_seen_v2";

export default function PromoPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={dismiss} />
      <div
        className="relative w-full max-w-sm bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 border-4 border-black p-6 animate-in zoom-in-95 duration-300"
        style={{ boxShadow: "8px 8px 0 rgba(0,0,0,1)" }}
      >
        <button onClick={dismiss}
          className="absolute -top-3 -right-3 w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
          style={{ boxShadow: "2px 2px 0 rgba(0,0,0,1)" }}>
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center border-2 border-black -rotate-6" style={{ boxShadow: "4px 4px 0 rgba(0,0,0,1)" }}>
            <Crown className="w-8 h-8 text-yellow-500" />
          </div>

          <div>
            <p className="font-display text-[10px] text-white/80 uppercase tracking-widest">PROMO SPESIAL!</p>
            <h3 className="font-display text-2xl uppercase italic text-white drop-shadow-[2px_2px_0_#000] leading-tight mt-1">
              UNLIMITED ALL TOOLS!
            </h3>
          </div>

          <p className="font-body text-sm text-white/90">
            Cuma <strong className="text-yellow-300">Rp15.000</strong>/bulan — 13 tools unlimited. Bayar sekali, premium sebulan penuh!
          </p>

          <div className="bg-white/15 backdrop-blur border-2 border-white/30 rounded-2xl px-4 py-3 w-full">
            <p className="font-display text-sm uppercase italic text-white drop-shadow-[1px_1px_0_#000] flex items-center justify-center gap-1">
              <Camera className="w-4 h-4" /> BARU! PHOTOBOX STUDIO
            </p>
            <p className="font-body text-[10px] text-white/80 mt-1">
              12 bingkai &bull; 18 filter &bull; teks kustom &bull; emoji &bull; layout grid
            </p>
          </div>

          <div className="flex gap-2 w-full">
            <Link href="/payment"
              className="flex-1 bg-black text-yellow-400 font-display text-sm uppercase italic py-3 rounded-xl text-center border-2 border-white hover:bg-gray-900 transition-colors"
              style={{ boxShadow: "3px 3px 0 rgba(0,0,0,0.5)" }}
              onClick={dismiss}>
              <Zap className="w-4 h-4 inline -mt-0.5" /> AMBIL PREMIUM
            </Link>
            <button onClick={dismiss}
              className="bg-white/20 text-white font-body text-xs font-bold py-3 px-4 rounded-xl border-2 border-white/40 hover:bg-white/30 transition-colors">
              Nanti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
