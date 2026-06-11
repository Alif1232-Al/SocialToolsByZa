"use client";
import { useState, useCallback, useEffect } from "react";
import { Download, Link as LinkIcon, Loader2 } from "lucide-react";
import ComicPanel from "./ComicPanel";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";
import toast from "react-hot-toast";

export default function TikTokDownloader() {
  const { lang } = useLang();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!videoUrl) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/tiktok/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl }),
      });
      if (!res.ok) throw new Error("Download gagal");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "tiktok-video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mendownload video");
      toast.error(err instanceof Error ? err.message : "Gagal");
    } finally {
      setDownloading(false);
    }
  }, [videoUrl]);

  const handleGrab = useCallback(async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setVideoUrl("");
    try {
      const res = await fetch("/api/tiktok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVideoUrl(data.videoUrl);
      toast.success("Video siap di download!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil video");
      toast.error(err instanceof Error ? err.message : "Gagal");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === "NumpadEnter") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!loading && url.trim()) handleGrab();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [loading, url, handleGrab]);

  return (
    <ComicPanel bgColor="bg-yellow-400" badge="BOOM!" badgeColor="bg-cyan-500 text-white">
      <h3 className="font-display text-headline-md uppercase italic mb-4 flex items-center gap-2">
        <Download className="w-6 h-6" />{t("tiktok.title", lang)}
      </h3>
      <p className="font-body text-body-md text-gray-700 mb-4 flex-grow">{t("tiktok.desc", lang)}</p>
      <div className="flex flex-col gap-3">
        <div className="flex border-4 border-black bg-white">
          <span className="flex items-center px-3 bg-gray-100 border-r-4 border-black"><LinkIcon className="w-5 h-5" /></span>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t("tiktok.placeholder", lang)} className="flex-1 p-3 font-body font-bold text-sm outline-none bg-white" disabled={loading} />
        </div>
        {error && <p className="bg-red-100 border-2 border-red-500 text-red-700 p-2 font-body font-bold text-xs">{error}</p>}
        {videoUrl && (
          <button onClick={handleDownload} disabled={downloading} className="bg-green-500 text-white border-4 border-black px-4 py-2 font-body font-bold uppercase text-center comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-comic">
            {downloading ? "DOWNLOADING..." : `⬇ ${t("tiktok.download", lang)}`}
          </button>
        )}
        <button onClick={handleGrab} disabled={loading} className="comic-btn bg-black text-white w-full text-center disabled:opacity-50 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-comic">
          {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />PROCESSING...</span> : <span>{t("tiktok.grab", lang)} <span className="text-[8px] text-white/50 font-normal hidden sm:inline">(Ctrl+Enter)</span></span>}
        </button>
      </div>
    </ComicPanel>
  );
}
