"use client";
import { useState, useCallback } from "react";
import { Search, ExternalLink, Loader2 } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";
import toast from "react-hot-toast";

interface JurnalItem {
  title: string;
  authors: string;
  summary: string;
  link: string;
  pdfLink: string;
}

export default function JurnalFinder() {
  const { lang } = useLang();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<JurnalItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch("/api/jurnal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.results || []);
      toast.success("Jurnal ditemukan!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mencari jurnal");
      toast.error(err instanceof Error ? err.message : "Gagal");
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="relative md:col-span-2 bg-gray-50 border-4 border-black p-6 comic-shadow flex flex-col">
      <div className="absolute -top-4 -left-4 bg-black text-white px-4 py-1.5 border-4 border-black comic-shadow -rotate-6 font-display font-black uppercase text-sm">SEARCH!</div>
      <h3 className="font-display text-headline-md uppercase italic mb-4 flex items-center gap-2"><Search className="w-6 h-6" />Jurnal Finder / Google Scholar</h3>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="flex-1 w-full">
          <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                 className="w-full bg-white border-4 border-black p-4 font-display text-lg comic-shadow outline-none"
                 placeholder="Enter keywords (e.g., Quantum Physics)..." />
        </div>
        <button onClick={handleSearch} disabled={loading}
                className="bg-yellow-400 text-black border-4 border-black px-8 py-4 font-display font-black uppercase comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 whitespace-nowrap">
          {loading ? <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />SEARCHING...</span> : "Cari Jurnal"}
        </button>
      </div>
      {error && <p className="bg-red-100 border-2 border-red-500 text-red-700 p-2 font-body font-bold text-xs mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {results.map((j, i) => (
          <div key={i} className="bg-white border-4 border-black p-3 hover:-translate-y-1 transition-transform comic-shadow-sm">
            <div className="h-2 bg-cyan-500 mb-2 border-b-2 border-black" />
            <h4 className="font-body font-bold text-xs uppercase mb-1">{j.title}</h4>
            {j.authors && <p className="font-body text-[10px] leading-tight text-gray-500 mb-1">{j.authors}</p>}
            {j.summary && <p className="font-body text-[10px] leading-tight text-gray-600 mb-2">{j.summary}</p>}
            <a href={j.pdfLink} target="_blank" rel="noopener noreferrer"
               className="text-xs font-body font-bold text-cyan-600 flex items-center gap-1 hover:underline">GO TO PDF <ExternalLink className="w-3 h-3" /></a>
          </div>
        ))}
        {results.length === 0 && !loading && !error && (
          <div className="col-span-full flex items-center justify-center py-8 text-gray-400 font-body font-bold text-sm">Hasil pencarian akan muncul di sini</div>
        )}
      </div>
    </div>
  );
}
