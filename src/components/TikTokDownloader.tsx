"use client";
import { useState, useCallback, useEffect } from "react";
import { Download, Link as LinkIcon, Loader2 } from "lucide-react";

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
import ComicPanel from "./ComicPanel";
import CreditGate from "./CreditGate";
import { isLimitReached, incrementUsage } from "@/lib/credits";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";
import toast from "react-hot-toast";

export default function TikTokDownloader() {
  const [limitHit, setLimitHit] = useState(isLimitReached("tiktok"));
  const { lang } = useLang();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownload = useCallback(async () => {
    if (!videoUrl) return;
    setDownloading(true);
    setDownloadProgress(0);
    try {
      const res = await fetch("/api/tiktok/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl }),
      });
      if (!res.ok) throw new Error("Download gagal");

      const total = parseInt(res.headers.get("Content-Length") || "0", 10);
      const reader = res.body?.getReader();
      if (!reader) { const blob = await res.blob(); saveBlob(blob, "tiktok-video.mp4"); return; }

      const chunks: Uint8Array[] = [];
      let received = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (total) setDownloadProgress(Math.round((received / total) * 100));
      }

      const blob = new Blob(chunks as BlobPart[], { type: "video/mp4" });
      saveBlob(blob, "tiktok-video.mp4");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mendownload video");
      toast.error(err instanceof Error ? err.message : "Gagal");
    } finally {
      setDownloading(false);
      setDownloadProgress(0);
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
      incrementUsage("tiktok");
      if (isLimitReached("tiktok")) setLimitHit(true);
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

  if (limitHit) {
    return <CreditGate toolId="tiktok" toolName="TikTok Downloader" limitReached={true}><div /></CreditGate>;
  }

  return (
    <ComicPanel bgColor="bg-yellow-400" badge="BOOM!" badgeColor="bg-cyan-500 text-white">
      <h3 className="font-display text-headline-md uppercase italic mb-4 flex items-center gap-2">
        <Download className="w-6 h-6" />{t("tiktok.title", lang)}
      </h3>
      <p className="font-body text-body-md text-gray-700 mb-4 flex-grow">{t("tiktok.desc", lang)}</p>
      <div className="flex flex-col gap-3">
        <div className="flex border-4 border-black bg-white dark:bg-gray-800">
          <span className="flex items-center px-3 bg-gray-100 dark:bg-gray-700 border-r-4 border-black"><LinkIcon className="w-5 h-5" /></span>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t("tiktok.placeholder", lang)} className="flex-1 p-3 font-body font-bold text-sm outline-none bg-white dark:bg-gray-800" disabled={loading} />
        </div>
        {!url && !videoUrl && (
          <p className="text-[10px] font-body text-gray-400 dark:text-gray-500 text-center -mt-1">Contoh: https://vm.tiktok.com/... atau https://tiktok.com/@user/video/...</p>
        )}
        {error && <p className="bg-red-100 border-2 border-red-500 text-red-700 p-2 font-body font-bold text-xs">{error}</p>}
        {videoUrl && !downloading && (
          <button onClick={handleDownload} className="bg-green-500 text-white border-4 border-black px-4 py-2 font-body font-bold uppercase text-center comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
            ⬇ {t("tiktok.download", lang)}
          </button>
        )}
        {downloading && (
          <div className="border-4 border-black bg-white dark:bg-gray-800 p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body font-bold text-[10px] uppercase text-gray-500">Downloading...</span>
              <span className="font-body font-bold text-[10px] text-gray-500">{downloadProgress}%</span>
            </div>
            <div className="h-3 border-2 border-black bg-gray-100 dark:bg-gray-700">
              <div className="h-full bg-green-500 transition-all duration-200" style={{ width: `${downloadProgress}%` }} />
            </div>
          </div>
        )}
        <button onClick={handleGrab} disabled={loading} className="comic-btn bg-black text-white w-full text-center disabled:opacity-50 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-comic">
          {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />PROCESSING...</span> : <span>{t("tiktok.grab", lang)} <span className="text-[8px] text-white/50 font-normal hidden sm:inline">(Ctrl+Enter)</span></span>}
        </button>
      </div>
    </ComicPanel>
  );
}
