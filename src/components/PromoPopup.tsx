"use client";
import { useState, useEffect } from "react";
import { X, Sparkles, Camera } from "lucide-react";

const STORAGE_KEY = "photobox_promo_seen";

export default function PromoPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 800);
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={dismiss} />
      <div
        className="relative w-full max-w-sm bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 border-4 border-black rounded-3xl p-6 animate-in zoom-in-95 duration-300"
        style={{ boxShadow: "8px 8px 0 rgba(0,0,0,1)" }}
      >
        <button onClick={dismiss}
          className="absolute -top-3 -right-3 w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
          style={{ boxShadow: "2px 2px 0 rgba(0,0,0,1)" }}>
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center border-3 border-black -rotate-6" style={{ boxShadow: "4px 4px 0 rgba(0,0,0,1)", borderWidth: 3 }}>
            <Camera className="w-8 h-8 text-pink-500" />
          </div>

          <div>
            <p className="font-display text-[10px] text-white/80 uppercase tracking-widest">New Feature</p>
            <h3 className="font-display text-2xl uppercase italic text-white drop-shadow-[2px_2px_0_#000]">
              HADIRRRR! 🎉
            </h3>
          </div>

          <div className="bg-white/15 backdrop-blur border-2 border-white/30 rounded-2xl px-4 py-3 space-y-1">
            <p className="font-display text-lg uppercase italic text-white drop-shadow-[1px_1px_0_#000]">
              ✨ Photobox Studio ✨
            </p>
            <p className="font-body text-xs text-white/90 leading-relaxed">
              Bikin collage foto ala photobooth mall! Pilih dari 12 tema bingkai, 18 filter kece, tambahin teks keren & emoji sendiri. Dijamin fotomu makin aesthetic abis! 🔥
            </p>
          </div>

          <div className="flex items-center gap-1 text-yellow-200 text-xs font-display">
            <Sparkles className="w-3.5 h-3.5" />
            <span>12 Bingkai &bull; 18 Filter &bull; Teks &bull; Emoji</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <div className="flex gap-2 w-full">
            <a href="/photobox"
              className="flex-1 bg-black text-white font-display text-sm uppercase italic py-2.5 rounded-xl text-center border-2 border-white hover:bg-gray-900 transition-colors"
              style={{ boxShadow: "3px 3px 0 rgba(0,0,0,0.5)" }}
              onClick={dismiss}>
              COBA COY! 🚀
            </a>
            <button onClick={dismiss}
              className="bg-white/20 text-white font-body text-xs font-bold py-2.5 px-4 rounded-xl border-2 border-white/40 hover:bg-white/30 transition-colors">
              Nanti Dulu
            </button>
          </div>

          <p className="font-body text-[8px] text-white/50">*cuma muncul sekali doang bro</p>
        </div>
      </div>
    </div>
  );
}
