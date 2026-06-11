"use client";
import { useState } from "react";
import { X, Megaphone } from "lucide-react";

export default function AdBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative mb-6 bg-gradient-to-r from-purple-500 via-pink-400 to-yellow-400 border-4 border-black comic-shadow">
      <button
        onClick={() => setDismissed(true)}
        className="absolute -top-3 -right-3 w-7 h-7 bg-black text-white border-2 border-white rounded-full flex items-center justify-center z-10 hover:scale-110 transition-transform"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-center justify-center gap-3 px-6 py-4 text-black">
        <Megaphone className="w-6 h-6 shrink-0 hidden sm:block" />
        <p className="font-body font-bold text-xs sm:text-sm uppercase text-center">
          🚀 Iklan? <span className="text-white">Hubungi gue buat pasang iklan di sini!</span>
        </p>
        <a
          href="https://wa.me/6285177824235?text=Halo%20Za!%20Saya%20mau%20pasang%20iklan%20di%20SocialToolsByZa"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex bg-black text-white border-2 border-white px-4 py-1.5 font-body font-bold text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors shrink-0"
        >
          Pasang Iklan
        </a>
      </div>
    </div>
  );
}
