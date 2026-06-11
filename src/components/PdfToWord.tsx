"use client";
import { useState, useCallback } from "react";
import { FileText, Upload, Loader2, FileWarning } from "lucide-react";
import ComicPanel from "./ComicPanel";
import CreditGate from "./CreditGate";
import { isLimitReached, incrementUsage } from "@/lib/credits";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";
import toast from "react-hot-toast";

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export default function PdfToWord() {
  const [limitHit, setLimitHit] = useState(isLimitReached("pdftoword"));
  const { lang } = useLang();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setError("");
    if (f) {
      if (!f.name.toLowerCase().endsWith(".pdf")) {
        setError("Hanya file PDF yang diterima");
        toast.error("Hanya file PDF yang diterima");
        setFile(null);
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        setError("File terlalu besar! Maksimal 15MB");
        toast.error("File terlalu besar! Maksimal 15MB");
        setFile(null);
        return;
      }
      setFile(f);
    }
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleConvert = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 15, 85));
    }, 800);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/pdf-to-word", { method: "POST", body: formData });
      clearInterval(progressInterval);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mengonversi PDF");
      }
      setProgress(100);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + ".docx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("PDF berhasil di-convert!");
      incrementUsage("pdftoword");
      if (isLimitReached("pdftoword")) setLimitHit(true);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat konversi");
      toast.error("Gagal mengonversi PDF");
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
      setProgress(0);
    }
  }, [file]);

  if (limitHit) {
    return <CreditGate toolId="pdftoword" toolName="PDF to Word Converter" limitReached={true}><div /></CreditGate>;
  }
  return (
    <ComicPanel bgColor="bg-cyan-500" badge="CONVERT!" badgeColor="bg-yellow-400 text-black">
      <h3 className="font-display text-headline-md uppercase italic mb-4 flex items-center gap-2 text-white"><FileText className="w-6 h-6" />{t("pdftoword.title", lang)}</h3>
      <p className="font-body text-body-md text-white/80 mb-4 flex-grow">{t("pdftoword.desc", lang)}</p>
      <label className="dashed-border bg-white/90 p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white transition-colors min-h-[120px]">
        <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
        {file ? (
          <div className="flex flex-col items-center gap-1">
            <FileText className="w-8 h-8 text-cyan-600" />
            <span className="font-body font-bold text-xs">{file.name}</span>
            <span className="font-body text-[10px] text-gray-500">{formatSize(file.size)}</span>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 mb-1 text-cyan-600" />
            <span className="font-body font-bold uppercase text-xs">Drop PDF Here or Click</span>
            <span className="font-body text-[10px] text-gray-500 mt-1">Maks 15MB</span>
          </>
        )}
      </label>
      {loading && progress > 0 && (
        <div className="mt-2">
          <div className="w-full h-3 border-2 border-black bg-white">
            <div
              className="h-full bg-yellow-400 border-r-2 border-black transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-body font-bold text-[10px] text-white mt-1 text-center uppercase">
            {progress < 100 ? "Processing..." : "Downloading..."}
          </p>
        </div>
      )}
      {error && (
        <div className="mt-2 bg-red-100 border-2 border-red-500 text-red-700 p-2 font-body font-bold text-xs flex items-start gap-1">
          <FileWarning className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}
      <button onClick={handleConvert} disabled={loading || !file} className="comic-btn bg-yellow-400 text-black w-full mt-3 text-center disabled:opacity-50">
        {loading ? (
          <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />CONVERTING...</span>
        ) : (
          "MAKE IT WORD!"
        )}
      </button>
    </ComicPanel>
  );
}
