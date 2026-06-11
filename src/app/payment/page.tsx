"use client";
import { useState } from "react";
import { Loader2, Smartphone, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const handleBayar = async () => {
    if (!name.trim()) {
      toast.error("Isi nama lo dulu bro");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/midtrans/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal");
      setRedirectUrl(data.redirectUrl);
      setDone(true);
      window.open(data.redirectUrl, "_blank");
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
        <p className="font-body text-sm text-gray-500">Pilih metode pembayaran (QRIS, GoPay, OVO, Bank Transfer, dll).</p>

        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nama lo..."
          className="w-full p-3 border-4 border-black bg-white dark:bg-gray-800 font-body font-bold text-sm outline-none"
          disabled={done}
        />

        {!done ? (
          <button
            onClick={handleBayar}
            disabled={loading}
            className="w-full bg-green-500 text-white border-4 border-black px-6 py-3 font-body font-bold uppercase text-sm comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> MEMPROSES...</> : <><Smartphone className="w-5 h-5" /> BAYAR 15RB SEKARANG</>}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="bg-blue-50 dark:bg-gray-900 border-4 border-blue-500 p-4 text-center">
              <p className="font-body font-bold text-sm">Pembayaran dibuat!</p>
              <p className="text-xs text-gray-500 mt-1">Klik tombol di bawah buat milih metode bayar.</p>
            </div>
            <a
              href={redirectUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-yellow-400 text-black border-4 border-black px-6 py-3 font-body font-bold uppercase text-sm comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-5 h-5" /> PILIH METODE BAYAR
            </a>
            <p className="text-[10px] text-gray-400 text-center">
              Setelah bayar, lo bakal diarahkan balik otomatis & premium langsung aktif.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
