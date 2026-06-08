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
  const fileRef = useRef<HTMLInputElement>(null);
  const offRef = useRef<HTMLCanvasElement>(null);
  const loadedImgs = useRef<HTMLImageElement[]>([]);

  const cur = LAYOUTS.find((l) => l.id === layout) || LAYOUTS[3];

  const cellW = 280;
  const cellH = 200;
  const gap = 8;
  const pad = 16;
  const totalW = cur.cols * cellW + (cur.cols - 1) * gap + pad * 2;
  const totalH = cur.rows * cellH + (cur.rows - 1) * gap + pad * 2;

  useEffect(() => {
    if (images.length === 0) { loadedImgs.current = []; setReady(0); return; }
    const visible = Math.min(images.length, cur.cols * cur.rows);
    loadedImgs.current = [];
    let count = 0;
    for (let i = 0; i < visible; i++) {
      const img = new Image();
      img.onload = () => {
        count++;
        if (count === visible) setReady((n) => n + 1);
      };
      img.onerror = () => {
        count++;
        if (count === visible) setReady((n) => n + 1);
      };
      img.crossOrigin = "anonymous";
      img.src = images[i];
      loadedImgs.current.push(img);
    }
  }, [images, layout]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const off = offRef.current;
    if (!canvas || !off) return;
    if (loadedImgs.current.length === 0) return;
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
  }, [filter, totalW, totalH, cur]);

  useEffect(() => { if (images.length > 0) renderCanvas(); }, [renderCanvas, ready, images.length]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 6 - images.length;
    const toAdd = files.slice(0, remaining);
    Promise.all(
      toAdd.map(
        (f) =>
          new Promise<string>((resolve) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result as string);
            r.readAsDataURL(f);
          })
      )
    ).then((results) => setImages((prev) => [...prev, ...results].slice(0, 6)));
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "photobox-comic.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <ComicPanel bgColor="bg-yellow-200" badge="BOOTH!" badgeColor="bg-purple-600 text-white">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-6 h-6 shrink-0" />
        <h3 className="font-display text-headline-md uppercase italic">Photobox Comic Studio</h3>
      </div>
      <p className="font-body text-body-md text-gray-800 mb-4">
        Upload 1-6 foto, pilih layout &amp; filter komik, download hasilnya!
      </p>

      <div className="flex flex-col gap-3">
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />

        <button onClick={() => fileRef.current?.click()} disabled={images.length >= 6}
          className="comic-btn bg-pink-500 text-white text-sm flex items-center justify-center gap-2 py-2 disabled:opacity-40">
          <ImagePlus className="w-4 h-4" />{images.length >= 6 ? "MAX 6 FOTO" : `UPLOAD FOTO (${images.length}/6)`}
        </button>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {images.map((src, i) => (
              <div key={i} className="relative w-16 h-16 border-2 border-black shrink-0">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 border-2 border-black rounded-full flex items-center justify-center">
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <>
            <div>
              <p className="font-body text-[10px] font-bold uppercase tracking-wider mb-1.5 text-gray-500">Layout</p>
              <div className="flex gap-1.5">
                {LAYOUTS.map((l) => (
                  <button key={l.id} onClick={() => setLayout(l.id)}
                    disabled={images.length > l.cols * l.rows}
                    className={`w-10 h-10 border-2 border-black flex items-center justify-center font-display text-xs font-bold transition-all ${layout === l.id ? "bg-black text-white scale-105" : "bg-white text-black"} disabled:opacity-25 disabled:cursor-not-allowed`}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-body text-[10px] font-bold uppercase tracking-wider mb-1.5 text-gray-500">Filter</p>
              <div className="flex gap-1.5 flex-wrap max-h-[84px] overflow-y-auto">
                {FILTERS.map((f) => (
                  <button key={f.id} onClick={() => setFilter(f.id)}
                    className={`px-2.5 py-1 text-[10px] border-2 border-black font-display font-bold tracking-wide transition-all ${filter === f.id ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}>
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <canvas ref={canvasRef} className="max-w-full shadow-[4px_4px_0_#000]" />
            </div>

            <button onClick={downloadPng}
              className="comic-btn bg-black text-white w-full text-sm flex items-center justify-center gap-1 py-2">
              <Download className="w-4 h-4" /> DOWNLOAD PNG
            </button>
          </>
        )}

        <canvas ref={offRef} className="hidden" />
      </div>
    </ComicPanel>
  );
}
