"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Isi semua data bro");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register-public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal daftar");
      setDone(true);
      toast.success("Akun berhasil dibuat!");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal daftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="comic-panel bg-white dark:bg-gray-800 max-w-md w-full">
        <div className="comic-badge -top-4 -right-4 rotate-12 bg-cyan-500 text-white border-2 border-black">DAFTAR!</div>
        <h1 className="font-display text-headline-md uppercase italic mb-2 flex items-center gap-2">
          <UserPlus className="w-6 h-6" /> Daftar Akun
        </h1>
        <p className="font-body text-sm text-gray-500 mb-4">
          Biar kalo bayar premium, akun lo ke-upgrade & gak ilang meskipun ganti HP.
        </p>

        {!done ? (
          <form onSubmit={handleRegister} className="space-y-3">
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Nama lo..."
              className="w-full p-3 border-4 border-black bg-white dark:bg-gray-800 font-body font-bold text-sm outline-none" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email..."
              className="w-full p-3 border-4 border-black bg-white dark:bg-gray-800 font-body font-bold text-sm outline-none" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password (min 6 karakter)..."
              className="w-full p-3 border-4 border-black bg-white dark:bg-gray-800 font-body font-bold text-sm outline-none" />
            <button type="submit" disabled={loading}
              className="w-full bg-cyan-500 text-white border-4 border-black px-6 py-3 font-body font-bold uppercase text-sm comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> MEMBUAT...</> : <><UserPlus className="w-5 h-5" /> DAFTAR</>}
            </button>
            <p className="text-center text-xs text-gray-400">
              Udah punya akun? <Link href="/login" className="text-cyan-600 font-bold underline">Login</Link>
            </p>
          </form>
        ) : (
          <div className="text-center py-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="font-body font-bold text-sm">Akun berhasil dibuat!</p>
            <p className="text-xs text-gray-400 mt-1">Dialihkan ke login...</p>
          </div>
        )}
      </div>
    </div>
  );
}
