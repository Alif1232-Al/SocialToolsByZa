"use client";
import { useState } from "react";
import { CheckCircle, Copy, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

const BANKS = [
  { name: "SeaBank", holder: "Alif Afriza", number: "901028388898", icon: "🏦" },
  { name: "Bank Jago", holder: "Alif Afriza", number: "105634830803", icon: "🏦" },
  { name: "Livin' (Mandiri)", holder: "Alif Afriza", number: "1460014106473", icon: "🏦" },
];

const PRICE = 15_000;
const MONTHS = 1;

export default function PaymentPage() {
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleConfirm = () => {
    if (!name.trim()) {
      toast.error("Isi nama lo dulu bro");
      return;
    }
    setSending(true);

    const msg = encodeURIComponent(
      `HALO ZA! GW MAU PREMIUM! 🚀\n\n` +
      `Nama: ${name.trim()}\n` +
      `Paket: Rp15.000/bulan\n` +
      `Udah transfer ya! Cek rekening lo.`
    );

    window.open(`https://wa.me/6285177824235?text=${msg}`, "_blank");
    setSending(false);
    setSent(true);
    toast.success("Pesan WA udah dikirim!");
  };

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    toast.success("No. rekening dicopy!");
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
        <h2 className="font-display text-headline-md uppercase italic">Cara Bayar</h2>

        <div className="space-y-3 mb-4">
          <div className="bg-gray-50 dark:bg-gray-900 border-4 border-black p-4 text-center">
            <p className="font-body font-bold text-xs uppercase mb-2">Scan QRIS (SeaBank / Livin' / Jago)</p>
            <div className="w-48 h-48 mx-auto bg-gray-200 dark:bg-gray-700 border-4 border-black flex items-center justify-center">
              <span className="text-[10px] text-gray-400 font-body font-bold">QRIS LO DI SINI BRO</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">Upload QRIS lo ke sini nanti</p>
          </div>

          <p className="text-center font-body font-bold text-xs text-gray-400 uppercase">Atau transfer ke:</p>

          {BANKS.map((bank) => (
            <div key={bank.number} className="flex items-center justify-between border-4 border-black bg-white dark:bg-gray-900 p-3">
              <div>
                <span className="font-body font-bold text-xs">{bank.icon} {bank.name}</span>
                <p className="font-body text-sm font-bold mt-0.5">{bank.holder}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-body font-bold text-xs">{bank.number}</span>
                <button onClick={() => copyNumber(bank.number)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {!sent ? (
          <div className="space-y-3 border-t-4 border-black pt-4">
            <h3 className="font-body font-bold text-xs uppercase">Konfirmasi Pembayaran</h3>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nama lo..."
              className="w-full p-3 border-4 border-black bg-white dark:bg-gray-800 font-body font-bold text-sm outline-none"
            />
            <button
              onClick={handleConfirm}
              disabled={sending}
              className="w-full bg-green-500 text-white border-4 border-black px-6 py-3 font-body font-bold uppercase text-sm comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
            >
              {sending ? "PROSES..." : "✅ SAYA SUDAH BAYAR!"}
            </button>
            <p className="text-[10px] text-gray-400 text-center">
              Klik tombol di atas → otomatis WA ke admin. Admin akan cek dan kirim link premium.
            </p>
          </div>
        ) : (
          <div className="text-center py-4 border-t-4 border-black">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="font-body font-bold text-sm">Pesan terkirim!</p>
            <p className="text-xs text-gray-400 mt-1">Admin bakal cek pembayaran lo dan kirim link premium via WA.</p>
          </div>
        )}
      </div>
    </div>
  );
}
