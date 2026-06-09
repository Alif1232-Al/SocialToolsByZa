"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { ImagePlus, Download, X, Sparkles, ChevronLeft, ChevronRight, Palette, LayoutGrid } from "lucide-react";
import ComicPanel from "./ComicPanel";
import { FILTERS } from "@/lib/photo-filters";

const GRID_LAYOUTS = [
  { id: "1x1", cols: 1, rows: 1, cells: 1, label: "1" },
  { id: "2x1", cols: 2, rows: 1, cells: 2, label: "2" },
  { id: "3x1", cols: 3, rows: 1, cells: 3, label: "3" },
  { id: "2x2", cols: 2, rows: 2, cells: 4, label: "4" },
  { id: "3x2", cols: 3, rows: 2, cells: 6, label: "6 A" },
  { id: "2x3", cols: 2, rows: 3, cells: 6, label: "6 B" },
];

const SPECIAL_LAYOUTS = [
  { id: "filmstrip", cols: 1, rows: 4, cells: 4, label: "Film Strip" },
  { id: "photostrip", cols: 1, rows: 4, cells: 4, label: "Photo Strip" },
];

const ALL_LAYOUTS = [...GRID_LAYOUTS, ...SPECIAL_LAYOUTS];

const FILTER_CATEGORIES = [
  { name: "Trending", ids: ["original", "warmfilm", "cinematic", "softpastel", "y2kflash", "noirgrain", "grunge"] },
  { name: "Classic", ids: ["vintage", "popart", "comic", "neon", "cartoon", "lomo", "bw-hc", "halftone", "sketch", "rgbsplit", "pixelate"] },
];

function applyFilterToCanvas(canvas: HTMLCanvasElement, filterId: string) {
  if (filterId === "original") return;
  const f = FILTERS.find((x) => x.id === filterId);
  if (f?.fn) f.fn(canvas);
}

function drawFilmPerforations(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const holeW = 8;
  const holeH = 6;
  const gap = 20;
  const margin = 6;
  ctx.fillStyle = "#1a1a1a";
  for (let y = margin; y < h - margin; y += gap) {
    ctx.fillRect(margin, y, holeW, holeH);
    ctx.fillRect(w - margin - holeW, y, holeW, holeH);
  }
}

export default function Photobox() {
  const [images, setImages] = useState<string[]>([]);
  const [layout, setLayout] = useState("2x2");
  const [filter, setFilter] = useState("original");
  const [filterTab, setFilterTab] = useState<"Trending" | "Classic">("Trending");
  const [ready, setReady] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const loadedImgs = useRef<HTMLImageElement[]>([]);

  const cur = ALL_LAYOUTS.find((l) => l.id === layout) || GRID_LAYOUTS[3];
  const isFilmstrip = layout === "filmstrip";
  const isPhotostrip = layout === "photostrip";
  const isSpecial = isFilmstrip || isPhotostrip;

  const gap = isSpecial ? 4 : 8;
  const pad = isSpecial ? 14 : 16;
  const maxLogicalW = isSpecial ? 360 : 540;
  const maxCells = cur.cells;
  const visible = Math.min(images.length, maxCells);
  const cols = isSpecial ? 1 : cur.cols;
  const rows = isSpecial ? visible : cur.rows;
  const cellGapTotal = (cols - 1) * gap;
  const cellW = Math.floor((maxLogicalW - pad * 2 - cellGapTotal) / cols);
  const cellH = Math.floor(cellW * (isFilmstrip ? 0.85 : 0.75));
  const totalW = cols * cellW + cellGapTotal + pad * 2;
  const totalH = (isSpecial ? rows * cellH + (rows - 1) * gap : cur.rows * cellH + (cur.rows - 1) * gap) + pad * 2;

  useEffect(() => {
    if (images.length === 0) { loadedImgs.current = []; setReady(0); return; }
    const count = Math.min(images.length, maxCells);
    loadedImgs.current = [];
    let loaded = 0;
    for (let i = 0; i < count; i++) {
      const img = new Image();
      img.onload = () => { loaded++; if (loaded === count) setReady((n) => n + 1); };
      img.onerror = () => { loaded++; if (loaded === count) setReady((n) => n + 1); };
      img.crossOrigin = "anonymous";
      img.src = images[i];
      loadedImgs.current.push(img);
    }
  }, [images, layout, maxCells]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const off = offRef.current;
    if (!canvas || !off || loadedImgs.current.length === 0) return;
    const ctx = canvas.getContext("2d")!;

    canvas.width = totalW;
    canvas.height = totalH;

    if (isFilmstrip) {
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, totalW, totalH);
      drawFilmPerforations(ctx, totalW, totalH);
    } else if (isPhotostrip) {
      const grad = ctx.createLinearGradient(0, 0, 0, totalH);
      grad.addColorStop(0, "#fef9c3");
      grad.addColorStop(0.5, "#fef3c7");
      grad.addColorStop(1, "#fde68a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, totalW, totalH);
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, totalW - 8, totalH - 8);
    } else {
      const grad = ctx.createLinearGradient(0, 0, totalW, totalH);
      grad.addColorStop(0, "#fdf2f8");
      grad.addColorStop(0.4, "#fff1f2");
      grad.addColorStop(0.7, "#fef3c7");
      grad.addColorStop(1, "#fce7f3");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, totalW, totalH);
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, totalW - 8, totalH - 8);
      ctx.shadowColor = "rgba(0,0,0,0.1)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.strokeRect(4, 4, totalW - 8, totalH - 8);
      ctx.shadowColor = "transparent";
    }

    for (let i = 0; i < visible; i++) {
      const col = isSpecial ? 0 : i % cur.cols;
      const row = isSpecial ? i : Math.floor(i / cur.cols);
      const x = pad + col * (cellW + gap);
      const y = pad + row * (cellH + gap);
      const borderW = isFilmstrip ? 0 : 2;

      off.width = cellW;
      off.height = cellH;
      const octx = off.getContext("2d")!;
      octx.clearRect(0, 0, cellW, cellH);
      octx.fillStyle = isPhotostrip ? "#fef9c3" : "#fff";
      octx.fillRect(0, 0, cellW, cellH);

      const img = loadedImgs.current[i];
      const s = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - s) / 2;
      const sy = (img.naturalHeight - s) / 2;
      octx.drawImage(img, sx, sy, s, s, borderW, borderW, cellW - borderW * 2, cellH - borderW * 2);
      applyFilterToCanvas(off, filter);
      ctx.drawImage(off, x, y);

      if (!isFilmstrip) {
        ctx.strokeStyle = "#111";
        ctx.lineWidth = isPhotostrip ? 2 : 3;
        ctx.strokeRect(x - 1, y - 1, cellW + 2, cellH + 2);

        if (!isPhotostrip) {
          ctx.fillStyle = "#000";
          ctx.globalAlpha = 0.75;
          ctx.font = 'bold 11px "Inter","Arial",sans-serif';
          ctx.textAlign = "left";
          ctx.textBaseline = "top";
          ctx.fillText(`#${i + 1}`, x + 6, y + 6);
          ctx.globalAlpha = 1;
        }
      }
    }

    if (isFilmstrip) {
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.strokeRect(2, 2, totalW - 4, totalH - 4);
    }

    if (!isSpecial) {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.font = '8px "Inter","Arial",sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("photobox by socialtoolsbyza", totalW / 2, totalH - 5);
    }
  }, [filter, totalW, totalH, cur, cellW, cellH, visible, isFilmstrip, isPhotostrip, isSpecial]);

  useEffect(() => { if (images.length > 0) renderCanvas(); }, [renderCanvas, ready, images.length]);

  const handleUpload = (files: FileList | File[]) => {
    const remaining = 6 - images.length;
    Promise.all(
      Array.from(files).slice(0, remaining).map(
        (f) => new Promise<string>((resolve) => { const r = new FileReader(); r.onload = () => resolve(r.result as string); r.readAsDataURL(f); })
      )
    ).then((results) => setImages((prev) => [...prev, ...results].slice(0, 6)));
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleUpload(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) handleUpload(e.dataTransfer.files);
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const moveImage = (idx: number, dir: -1 | 1) => {
    const to = idx + dir;
    if (to < 0 || to >= images.length) return;
    setImages((prev) => {
      const next = [...prev];
      [next[idx], next[to]] = [next[to], next[idx]];
      return next;
    });
  };

  const downloadPng = () => {
    const c = canvasRef.current;
    if (!c) return;
    const l = document.createElement("a");
    l.download = `photobox-${layout}-${filter}.png`;
    l.href = c.toDataURL("image/png");
    l.click();
  };

  const currentFilters = FILTER_CATEGORIES.find((c) => c.name === filterTab)?.ids || [];
  const isFull = images.length >= 6;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-[2px_2px_0_#000] border-2 border-black">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-headline-md uppercase italic leading-tight">Photobox Studio</h2>
            <p className="font-body text-xs text-gray-500">Bikin collage foto ala booth komik</p>
          </div>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />

      {images.length === 0 ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`relative border-4 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 py-16 px-6 cursor-pointer transition-all ${dragOver ? "border-pink-500 bg-pink-50 scale-[1.02]" : "border-black bg-white hover:bg-gray-50 hover:border-pink-400"}`}
          style={{ boxShadow: dragOver ? "4px 4px 0 rgba(236,72,153,0.3)" : "4px 4px 0 rgba(0,0,0,1)" }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-2 border-black -rotate-3" style={{ boxShadow: "3px 3px 0 rgba(0,0,0,1)" }}>
            <ImagePlus className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <p className="font-display text-xl uppercase italic">Upload Foto</p>
            <p className="font-body text-sm text-gray-500 mt-1">Klik atau drag & drop foto di sini</p>
          </div>
          <span className="font-body text-[10px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">Maksimal 6 foto • JPG, PNG, WebP</span>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-white border-2 border-black rounded-2xl p-4 space-y-4" style={{ boxShadow: "4px 4px 0 rgba(0,0,0,1)" }}>
            <div className="flex items-center justify-between">
              <p className="font-display text-sm uppercase italic">Foto ({images.length}/6)</p>
              <button onClick={() => { setImages([]); loadedImgs.current = []; setReady(0); }}
                className="font-body text-[10px] uppercase font-bold text-red-500 hover:text-red-600 flex items-center gap-1">
                <X className="w-3 h-3" /> Hapus semua
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {images.map((src, i) => (
                <div key={i} className="group relative w-16 h-16 border-2 border-black rounded-lg overflow-hidden shrink-0">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <button onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 border-2 border-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <X className="w-3 h-3 text-white" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {i > 0 && (
                      <button onClick={() => moveImage(i, -1)}
                        className="w-5 h-5 bg-black/70 flex items-center justify-center hover:bg-black transition-colors">
                        <ChevronLeft className="w-3 h-3 text-white" />
                      </button>
                    )}
                    {i < images.length - 1 && (
                      <button onClick={() => moveImage(i, 1)}
                        className="w-5 h-5 bg-black/70 flex items-center justify-center hover:bg-black transition-colors">
                        <ChevronRight className="w-3 h-3 text-white" />
                      </button>
                    )}
                  </div>
                  <span className="absolute top-1 left-1 w-4 h-4 bg-black/70 text-white text-[8px] font-bold flex items-center justify-center rounded">
                    {i + 1}
                  </span>
                </div>
              ))}
              {!isFull && (
                <button onClick={() => fileRef.current?.click()}
                  className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center text-2xl hover:bg-gray-100 hover:border-gray-400 transition-colors shrink-0">
                  +
                </button>
              )}
            </div>
          </div>

          <div className="bg-white border-2 border-black rounded-2xl p-4 space-y-3" style={{ boxShadow: "4px 4px 0 rgba(0,0,0,1)" }}>
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              <p className="font-display text-sm uppercase italic">Layout</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {GRID_LAYOUTS.map((l) => {
                const disabled = images.length > l.cells;
                const active = layout === l.id;
                const cells = Array.from({ length: l.cells });
                return (
                  <button key={l.id} onClick={() => setLayout(l.id)}
                    disabled={disabled}
                    title={`${l.cols}x${l.rows}`}
                    className={`p-2 border-2 rounded-lg transition-all ${active ? "border-pink-500 bg-pink-50" : "border-gray-300 bg-white hover:border-gray-400"} ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                    style={active ? { boxShadow: "2px 2px 0 rgba(236,72,153,0.5)" } : {}}
                  >
                    <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${l.cols}, 1fr)` }}>
                      {cells.map((_, ci) => (
                        <div key={ci} className={`w-4 h-4 rounded-sm ${active ? "bg-pink-400" : "bg-gray-300"}`} />
                      ))}
                    </div>
                    <p className={`font-body text-[9px] mt-1 font-bold uppercase ${active ? "text-pink-600" : "text-gray-400"}`}>{l.label}</p>
                  </button>
                );
              })}
              {SPECIAL_LAYOUTS.map((l) => {
                const disabled = images.length > l.cells || images.length < 2;
                const active = layout === l.id;
                return (
                  <button key={l.id} onClick={() => setLayout(l.id)}
                    disabled={disabled}
                    className={`p-2 border-2 rounded-lg transition-all ${active ? "border-pink-500 bg-pink-50" : "border-gray-300 bg-white hover:border-gray-400"} ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                    style={active ? { boxShadow: "2px 2px 0 rgba(236,72,153,0.5)" } : {}}
                  >
                    <div className="flex flex-col gap-0.5 items-center">
                      {Array.from({ length: 4 }).map((_, ci) => (
                        <div key={ci} className={`w-5 h-3 rounded-sm ${active ? "bg-pink-400" : "bg-gray-300"}`} />
                      ))}
                    </div>
                    <p className={`font-body text-[9px] mt-1 font-bold uppercase ${active ? "text-pink-600" : "text-gray-400"}`}>{l.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white border-2 border-black rounded-2xl p-4 space-y-3" style={{ boxShadow: "4px 4px 0 rgba(0,0,0,1)" }}>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <p className="font-display text-sm uppercase italic">Filter</p>
            </div>
            <div className="flex gap-1 border-b-2 border-gray-200 pb-2">
              {FILTER_CATEGORIES.map((cat) => (
                <button key={cat.name} onClick={() => setFilterTab(cat.name as "Trending" | "Classic")}
                  className={`px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider transition-all rounded-t-lg ${filterTab === cat.name ? "text-pink-600 border-b-2 border-pink-500 -mb-[10px]" : "text-gray-400 hover:text-gray-600"}`}>
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {currentFilters.map((fid) => {
                const f = FILTERS.find((x) => x.id === fid);
                if (!f) return null;
                const active = filter === f.id;
                return (
                  <button key={f.id} onClick={() => setFilter(f.id)}
                    className={`px-3 py-1.5 text-xs border-2 rounded-lg font-display font-bold transition-all ${active ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-black" : "bg-white text-black border-gray-300 hover:border-gray-400 hover:bg-gray-50"}`}
                    style={active ? { boxShadow: "2px 2px 0 rgba(0,0,0,1)" } : {}}
                  >
                    {f.name}
                  </button>
                );
              })}
            </div>
          </div>

          {(isFilmstrip && images.length < 2) && (
            <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-3 text-center">
              <p className="font-body text-xs text-amber-700 font-bold">Film Strip butuh minimal 2 foto</p>
            </div>
          )}

          <div className="flex justify-center">
            <div className="relative inline-block" style={{ boxShadow: "6px 6px 0 rgba(0,0,0,1)" }}>
              <canvas ref={canvasRef} className="w-full max-w-full h-auto border-2 border-black" />
            </div>
          </div>

          <button onClick={downloadPng}
            className="comic-btn bg-gradient-to-r from-purple-600 to-pink-600 text-white w-full text-sm flex items-center justify-center gap-2 py-3 text-base font-bold tracking-wider"
            style={{ boxShadow: "4px 4px 0 rgba(0,0,0,1)" }}>
            <Download className="w-5 h-5" /> DOWNLOAD PNG
          </button>
        </div>
      )}

      <canvas ref={offRef} className="hidden" />
    </div>
  );
}
