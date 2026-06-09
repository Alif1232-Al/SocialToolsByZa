"use client";
import { useState, useCallback, useRef } from "react";
import {
  Search, Globe, Loader2, ExternalLink, UserCheck, XCircle, Ban, AlertTriangle,
  Download, Copy, Check, Sparkles
} from "lucide-react";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";
import toast from "react-hot-toast";

const SOCIAL_ICONS: Record<string, string> = {
  Instagram: "Ig",
  TikTok: "Tk",
  "Twitter / X": "X",
  Facebook: "Fb",
  LinkedIn: "in",
  Threads: "Th",
  YouTube: "YT",
  GitHub: "Gh",
  Snapchat: "Sc",
  Reddit: "Rd",
  Pinterest: "Pt",
  Telegram: "Tg",
  Discord: "Dc",
  Twitch: "Tw",
  Spotify: "Sp",
  Medium: "Md",
  Behance: "Be",
  Dribbble: "Dr",
  SoundCloud: "SC",
  Steam: "St",
};

const SOCIAL_COLORS: Record<string, string> = {
  Instagram: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600",
  TikTok: "bg-black",
  "Twitter / X": "bg-black",
  Facebook: "bg-blue-600",
  LinkedIn: "bg-blue-700",
  Threads: "bg-black",
  YouTube: "bg-red-600",
  GitHub: "bg-gray-800",
  Snapchat: "bg-yellow-300",
  Reddit: "bg-orange-600",
  Pinterest: "bg-red-700",
  Telegram: "bg-blue-500",
  Discord: "bg-indigo-600",
  Twitch: "bg-purple-700",
  Spotify: "bg-green-500",
  Medium: "bg-gray-900",
  Behance: "bg-blue-800",
  Dribbble: "bg-pink-500",
  SoundCloud: "bg-orange-500",
  Steam: "bg-gray-900",
};

function PlatformIcon({ name }: { name: string }) {
  const label = SOCIAL_ICONS[name] || "?";
  const bg = SOCIAL_COLORS[name] || "bg-gray-500";
  return (
    <span className={`w-5 h-5 rounded-full ${bg} flex items-center justify-center text-white font-black text-[8px] shrink-0 border border-white/30`}>
      {label}
    </span>
  );
}

const STATUS_CFG: Record<string, { icon: typeof UserCheck; color: string; label: string }> = {
  found: { icon: UserCheck, color: "text-green-600", label: "Found" },
  not_found: { icon: XCircle, color: "text-red-400", label: "Not Found" },
  rate_limited: { icon: Ban, color: "text-yellow-600", label: "Rate Limited" },
  error: { icon: AlertTriangle, color: "text-gray-400", label: "Error" },
};

type Result = { name: string; url: string; category: string; status: string };
type DorkItem = { title: string; link: string; snippet: string };

export default function Dorking() {
  const { lang } = useLang();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"user" | "dork">("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback(async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch("/api/dorking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q, type: mode === "dork" ? "dork" : undefined }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Request failed");
      setData(d);
      toast.success("Hasil OSINT ditemukan!");
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    } catch (err: any) {
      setError(err.message || "Gagal mencari");
      toast.error(err.message || "Gagal");
    } finally {
      setLoading(false);
    }
  }, [query, mode]);

  const download = (content: string, name: string, mime: string) => {
    const b = new Blob([content], { type: mime });
    const u = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = u; a.download = name; a.click();
    URL.revokeObjectURL(u);
  };

  const csv = useCallback(() => {
    if (!data?.results) return "";
    const rows = [["Platform", "Category", "URL", "Status"]];
    for (const r of data.results) rows.push([r.name, r.category, r.url, r.status]);
    return rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  }, [data]);

  const json = useCallback(() => data ? JSON.stringify(data, null, 2) : "{}", [data]);

  const s = data?.stats;

  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/************* SEARCH BOX *************/}
      <div className="relative comic-panel bg-gray-900 text-white">
        <div className="comic-badge -top-4 -right-4 rotate-12 bg-red-500 text-white">DORK!</div>

        <h3 className="font-display text-headline-md uppercase italic mb-3 flex items-center gap-2">
          <Search className="w-6 h-6 shrink-0" />
          {t("dorking.title", lang)}
        </h3>
        <p className="font-body text-body-md text-white/70 mb-3">
          {t("dorking.desc", lang)}
        </p>

        <div className="flex gap-1 mb-3 bg-white border-2 border-black p-1">
          <button onClick={() => setMode("user")}
            className={`flex-1 py-2 font-body font-bold text-xs uppercase tracking-wider transition-all ${mode === "user" ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-100"}`}>
            <UserCheck className="w-3.5 h-3.5 inline mr-1" />Username
          </button>
          <button onClick={() => setMode("dork")}
            className={`flex-1 py-2 font-body font-bold text-xs uppercase tracking-wider transition-all ${mode === "dork" ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-100"}`}>
            <Sparkles className="w-3.5 h-3.5 inline mr-1" />Google Dork
          </button>
        </div>

        <div className="flex border-4 border-black bg-white">
          <span className="flex items-center px-3 bg-gray-100 border-r-4 border-black shrink-0">
            {mode === "user" ? <Globe className="w-5 h-5 text-gray-600" /> : <Sparkles className="w-5 h-5 text-gray-600" />}
          </span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") doSearch(); }}
            placeholder={mode === "user" ? "Username atau nama orang..." : 'Contoh: site:instagram.com "john"'}
            className="flex-1 p-3 font-body font-bold text-sm outline-none bg-white min-w-0 text-black"
            disabled={loading}
          />
        </div>

        {mode === "user" && (
          <p className="font-body text-[10px] text-white/40 italic mt-1">
            Nama orang (pake spasi) otomatis dicariin juga di Google via SerpAPI
          </p>
        )}

        {error && (
          <div className="mt-2 bg-red-100 border-2 border-red-500 text-red-700 p-2 font-body font-bold text-xs break-words">
            {error}
          </div>
        )}

        <button onClick={doSearch} disabled={loading || !query.trim()}
          className="comic-btn bg-red-500 text-white w-full mt-3 text-center disabled:opacity-50 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-comic">
          {loading ? (
            <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />SEARCHING {mode === "user" ? "20 PLATFORMS..." : "GOOGLE..."}</span>
          ) : mode === "user" ? "DORK NOW!" : "GOOGLE DORK!"}
        </button>
      </div>

      {/************* LOADING SKELETON *************/}
      {loading && (
        <div className="relative comic-panel bg-gray-900 text-white">
          <div className="comic-badge -top-4 -right-4 rotate-12 bg-yellow-400 text-black">SCAN!</div>
          <div className="bg-white border-4 border-black p-3 animate-pulse space-y-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0" />
                <div className="h-4 bg-gray-200 rounded" style={{ width: `${50 + Math.random() * 40}%` }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/************* RESULTS *************/}
      {data && !loading && (
        <div className="flex flex-col gap-3">
          {/*** USERNAME RESULTS ***/}
          {data.type === "username" && (
            <div className="relative comic-panel bg-gray-900 text-white">
              <div className="comic-badge -top-4 -right-4 rotate-12 bg-green-500 text-white">FOUND!</div>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h4 className="font-display text-headline-sm uppercase italic break-all">
                  @{data.username}
                </h4>
                <span className="bg-green-600 text-white px-2 py-0.5 font-body font-bold text-xs border border-white whitespace-nowrap">
                  {s?.found ?? 0} / {s?.total ?? 0}
                </span>
              </div>
              <div className="flex gap-1.5 mb-3 flex-wrap">
                <span className="bg-green-600 text-white px-2 py-0.5 font-body font-bold text-[10px]">Found: {s?.found ?? 0}</span>
                <span className="bg-red-500 text-white px-2 py-0.5 font-body font-bold text-[10px]">Not Found: {s?.not_found ?? 0}</span>
                <span className="bg-yellow-600 text-white px-2 py-0.5 font-body font-bold text-[10px]">Blocked: {s?.rate_limited ?? 0}</span>
                <span className="bg-gray-500 text-white px-2 py-0.5 font-body font-bold text-[10px]">Error: {s?.error ?? 0}</span>
              </div>

              <div className="max-h-[500px] overflow-y-auto space-y-1">
                {(data.categories as string[])?.map((cat: string) => {
                  const items: Result[] = data.grouped?.[cat] ?? [];
                  const found = items.filter((r) => r.status === "found").length;
                  const catColor: Record<string, string> = {
                    "Social Media": "bg-blue-600",
                    "Coding/Dev": "bg-green-700",
                    Streaming: "bg-purple-600",
                    Gaming: "bg-orange-600",
                    Messaging: "bg-teal-600",
                    Professional: "bg-indigo-600",
                  };
                  return (
                    <div key={cat} className="border-2 border-black">
                      <div className={`${catColor[cat] || "bg-gray-600"} text-white px-3 py-1.5 font-body font-bold text-xs uppercase tracking-wider`}>
                        {cat} ({found}/{items.length})
                      </div>
                      <div className="divide-y divide-gray-200 bg-white">
                        {items.map((r: Result) => {
                          const c = STATUS_CFG[r.status] || STATUS_CFG.error;
                          const Icon = c.icon;
                          return (
                            <div key={r.name} className={`flex items-center justify-between px-3 py-2 ${r.status === "found" ? "bg-green-50" : r.status === "not_found" ? "bg-gray-50 text-gray-400" : "bg-yellow-50"}`}>
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                {r.status === "found" ? <PlatformIcon name={r.name} /> : <Icon className={`w-4 h-4 shrink-0 ${c.color}`} />}
                                <span className={`font-body font-bold text-sm truncate ${r.status === "not_found" ? "line-through" : "text-gray-900"}`}>
                                  {r.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0 ml-2">
                                {r.status === "found" ? (
                                  <>
                                    <button onClick={async (e) => { e.stopPropagation(); try { await navigator.clipboard.writeText(r.url); toast.success("URL dicopy!"); } catch {} }}
                                      className="p-1 hover:bg-black/10 rounded transition-colors">
                                      <Copy className="w-3 h-3 text-gray-500" />
                                    </button>
                                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-black/10 rounded transition-colors" title="Open in new tab">
                                      <ExternalLink className="w-3 h-3 text-blue-600" />
                                    </a>
                                  </>
                                ) : (
                                  <span className="text-[10px] font-body font-bold uppercase text-gray-400 whitespace-nowrap">{c.label}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 mt-3">
                <button onClick={() => download(csv(), `dorking-${data.username}.csv`, "text/csv")}
                  className="flex-1 bg-blue-600 text-white border-2 border-black px-2 py-2 font-body font-bold text-xs uppercase hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                  <Download className="w-3.5 h-3.5" />CSV
                </button>
                <button onClick={() => download(json(), `dorking-${data.username}.json`, "application/json")}
                  className="flex-1 bg-purple-600 text-white border-2 border-black px-2 py-2 font-body font-bold text-xs uppercase hover:bg-purple-700 transition-colors flex items-center justify-center gap-1">
                  <Download className="w-3.5 h-3.5" />JSON
                </button>
              </div>
            </div>
          )}

          {/*** NAME RESULTS ***/}
          {data.type === "name" && (
            <div className="relative comic-panel bg-gray-900 text-white">
              <div className="comic-badge -top-4 -right-4 rotate-12 bg-blue-500 text-white">NAME!</div>
              <h4 className="font-display text-headline-sm uppercase italic mb-3 break-all">
                &quot;{data.name}&quot;
              </h4>
              <div className="flex gap-1.5 mb-3 flex-wrap">
                <span className="bg-green-600 text-white px-2 py-0.5 font-body font-bold text-[10px]">Found: {s?.found ?? 0}</span>
                <span className="bg-red-500 text-white px-2 py-0.5 font-body font-bold text-[10px]">Not Found: {s?.not_found ?? 0}</span>
                <span className="bg-yellow-600 text-white px-2 py-0.5 font-body font-bold text-[10px]">Blocked: {s?.rate_limited ?? 0}</span>
              </div>

              <div className="max-h-[400px] overflow-y-auto bg-white border-4 border-black divide-y divide-gray-200">
                {data.results?.length ? data.results.map((r: Result) => {
                  const c = STATUS_CFG[r.status] || STATUS_CFG.error;
                  const Icon = c.icon;
                  return (
                    <div key={r.name} className={`flex items-center justify-between px-3 py-2 ${r.status === "found" ? "bg-green-50" : "bg-gray-50 text-gray-400"}`}>
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {r.status === "found" ? <PlatformIcon name={r.name} /> : <Icon className={`w-4 h-4 shrink-0 ${c.color}`} />}
                        <span className={`font-body font-bold text-sm truncate ${r.status === "not_found" ? "line-through" : "text-gray-900"}`}>{r.name}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {r.status === "found" ? (
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-black/10 rounded"><ExternalLink className="w-3 h-3 text-blue-600" /></a>
                        ) : (
                          <span className="text-[10px] font-body font-bold uppercase text-gray-400">{c.label}</span>
                        )}
                      </div>
                    </div>
                  );
                }) : (
                  <p className="p-4 text-gray-400 font-body text-sm italic text-center">Tidak ada akun sosial media ditemukan dengan nama ini</p>
                )}
              </div>

              {data.nameSearchResults?.length > 0 && (
                <>
                  <h5 className="font-display text-headline-sm uppercase italic text-white mt-4 mb-2">Google Results</h5>
                  <div className="max-h-[300px] overflow-y-auto bg-white border-4 border-black divide-y divide-gray-200">
                    {data.nameSearchResults.map((r: DorkItem, i: number) => (
                      <a key={i} href={r.link} target="_blank" rel="noopener noreferrer" className="block p-3 hover:bg-blue-50 transition-colors">
                        <p className="font-body font-bold text-sm text-blue-700 leading-tight">{r.title}</p>
                        <p className="font-body text-[11px] text-green-700 truncate">{r.link}</p>
                        {r.snippet && <p className="font-body text-xs text-gray-600 mt-0.5">{r.snippet}</p>}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/*** DORK RESULTS ***/}
          {data.type === "dork" && (
            <div className="relative comic-panel bg-gray-900 text-white">
              <div className="comic-badge -top-4 -right-4 rotate-12 bg-purple-500 text-white">DORK!</div>
              <h4 className="font-display text-headline-sm uppercase italic mb-3">Google Dork Results</h4>
              {(!data.results || data.results.length === 0) ? (
                <p className="font-body text-sm text-white/50 italic">No results. Cek SerpAPI key atau query kamu.</p>
              ) : (
                <div className="max-h-[400px] overflow-y-auto bg-white border-4 border-black divide-y divide-gray-200">
                  {data.results.map((r: DorkItem, i: number) => (
                    <a key={i} href={r.link} target="_blank" rel="noopener noreferrer" className="block p-3 hover:bg-blue-50 transition-colors">
                      <p className="font-body font-bold text-sm text-blue-700">{r.title}</p>
                      <p className="font-body text-[11px] text-green-700 truncate">{r.link}</p>
                      {r.snippet && <p className="font-body text-xs text-gray-600 mt-0.5">{r.snippet}</p>}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
