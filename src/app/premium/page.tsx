"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import { activatePremium } from "@/lib/credits";

const PREMIUM_CODE = "za2026";

function PremiumContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "invalid">("loading");

  useEffect(() => {
    const code = searchParams.get("code");
    if (code === PREMIUM_CODE) {
      activatePremium();
      setStatus("success");
    } else {
      setStatus("invalid");
    }
  }, [searchParams]);

  return (
    <>
      {status === "loading" && (
        <div className="py-8">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body font-bold text-sm">Verifying...</p>
        </div>
      )}

      {status === "success" && (
        <div className="py-8 px-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="font-display text-headline-md uppercase italic mb-2">PREMIUM AKTIF!</h1>
          <p className="font-body text-sm text-gray-600 dark:text-gray-400 mb-6">
            Sekarang lo bisa make semua tools UNLIMITED. Gausah login, gausah khawatir kredit habis.
          </p>
          <Link href="/" className="inline-block bg-yellow-400 text-black border-4 border-black px-8 py-3 font-body font-bold uppercase comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
            MULAI PAKE TOOLS
          </Link>
          <p className="text-[10px] text-gray-400 mt-4">Akses ini tersimpan di browser ini aja ya bro.</p>
        </div>
      )}

      {status === "invalid" && (
        <div className="py-8 px-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="font-display text-headline-md uppercase italic mb-2">KODE SALAH!</h1>
          <p className="font-body text-sm text-gray-600 dark:text-gray-400 mb-6">
            Kode premium yang lo masukin salah. Coba cek lagi atau hubungi admin.
          </p>
          <Link href="/" className="inline-block bg-gray-200 text-black border-4 border-black px-8 py-3 font-body font-bold uppercase comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
            KEMBALI
          </Link>
        </div>
      )}
    </>
  );
}

export default function PremiumPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="comic-panel bg-white dark:bg-gray-800 max-w-md w-full text-center">
        <Suspense fallback={<div className="py-8"><div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" /></div>}>
          <PremiumContent />
        </Suspense>
      </div>
    </div>
  );
}
