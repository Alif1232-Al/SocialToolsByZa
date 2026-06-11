"use client";
import { useCallback, useRef, useState } from "react";
import { Upload, Sparkles, Loader2 } from "lucide-react";
import ComicPanel from "./ComicPanel";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";
import toast from "react-hot-toast";

export default function RemoveBackground() {
  const { lang } = useLang();
  const fileRef = useRef<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setResultUrl(null);
    fileRef.current = file;
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }, []);

  const handleRemoveBg = useCallback(async () => {
    const file = fileRef.current;
    if (!file) return;
    setLoading(true);
    setError("");
    setResultUrl(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/remove-background", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || "Gagal");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      toast.success("Background berhasil dihapus!");
    } catch (e) {
      console.error("RemoveBG error:", e);
      const msg = e instanceof Error ? e.message : "Coba gambar lain atau refresh";
      setError(`Gagal: ${msg}`);
      toast.error("Gagal menghapus background");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ComicPanel bgColor="bg-pink-500" badge="ZAP!" badgeColor="bg-yellow-400 text-black">
      <h3 className="font-display text-headline-md uppercase italic mb-4 flex items-center gap-2 text-white"><Sparkles className="w-6 h-6" />{t("removebg.title", lang)}</h3>
      <p className="font-body text-body-md text-white/80 mb-4 flex-grow">{t("removebg.desc", lang)}</p>
      <label className="dashed-border bg-white/90 dark:bg-gray-800/90 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition-colors min-h-[160px]">
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        <Upload className="w-10 h-10 mb-2 text-pink-500" />
        <span className="font-body font-bold uppercase text-sm">Drop Image Here or Click</span>
        {!previewUrl && (
          <span className="font-body text-[10px] text-gray-400 dark:text-gray-500 mt-1">JPG, PNG, WebP — Maks 10MB</span>
        )}
      </label>
      {previewUrl && (
        <div className="mt-3 border-4 border-black bg-white p-2">
            <img src={previewUrl} alt="Preview" loading="lazy" className="w-full h-32 object-contain" />
          </div>
        )}
        {resultUrl && (
          <div className="mt-3 border-4 border-black bg-white p-2">
            <img src={resultUrl} alt="Result" loading="lazy" className="w-full h-32 object-contain" />
          <a href={resultUrl} download="removed-bg.png" className="block mt-2 bg-green-500 text-white border-4 border-black px-4 py-1 font-body font-bold uppercase text-xs text-center comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all">DOWNLOAD PNG</a>
        </div>
      )}
      {error && <p className="mt-2 bg-red-100 border-2 border-red-500 text-red-700 p-2 font-body font-bold text-xs">{error}</p>}
      <button onClick={handleRemoveBg} disabled={loading || !previewUrl} className="comic-btn bg-yellow-400 text-black w-full mt-3 text-center disabled:opacity-50">
        {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />PROCESSING...</span> : "REMOVE BG!"}
      </button>
    </ComicPanel>
  );
}
