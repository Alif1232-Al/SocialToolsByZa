"use client";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { activatePremium } from "@/lib/credits";

export default function PaymentSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="comic-panel bg-white dark:bg-gray-800 max-w-md w-full text-center">
        <Suspense fallback={<div className="py-8"><div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" /></div>}>
          <PaymentContent />
        </Suspense>
      </div>
    </div>
  );
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"checking" | "success" | "failed">("checking");

  useEffect(() => {
    const ref = searchParams.get("order_id") || searchParams.get("ref");
    if (!ref) { setStatus("failed"); return; }

    fetch(`/api/midtrans/check?order_id=${ref}`)
      .then(r => r.json())
      .then(data => {
        if (data.status === "settlement" || data.status === "capture") {
          activatePremium();
          fetch("/api/auth/upgrade", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) }).catch(() => {});
          setStatus("success");
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [searchParams]);

  if (status === "checking") {
    return (
      <div className="py-8">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-yellow-400" />
        <p className="font-body font-bold text-sm">Ngecek pembayaran...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="py-8 px-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="font-display text-headline-md uppercase italic mb-2">PEMBAYARAN BERHASIL!</h1>
        <p className="font-body text-sm text-gray-600 dark:text-gray-400 mb-6">
          PREMIUM lo udah aktif bro! Tools unlimited mulai sekarang.
        </p>
        <Link href="/" className="inline-block bg-yellow-400 text-black border-4 border-black px-8 py-3 font-body font-bold uppercase comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
          MULAI PAKE TOOLS
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-6">
      <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h1 className="font-display text-headline-md uppercase italic mb-2">PEMBAYARAN BELUM DIKONFIRMASI</h1>
      <p className="font-body text-sm text-gray-600 dark:text-gray-400 mb-6">
        Pembayaran lo belum terverifikasi. Coba tunggu bentar atau hubungi admin.
      </p>
      <Link href="/payment" className="inline-block bg-yellow-400 text-black border-4 border-black px-8 py-3 font-body font-bold uppercase comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
        COBA LAGI
      </Link>
    </div>
  );
}
