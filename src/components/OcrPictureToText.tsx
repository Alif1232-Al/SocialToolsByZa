"use client";
import { useState, useCallback, useRef } from "react";
import { Scan, Upload, Copy, Loader2 } from "lucide-react";
import ComicPanel from "./ComicPanel";
import toast from "react-hot-toast";

export default function OcrPictureToText() {
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<File | null>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError("");
    setOcrText("");
    fileRef.current = f;
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
  }, []);

  const handleOcr = useCallback(async () => {
    if (!fileRef.current) return;
    setLoading(true);
    setError("");
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng");
      const { data } = await worker.recognize(fileRef.current);
      setOcrText(data.text);
      toast.success("Teks berhasil di-extract!");
      await worker.terminate();
    } catch {
      setError("Gagal membaca teks. Coba gambar dengan resolusi lebih baik.");
      toast.error("Gagal membaca teks");
    } finally {
      setLoading(false);
    }
  }, []);

  const copyText = useCallback(() => {
    navigator.clipboard.writeText(ocrText).then(() => toast.success("Teks dicopy!")).catch(() => {});
  }, [ocrText]);

  return (
    <ComicPanel bgColor="bg-yellow-400" badge="SCAN!" badgeColor="bg-black text-white">
      <h3 className="font-display text-headline-md uppercase italic mb-4 flex items-center gap-2"><Scan className="w-6 h-6" />OCR Picture to Text</h3>
      <div className="flex flex-col md:flex-row gap-3 flex-grow min-h-[200px]">
        <label className="flex-1 dashed-border bg-white flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-50 transition-colors">
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="max-h-32 object-contain" />
          ) : (
            <>
              <Upload className="w-8 h-8 mb-2" />
              <p className="font-body font-bold uppercase text-xs text-center">Upload Image to Scan</p>
            </>
          )}
        </label>
        <div className="flex-1 bg-white border-4 border-black relative">
          <textarea value={ocrText} onChange={(e) => setOcrText(e.target.value)}
                    className="w-full h-full min-h-[120px] p-3 resize-none outline-none font-body text-sm"
                    placeholder="Text results will appear here..." />
        </div>
      </div>
      {error && <p className="mt-2 bg-red-100 border-2 border-red-500 text-red-700 p-2 font-body font-bold text-xs">{error}</p>}
      <div className="flex gap-2 mt-3">
        <button onClick={handleOcr} disabled={loading} className="comic-btn bg-black text-white flex-1 text-center disabled:opacity-50">
          {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />SCANNING...</span> : "SCAN!"}
        </button>
        <button onClick={copyText} disabled={!ocrText} className="comic-btn bg-black text-white flex items-center justify-center gap-1 disabled:opacity-50"><Copy className="w-4 h-4" /> COPY TEXT!</button>
      </div>
    </ComicPanel>
  );
}
