"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { ImagePlus, Download, X, Sparkles } from "lucide-react";
import ComicPanel from "./ComicPanel";
import { FILTERS } from "@/lib/photo-filters";

const LAYOUTS = [
  { id: "1x1", cols: 1, rows: 1, label: "1" },
  { id: "2x1", cols: 2, rows: 1, label: "2" },
  { id: "3x1", cols: 3, rows: 1, label: "3" },
  { id: "2x2", cols: 2, rows: 2, label: "4" },
  { id: "3x2", cols: 3, rows: 2, label: "6" },
  { id: "2x3", cols: 2, rows: 3, label: "6" },
];

function applyFilterToCanvas(canvas: HTMLCanvasElement, filterId: string) {
  if (filterId === "original") return;
  const f = FILTERS.find((x) => x.id === filterId);
  if (f?.fn) f.fn(canvas);
}

export default function Photobox() {
  const [images, setImages] = useState<string[]>([]);
  const [layout, setLayout] = useState("2x2");
  const [filter, setFilter] = useState("original");
  const [ready, setReady] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const loadedImgs = useRef<HTMLImageElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const cur = LAYOUTS.find((l) => l.id === layout) || LAYOUTS[3];
  const gap = 8;
  const pad = 16;
  const maxLogicalW = 540;
  const cellGapTotal = (cur.cols - 1) * gap;
  const cellW = Math.floor((maxLogicalW - pad * 2 - cellGapTotal) / cur.cols);
  const cellH = Math.floor(cellW * 0.75);
  const totalW = cur.cols * cellW + cellGapTotal + pad * 2;
  const totalH = cur.rows * cellH + (cur.rows - 1) * gap + pad * 2;

  useEffect(() => {
    if (images.length === 0) { loadedImgs.current = []; setReady(0); return; }
    const visible = Math.min(images.length, cur.cols * cur.rows);
    loadedImgs.current = [];
    let count = 0;
    for (let i = 0; i < visible; i++) {
      const img = new Image();
      img.onload = () => { count++; if (count === visible) setReady((n) => n + 1); };
      img.onerror = () => { count++; if (count === visible) setReady((n) => n + 1); };
      img.crossOrigin = "anonymous";
      img.src = images[i];
      loadedImgs.current.push(img);
    }
  }, [images, layout]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const off = offRef.current;
    if (!canvas || !off || loadedImgs.current.length === 0) return;
    const ctx = canvas.getContext("2d")!;

    canvas.width = totalW;
    canvas.height = totalH;

    const grad = ctx.createLinearGradient(0, 0, totalW, totalH);
    grad.addColorStop(0, "#fdf2f8");
    grad.addColorStop(1, "#fef3c7");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, totalW, totalH);

    ctx.strokeStyle = "#111";
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, totalW - 8, totalH - 8);

    const count = Math.min(loadedImgs.current.length, cur.cols * cur.rows);
    for (let i = 0; i < count; i++) {
      const col = i % cur.cols;
      const row = Math.floor(i / cur.cols);
      const x = pad + col * (cellW + gap);
      const y = pad + row * (cellH + gap);

      off.width = cellW;
      off.height = cellH;
      const octx = off.getContext("2d")!;
      octx.clearRect(0, 0, cellW, cellH);

      const img = loadedImgs.current[i];
      const s = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - s) / 2;
      const sy = (img.naturalHeight - s) / 2;
      octx.drawImage(img, sx, sy, s, s, 0, 0, cellW, cellH);
      applyFilterToCanvas(off, filter);
      ctx.drawImage(off, x, y);

      ctx.strokeStyle = "#111";
      ctx.lineWidth = 3;
      ctx.strokeRect(x - 2, y - 2, cellW + 4, cellH + 4);
      ctx.fillStyle = "#000";
      ctx.font = 'bold 11px "Inter","Arial",sans-serif';
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(`#${i + 1}`, x + 6, y + 6);
    }

    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.font = '9px "Inter","Arial",sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("photobox by socialtoolsbyza", totalW / 2, totalH - 6);
  }, [filter, totalW, totalH, cur, cellW, cellH]);

  useEffect(() => { if (images.length > 0) renderCanvas(); }, [renderCanvas, ready, images.length]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 6 - images.length;
    Promise.all(
      files.slice(0, remaining).map(
        (f) => new Promise<string>((resolve) => { const r = new FileReader(); r.onload = () => resolve(r.result as string); r.readAsDataURL(f); })
      )
    ).then((results) => setImages((prev) => [...prev, ...results].slice(0, 6)));
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const downloadPng = () => {
    const c = canvasRef.current;
    if (!c) return;
    const l = document.createElement("a");
    l.download = "photobox-comic.png";
    l.href = c.toDataURL("image/png");
    l.click();
  };

  return (
    <ComicPanel bgColor="bg-yellow-200" badge="BOOTH!" badgeColor="bg-purple-600 text-white">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-6 h-6 shrink-0" />
        <h3 className="font-display text-headline-md uppercase italic">Photobox Comic Studio</h3>
      </div>
      <p className="font-body text-body-md text-gray-800 mb-4">
        Upload 1-6 foto, atur layout, pilih filter, download collage komik.
      </p>

      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />

      {images.length === 0 ? (
        <button onClick={() => fileRef.current?.click()}
          className="comic-btn bg-pink-500 text-white w-full text-sm flex flex-col items-center justify-center gap-1 py-8 border-dashed border-4 border-black">
          <ImagePlus className="w-8 h-8" />
          <span className="font-display text-sm">UPLOAD FOTO</span>
          <span className="font-body text-[10px] opacity-60">Maksimal 6 foto</span>
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 flex-wrap">
              {images.map((src, i) => (
                <div key={i} className="relative w-12 h-12 border-2 border-black shrink-0">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 border border-black rounded-full flex items-center justify-center">
                    <X className="w-2.5 h-2.5 text-white" />
                  </button>
                </div>
              ))}
              {images.length < 6 && (
                <button onClick={() => fileRef.current?.click()}
                  className="w-12 h-12 border-2 border-black bg-white text-gray-400 flex items-center justify-center text-lg font-bold hover:bg-gray-100">
                  +
                </button>
              )}
            </div>
            <span className="text-[10px] font-bold text-gray-400 shrink-0">{images.length}/6</span>
          </div>

          <div>
            <p className="font-body text-[10px] font-bold uppercase tracking-wider mb-1 text-gray-500">Layout</p>
            <div className="flex gap-1.5">
              {LAYOUTS.map((l) => (
                <button key={l.id} onClick={() => setLayout(l.id)}
                  disabled={images.length > l.cols * l.rows}
                  className={`w-9 h-9 border-2 border-black flex items-center justify-center font-display text-xs font-bold transition-all ${layout === l.id ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"} disabled:opacity-25 disabled:cursor-not-allowed`}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-body text-[10px] font-bold uppercase tracking-wider mb-1 text-gray-500">Filter</p>
            <div className="flex gap-1 flex-wrap">
              {FILTERS.map((f) => (
                <button key={f.id} onClick={() => setFilter(f.id)}
                  className={`px-2.5 py-1 text-[10px] border-2 border-black font-display font-bold transition-all ${filter === f.id ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}>
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          <div ref={containerRef} className="flex justify-center overflow-hidden">
            <canvas ref={canvasRef} className="w-full max-w-full h-auto shadow-[4px_4px_0_#000]" style={{ maxHeight: '350px' }} />
          </div>

          <button onClick={downloadPng}
            className="comic-btn bg-black text-white w-full text-sm flex items-center justify-center gap-1 py-2">
            <Download className="w-4 h-4" /> DOWNLOAD PNG
          </button>
        </div>
      )}

      <canvas ref={offRef} className="hidden" />
    </ComicPanel>
  );
}
