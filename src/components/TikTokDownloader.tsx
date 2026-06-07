"use client";
import { useState, useCallback } from "react";
import { Download, Link as LinkIcon, Loader2 } from "lucide-react";
import ComicPanel from "./ComicPanel";

export default function TikTokDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil video");
    } finally {
      setLoading(false);
    }
  }, [url]);

  return (
    <ComicPanel bgColor="bg-yellow-400" badge="BOOM!" badgeColor="bg-cyan-500 text-white">
      <h3 className="font-display text-headline-md uppercase italic mb-4 flex items-center gap-2">
        <Download className="w-6 h-6" />TikTok Video Downloader
      </h3>
      <p className="font-body text-body-md text-gray-700 mb-4 flex-grow">Sedot video TikTok tanpa watermark. Sat set langsung dapet!</p>
      <div className="flex flex-col gap-3">
        <div className="flex border-4 border-black bg-white">
          <span className="flex items-center px-3 bg-gray-100 border-r-4 border-black"><LinkIcon className="w-5 h-5" /></span>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.tiktok.com/@user/video/..." className="flex-1 p-3 font-body font-bold text-sm outline-none bg-white" disabled={loading} />
        </div>
        {error && <p className="bg-red-100 border-2 border-red-500 text-red-700 p-2 font-body font-bold text-xs">{error}</p>}
        {videoUrl && (
          <a href={videoUrl} download className="bg-green-500 text-white border-4 border-black px-4 py-2 font-body font-bold uppercase text-center comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all">⬇ DOWNLOAD VIDEO</a>
        )}
        <button onClick={handleGrab} disabled={loading} className="comic-btn bg-black text-white w-full text-center disabled:opacity-50 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-comic">
          {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />PROCESSING...</span> : "GRAB VIDEO!"}
        </button>
      </div>
    </ComicPanel>
  );
}
