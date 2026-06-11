"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Scan, Upload, Copy, Loader2, Languages, FileText, FileDown, FileJson, ImageIcon, Type, Sparkles } from "lucide-react";
import ComicPanel from "./ComicPanel";
import toast from "react-hot-toast";

const LANGUAGES = [
  { value: "eng", label: "English" },
  { value: "ind", label: "Bahasa Indonesia" },
  { value: "eng+ind", label: "English + Indonesia" },
];

type WordBox = {
  text: string;
  x0: number; y0: number;
  x1: number; y1: number;
  confidence: number;
};

function exportTxt(text: string, filename: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, `${filename}.txt`);
}

async function exportDocx(text: string, filename: string) {
  const { Document, Packer, Paragraph, TextRun } = await import("docx");
  const doc = new Document({
    sections: [{
      children: text.split("\n").map(line =>
        new Paragraph({
          children: [new TextRun({ text: line || " ", size: 22 })],
          spacing: { after: 120 },
        })
      ),
    }],
  });
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${filename}.docx`);
}

async function exportPdf(text: string, filename: string) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(text, 180);
  let y = 20;
  for (const line of lines) {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.text(line, 15, y);
    y += 7;
  }
  doc.save(`${filename}.pdf`);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function confidenceColor(conf: number): string {
  if (conf > 90) return "rgba(34,197,94,0.35)";
  if (conf > 70) return "rgba(234,179,8,0.35)";
  if (conf > 50) return "rgba(249,115,22,0.35)";
  return "rgba(239,68,68,0.35)";
}

export default function OcrPictureToText() {
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lang, setLang] = useState("eng");
  const [words, setWords] = useState<WordBox[]>([]);
  const [imageDims, setImageDims] = useState({ w: 0, h: 0 });
  const [showHighlight, setShowHighlight] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<File | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Hanya file gambar yang didukung");
      return;
    }
    setError("");
    setOcrText("");
    setWords([]);
    fileRef.current = file;
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }, []);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
  }, [handleFile]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  }, [handleFile]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => setDragOver(false), []);

  useEffect(() => {
    if (!previewUrl) return;
    const img = new Image();
    img.onload = () => setImageDims({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = previewUrl;
  }, [previewUrl]);

  const handleOcr = useCallback(async () => {
    if (!fileRef.current) return;
    setLoading(true);
    setError("");
    setWords([]);
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker(lang);
      const { data } = await worker.recognize(fileRef.current);
      setOcrText(data.text);

      const detected: WordBox[] = [];
      const raw = data as unknown as Record<string, unknown>;
      const blocks = raw.blocks as Array<Record<string, unknown>> | undefined;
      if (blocks) {
        for (const block of blocks) {
          const paragraphs = block.paragraphs as Array<Record<string, unknown>> | undefined;
          if (!paragraphs) continue;
          for (const para of paragraphs) {
            const wordList = para.words as Array<Record<string, unknown>> | undefined;
            if (!wordList) continue;
            for (const word of wordList) {
              const b = word.bbox as { x0: number; y0: number; x1: number; y1: number };
              detected.push({
                text: word.text as string,
                x0: b.x0, y0: b.y0,
                x1: b.x1, y1: b.y1,
                confidence: word.confidence as number,
              });
            }
          }
        }
      }
      setWords(detected);
      toast.success(`Teks berhasil di-extract! (${data.text.length} karakter)`);
      await worker.terminate();
    } catch {
      setError("Gagal membaca teks. Coba gambar dengan resolusi lebih baik.");
      toast.error("Gagal membaca teks");
    } finally {
      setLoading(false);
    }
  }, [lang]);

  const copyText = useCallback(() => {
    navigator.clipboard.writeText(ocrText)
      .then(() => toast.success("Teks dicopy!"))
      .catch(() => toast.error("Gagal menyalin teks"));
  }, [ocrText]);

  const charCount = ocrText.length;
  const wordCount = ocrText.trim() ? ocrText.trim().split(/\s+/).length : 0;
  const lineCount = ocrText ? ocrText.split("\n").filter(Boolean).length : 0;

  const imgWidth = imgRef.current?.clientWidth ?? 300;
  const scaleX = imgWidth / (imageDims.w || 1);
  const scaleY = (imgRef.current?.clientHeight ?? 200) / (imageDims.h || 1);

  return (
    <ComicPanel bgColor="bg-yellow-400" badge="SCAN!" badgeColor="bg-black text-white">
      <h3 className="font-display text-headline-md uppercase italic mb-4 flex items-center gap-2">
        <Scan className="w-6 h-6" />OCR Picture to Text
      </h3>

      <div className="flex flex-col gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-black/60" />
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            className="font-body font-bold text-xs border-4 border-black bg-white px-2 py-1.5 outline-none flex-1"
          >
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 flex-grow min-h-[200px]">
        <div className="flex-1 flex flex-col gap-2">
          <label
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`flex-1 dashed-border bg-white flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-50 transition-colors min-h-[140px] ${dragOver ? "bg-cyan-100 border-cyan-500" : ""}`}
          >
            <input type="file" accept="image/*" className="hidden" onChange={onInputChange} />
            {previewUrl ? (
              <div className="relative w-full">
                <img ref={imgRef} src={previewUrl} alt="Preview" className="w-full max-h-40 object-contain" />
                {showHighlight && words.length > 0 && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${imageDims.w || 1} ${imageDims.h || 1}`}>
                    {words.map((w, i) => (
                      <rect
                        key={i}
                        x={w.x0} y={w.y0}
                        width={w.x1 - w.x0}
                        height={w.y1 - w.y0}
                        fill={confidenceColor(w.confidence)}
                        stroke={w.confidence < 70 ? "#ef4444" : "none"}
                        strokeWidth={0.5}
                        rx={1}
                      />
                    ))}
                  </svg>
                )}
                {words.length > 0 && (
                  <button
                    onClick={() => setShowHighlight(p => !p)}
                    className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 font-body font-bold rounded"
                  >
                    {showHighlight ? "HIDE" : "SHOW"}
                  </button>
                )}
              </div>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                <p className="font-body font-bold uppercase text-xs text-center">Upload atau drag & drop gambar</p>
                <p className="font-body text-[10px] text-gray-400 mt-1">JPG, PNG, WebP</p>
              </>
            )}
          </label>
          <button onClick={handleOcr} disabled={loading || !previewUrl}
            className="comic-btn bg-black text-white w-full text-center disabled:opacity-50">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />SCANNING...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> SCAN!
              </span>
            )}
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex-1 bg-white border-4 border-black relative">
            <textarea ref={textareaRef} value={ocrText} onChange={e => setOcrText(e.target.value)}
              className="w-full h-full min-h-[140px] p-3 resize-none outline-none font-body text-sm"
              placeholder="Hasil teks akan muncul di sini..."
            />
          </div>
          {ocrText && (
            <div className="flex items-center gap-3 text-[10px] font-body font-bold text-gray-600 px-1">
              <span className="flex items-center gap-1"><Type className="w-3 h-3" />{charCount} chars</span>
              <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{wordCount} words</span>
              <span className="flex items-center gap-1"><FileJson className="w-3 h-3" />{lineCount} lines</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 bg-red-100 border-2 border-red-500 text-red-700 p-2 font-body font-bold text-xs">{error}</p>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        <button onClick={handleOcr} disabled={loading || !previewUrl}
          className="comic-btn bg-black text-white flex-1 text-center disabled:opacity-50 md:hidden">
          {loading ? (
            <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />SCANNING...</span>
          ) : "SCAN!"}
        </button>
        <button onClick={copyText} disabled={!ocrText}
          className="comic-btn bg-black text-white flex items-center justify-center gap-1 disabled:opacity-50">
          <Copy className="w-4 h-4" /> COPY
        </button>
        <button onClick={() => exportTxt(ocrText, "ocr-result")} disabled={!ocrText}
          className="comic-btn bg-green-600 text-white flex items-center justify-center gap-1 disabled:opacity-50 text-xs">
          <FileDown className="w-4 h-4" /> .TXT
        </button>
        <button onClick={() => exportDocx(ocrText, "ocr-result")} disabled={!ocrText}
          className="comic-btn bg-blue-600 text-white flex items-center justify-center gap-1 disabled:opacity-50 text-xs">
          <FileText className="w-4 h-4" /> .DOCX
        </button>
        <button onClick={() => exportPdf(ocrText, "ocr-result")} disabled={!ocrText}
          className="comic-btn bg-red-600 text-white flex items-center justify-center gap-1 disabled:opacity-50 text-xs">
          <FileDown className="w-4 h-4" /> .PDF
        </button>
      </div>
    </ComicPanel>
  );
}
