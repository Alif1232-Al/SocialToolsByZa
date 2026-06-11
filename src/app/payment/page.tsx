"use client";
import { useState } from "react";
import { Loader2, Smartphone, Building } from "lucide-react";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const handleBayar = async () => {
    if (!name.trim()) {
      toast.error("Isi nama lo dulu bro");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/tripay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal");
      setQrUrl(data.qrUrl);
      setCheckoutUrl(data.checkoutUrl);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal buat pembayaran");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="comic-panel bg-yellow-400 text-center">
        <div className="comic-badge -top-4 -right-4 rotate-12 bg-pink-500 text-white border-2 border-black">PREMIUM!</div>
        <h1 className="font-display text-headline-md uppercase italic">PREMIUM</h1>
        <p className="font-body text-sm text-gray-700 mt-2">Tools unlimited, gak ada batas! 15rb/bulan aja bro.</p>
        <div className="mt-4 bg-black text-white border-4 border-black px-6 py-3 inline-block">
          <span className="font-display text-3xl font-black">Rp15.000</span>
          <span className="text-xs text-gray-400 block">/ bulan</span>
        </div>
      </div>

      <div className="comic-panel bg-white dark:bg-gray-800 space-y-4">
        <h2 className="font-display text-headline-md uppercase italic">Aktifkan Premium</h2>
        <p className="font-body text-sm text-gray-500">Masukin nama lo, klik bayar, transfer via QRIS, auto aktif.</p>

        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nama lo..."
          className="w-full p-3 border-4 border-black bg-white dark:bg-gray-800 font-body font-bold text-sm outline-none"
        />

        <button
          onClick={handleBayar}
          disabled={loading || !!checkoutUrl}
          className="w-full bg-green-500 text-white border-4 border-black px-6 py-3 font-body font-bold uppercase text-sm comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> MEMPROSES...</> : <><Smartphone className="w-5 h-5" /> BAYAR 15RB SEKARANG</>}
        </button>

        {qrUrl && (
          <div className="text-center border-4 border-black bg-gray-50 dark:bg-gray-900 p-4">
            <p className="font-body font-bold text-xs uppercase mb-3">Scan QRIS buat bayar</p>
            <img src={qrUrl} alt="QRIS" className="w-48 h-48 mx-auto" />
            <p className="text-[10px] text-gray-400 mt-2">Atau <a href={checkoutUrl!} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">klik di sini</a> buat metode lain</p>
          </div>
        )}

        {checkoutUrl && (
          <div className="bg-blue-50 dark:bg-gray-900 border-4 border-blue-500 p-3 text-center">
            <Building className="w-6 h-6 mx-auto mb-1 text-blue-500" />
            <p className="font-body font-bold text-xs">Pembayaran dibuat!</p>
            <p className="text-[10px] text-gray-400 mt-1">Setelah bayar, lo bakal diarahkan balik otomatis.</p>
          </div>
        )}
      </div>
    </div>
  );
}
