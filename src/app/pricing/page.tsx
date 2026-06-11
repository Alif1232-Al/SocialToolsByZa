import Link from "next/link";
import { Check, X, Zap, Crown, CreditCard } from "lucide-react";

const TOOLS = [
  { name: "TikTok Downloader", free: "3x", premium: "Unlimited" },
  { name: "Remove Background", free: "3x", premium: "Unlimited" },
  { name: "PDF to Word", free: "3x", premium: "Unlimited" },
  { name: "OCR Picture to Text", free: "3x", premium: "Unlimited" },
  { name: "Picture to PDF", free: "3x", premium: "Unlimited" },
  { name: "Dorking OSINT", free: "3x", premium: "Unlimited" },
  { name: "Jurnal Finder", free: "3x", premium: "Unlimited" },
  { name: "Photobox Studio", free: "3x", premium: "Unlimited" },
  { name: "Barber Kalkulator", free: "3x", premium: "Unlimited" },
  { name: "Markdown Previewer", free: "3x", premium: "Unlimited" },
  { name: "Linktree Generator", free: "3x", premium: "Unlimited" },
  { name: "JSON Formatter", free: "Unlimited", premium: "Unlimited" },
  { name: "Quote Generator", free: "Unlimited", premium: "Unlimited" },
];

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="comic-panel bg-yellow-400 text-center relative overflow-hidden">
        <div className="comic-badge -top-4 -right-4 rotate-12 bg-pink-500 text-white">HARGA!</div>
        <Crown className="w-12 h-12 mx-auto mb-2 text-black/60" />
        <h1 className="font-display text-4xl md:text-5xl uppercase italic font-black">PREMIUM</h1>
        <p className="font-body text-sm md:text-base text-gray-700 mt-2 max-w-lg mx-auto">
          Semua tools unlimited. Gak ada batas, gak ada nunggu. Cocok buat yang butuh tools tiap hari.
        </p>
        <div className="mt-6 bg-black text-white border-4 border-black px-8 py-4 inline-block">
          <span className="font-display text-4xl md:text-5xl font-black">Rp15.000</span>
          <span className="text-sm text-gray-400 block">/ bulan</span>
        </div>
        <Link
          href="/payment"
          className="mt-6 inline-flex bg-white text-black border-4 border-black px-8 py-3 font-body font-bold uppercase text-sm comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all items-center gap-2"
        >
          <CreditCard className="w-5 h-5" /> AMBIL PREMIUM SEKARANG
        </Link>
        <p className="text-[10px] text-gray-500 mt-3 mb-1">Bayar sekali, akses sebulan. Gak ada autodebit.</p>
      </div>

      <div className="comic-panel bg-white dark:bg-gray-800 p-0 overflow-hidden">
        <div className="bg-black text-white px-6 py-3 font-display text-headline-md uppercase italic">
          Perbandingan Fitur
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-4 border-black bg-gray-50 dark:bg-gray-900">
                <th className="px-6 py-3 font-body font-bold text-xs uppercase">Tool</th>
                <th className="px-6 py-3 font-body font-bold text-xs uppercase text-center">Free</th>
                <th className="px-6 py-3 font-body font-bold text-xs uppercase text-center bg-yellow-100 dark:bg-yellow-900">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-200 dark:divide-gray-700">
              {TOOLS.map((tool, i) => (
                <tr key={i} className={`${i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"}`}>
                  <td className="px-6 py-3 font-body font-bold text-sm">{tool.name}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`font-body font-bold text-xs ${tool.free === "Unlimited" ? "text-green-600" : "text-gray-500"}`}>
                      {tool.free === "Unlimited" ? (
                        <span className="flex items-center justify-center gap-1"><Check className="w-4 h-4 text-green-500" /> Unlimited</span>
                      ) : (
                        <span className="flex items-center justify-center gap-1"><X className="w-3.5 h-3.5 text-red-400" /> {tool.free}</span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center bg-yellow-50 dark:bg-yellow-900/30">
                    <span className="font-body font-bold text-xs text-green-600 flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" /> {tool.premium}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Zap, title: "Aktivasi Instant", desc: "Bayar → aktif. Gak perlu nunggu admin verify." },
          { icon: Crown, title: "Semua Tools Unlimited", desc: "11 tools unlimited + 2 tools gratis." },
          { icon: CreditCard, title: "Banyak Metode", desc: "QRIS, GoPay, OVO, Bank Transfer, Alfamart." },
        ].map((item, i) => (
          <div key={i} className="comic-panel bg-white dark:bg-gray-800 text-center">
            <item.icon className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <h3 className="font-body font-bold text-sm uppercase">{item.title}</h3>
            <p className="font-body text-xs text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/payment"
          className="inline-flex bg-green-500 text-white border-4 border-black px-10 py-4 font-body font-bold uppercase text-base comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all items-center gap-2"
        >
          <CreditCard className="w-6 h-6" /> AMBIL PREMIUM — Rp15.000
        </Link>
        <p className="text-[10px] text-gray-400 mt-2">Bayar sekali, akses sebulan full.</p>
      </div>
    </div>
  );
}
