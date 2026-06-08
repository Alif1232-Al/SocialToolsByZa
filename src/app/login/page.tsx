"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { LogIn, Loader2, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refresh } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login gagal");
      refresh();
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md comic-panel bg-white">
        <div className="text-center mb-6">
          <div className="inline-block bg-pink-500 text-white border-4 border-black px-6 py-3 -rotate-2 comic-shadow mb-4">
            <h1 className="font-display text-headline-md uppercase">LOGIN</h1>
          </div>
          <p className="font-body text-body-md text-gray-600">Masuk ke Social Tools By Za!!</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="font-body font-bold text-xs uppercase tracking-wider text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border-4 border-black p-3 font-body font-bold text-sm outline-none mt-1"
              placeholder="admin@za.com" required />
          </div>
          <div>
            <label className="font-body font-bold text-xs uppercase tracking-wider text-gray-700">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border-4 border-black p-3 font-body font-bold text-sm outline-none mt-1"
              placeholder="••••••••" required />
          </div>

          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 font-body font-bold text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-cyan-500 text-white border-4 border-black py-3 font-body font-bold uppercase text-sm comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> LOADING...</> : <><LogIn className="w-5 h-5" /> MASUK</>}
          </button>
        </form>

        <p className="mt-4 text-center font-body text-xs text-gray-400">
          Belum punya akun? Hubungi admin buat daftar.
        </p>
      </div>
    </div>
  );
}
