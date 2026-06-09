"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { ImagePlus, Download, X, Sparkles, ChevronLeft, ChevronRight, Palette, LayoutGrid, Frame, Pen } from "lucide-react";
import { FILTERS } from "@/lib/photo-filters";
import { FRAMES, DEFAULT_CUSTOM, renderCustomBackground, drawCustomFrameText, drawFrameText } from "@/lib/photo-frames";
import type { CustomFrameOptions } from "@/lib/photo-frames";

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

const COLOR_SWATCHES = [
  "#111", "#fff", "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
  "#fdf2f8", "#fef3c7", "#dbeafe", "#bbf7d0", "#fce7f3", "#e0f2fe", "#f8fafc", "#020617",
];

const DECORATIONS = [
  { id: "none", label: "None", emoji: "⬜" },
  { id: "stars", label: "Stars", emoji: "⭐" },
  { id: "hearts", label: "Hearts", emoji: "❤️" },
  { id: "dots", label: "Dots", emoji: "🔵" },
  { id: "circles", label: "Circles", emoji: "⭕" },
];

const TRENDY_TEXTS = [
  "MY MOMENTS", "BESTIES", "FOREVER", "VIBES", "LIT", "SLAY", "ICONIC",
  "GOALS", "FAMILY", "SQUAD", "DREAM", "BLESSED", "LOVE", "PEACE",
  "WILD", "FREE", "BOSS", "CHILL", "FIRE", "LIT AF",
];

function applyFilterToCanvas(canvas: HTMLCanvasElement, filterId: string) {
  if (filterId === "original") return;
  const f = FILTERS.find((x) => x.id === filterId);
  if (f?.fn) f.fn(canvas);
}

function drawFilmPerforations(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const holeW = 8, holeH = 6, gap = 20, margin = 6;
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
  const [frameId, setFrameId] = useState("comic-boom");
  const [filterTab, setFilterTab] = useState<"Trending" | "Classic">("Trending");
  const [customOpts, setCustomOpts] = useState<CustomFrameOptions>(DEFAULT_CUSTOM);
  const [ready, setReady] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const loadedImgs = useRef<HTMLImageElement[]>([]);
  const customTextRef = useRef<HTMLInputElement>(null);

  const isCustom = frameId === "custom";
  const cur = ALL_LAYOUTS.find((l) => l.id === layout) || GRID_LAYOUTS[3];
  const isFilmstrip = layout === "filmstrip";
  const isPhotostrip = layout === "photostrip";
  const isSpecial = isFilmstrip || isPhotostrip;
  const frame = !isCustom ? FRAMES.find((f) => f.id === frameId) || FRAMES[0] : null;
  const maxCells = cur.cells;
  const visible = Math.min(images.length, maxCells);
  const cols = isSpecial ? 1 : cur.cols;
  const rows = isSpecial ? visible : cur.rows;
  const gap = isSpecial ? 4 : 8;
  const pad = isSpecial ? 14 : 16;
  const maxLogicalW = isSpecial ? 360 : 540;
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
      const g = ctx.createLinearGradient(0, 0, 0, totalH);
      g.addColorStop(0, "#fef9c3");
      g.addColorStop(0.5, "#fef3c7");
      g.addColorStop(1, "#fde68a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, totalW, totalH);
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, totalW - 8, totalH - 8);
    } else if (isCustom) {
      renderCustomBackground(ctx, totalW, totalH, customOpts);
      const bw = customOpts.borderWidth;
      ctx.strokeStyle = customOpts.borderColor;
      ctx.lineWidth = bw;
      ctx.strokeRect(bw / 2, bw / 2, totalW - bw, totalH - bw);
    } else if (frame) {
      frame.render(ctx, totalW, totalH);
      const bw = frame.borderWidth;
      ctx.strokeStyle = frame.borderColor;
      ctx.lineWidth = bw;
      ctx.strokeRect(bw / 2, bw / 2, totalW - bw, totalH - bw);
    }

    for (let i = 0; i < visible; i++) {
      const col = isSpecial ? 0 : i % cur.cols;
      const row = isSpecial ? i : Math.floor(i / cur.cols);
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
      const cellBw = isSpecial ? (isFilmstrip ? 0 : 2) : isCustom ? customOpts.cellBorderWidth : (frame?.cellBorderWidth ?? 2);
      octx.drawImage(img, sx, sy, s, s, cellBw, cellBw, cellW - cellBw * 2, cellH - cellBw * 2);
      applyFilterToCanvas(off, filter);
      ctx.drawImage(off, x, y);

      if (!isFilmstrip) {
        const cellBc = isPhotostrip ? "#111" : isCustom ? customOpts.cellBorderColor : (frame?.cellBorderColor ?? "#111");
        ctx.strokeStyle = cellBc;
        ctx.lineWidth = isPhotostrip ? 2 : isCustom ? customOpts.cellBorderWidth : (frame?.cellBorderWidth ?? 2);
        ctx.strokeRect(x - 1, y - 1, cellW + 2, cellH + 2);

        const showNums = isCustom ? true : (frame?.showNumbers ?? true);
        if (showNums && !isPhotostrip) {
          ctx.fillStyle = "rgba(0,0,0,0.65)";
          ctx.font = 'bold 11px "Inter","Arial",sans-serif';
          ctx.textAlign = "left";
          ctx.textBaseline = "top";
          ctx.fillRect(x + 4, y + 4, 18, 18);
          ctx.fillStyle = "#fff";
          ctx.fillText(`${i + 1}`, x + 6, y + 6);
        }
      }
    }

    if (isFilmstrip) {
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.strokeRect(2, 2, totalW - 4, totalH - 4);
    }

    if (isCustom && customOpts.textEnabled && customOpts.text.trim()) {
      drawCustomFrameText(ctx, totalW, totalH, customOpts.text, customOpts.textColor, customOpts.textBg, customOpts.textPosition);
    } else if (frame?.text && !isSpecial) {
      drawFrameText(ctx, totalW, totalH, frame.text);
    }

    const showWm = isCustom ? false : (frame?.watermark ?? false);
    if (showWm && !isSpecial) {
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.font = '8px "Inter","Arial",sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("photobox by socialtoolsbyza", totalW / 2, totalH - 5);
    }
  }, [filter, frameId, customOpts, totalW, totalH, cur, cellW, cellH, visible, isFilmstrip, isPhotostrip, isSpecial, frame, isCustom]);

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
    l.download = `photobox-${layout}-${filter}-${frameId}.png`;
    l.href = c.toDataURL("image/png");
    l.click();
  };

  const updateCustom = <K extends keyof CustomFrameOptions>(key: K, value: CustomFrameOptions[K]) => {
    setCustomOpts((prev) => ({ ...prev, [key]: value }));
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
            <p className="font-body text-xs text-gray-500">Bikin collage foto dengan berbagai tema</p>
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
              <Frame className="w-4 h-4" />
              <p className="font-display text-sm uppercase italic">Bingkai</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {FRAMES.map((f) => {
                const active = frameId === f.id;
                return (
                  <button key={f.id} onClick={() => setFrameId(f.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border-2 rounded-lg font-display font-bold transition-all ${active ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-black" : "bg-white text-black border-gray-300 hover:border-gray-400 hover:bg-gray-50"}`}
                    style={active ? { boxShadow: "2px 2px 0 rgba(0,0,0,1)" } : {}}
                  >
                    <span className="text-sm">{f.emoji}</span>
                    <span>{f.name}</span>
                  </button>
                );
              })}
              <button onClick={() => setFrameId("custom")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border-2 rounded-lg font-display font-bold transition-all ${frameId === "custom" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-black" : "bg-white text-black border-gray-300 hover:border-gray-400 hover:bg-gray-50"}`}
                style={frameId === "custom" ? { boxShadow: "2px 2px 0 rgba(0,0,0,1)" } : {}}
              >
                <Pen className="w-3.5 h-3.5" />
                <span>Custom</span>
              </button>
            </div>
          </div>

          {isCustom && (
            <div className="bg-white border-2 border-black rounded-2xl p-4 space-y-4" style={{ boxShadow: "4px 4px 0 rgba(0,0,0,1)" }}>
              <div className="flex items-center gap-2">
                <Pen className="w-4 h-4" />
                <p className="font-display text-sm uppercase italic">Edit Bingkai Custom</p>
              </div>

              <div className="space-y-1">
                <p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Tipe Background</p>
                <div className="flex gap-2">
                  <button onClick={() => updateCustom("bgType", "gradient")}
                    className={`px-3 py-1.5 text-xs border-2 rounded-lg font-bold transition-all ${customOpts.bgType === "gradient" ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"}`}>
                    Gradient
                  </button>
                  <button onClick={() => updateCustom("bgType", "solid")}
                    className={`px-3 py-1.5 text-xs border-2 rounded-lg font-bold transition-all ${customOpts.bgType === "solid" ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"}`}>
                    Solid
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Warna 1</p>
                  <div className="flex gap-1 flex-wrap">
                    {COLOR_SWATCHES.map((c) => (
                      <button key={c} onClick={() => updateCustom("bgColor1", c)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${customOpts.bgColor1 === c ? "border-black scale-110" : "border-gray-200"}`}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                {customOpts.bgType === "gradient" && (
                  <div className="space-y-1">
                    <p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Warna 2</p>
                    <div className="flex gap-1 flex-wrap">
                      {COLOR_SWATCHES.map((c) => (
                        <button key={c} onClick={() => updateCustom("bgColor2", c)}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${customOpts.bgColor2 === c ? "border-black scale-110" : "border-gray-200"}`}
                          style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Dekorasi</p>
                <div className="flex gap-1.5 flex-wrap">
                  {DECORATIONS.map((d) => (
                    <button key={d.id} onClick={() => updateCustom("decoration", d.id as CustomFrameOptions["decoration"])}
                      className={`px-2.5 py-1 text-xs border-2 rounded-lg font-bold transition-all ${customOpts.decoration === d.id ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"}`}>
                      {d.emoji} {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Warna Border Luar</p>
                  <div className="flex gap-1 flex-wrap">
                    {COLOR_SWATCHES.slice(0, 10).map((c) => (
                      <button key={c} onClick={() => updateCustom("borderColor", c)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${customOpts.borderColor === c ? "border-black scale-110" : "border-gray-200"}`}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Warna Border Foto</p>
                  <div className="flex gap-1 flex-wrap">
                    {COLOR_SWATCHES.slice(0, 10).map((c) => (
                      <button key={c} onClick={() => updateCustom("cellBorderColor", c)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${customOpts.cellBorderColor === c ? "border-black scale-110" : "border-gray-200"}`}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-display text-sm uppercase italic">Teks</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="font-body text-[10px] font-bold text-gray-500">Tampilkan</span>
                    <input type="checkbox" checked={customOpts.textEnabled} onChange={(e) => updateCustom("textEnabled", e.target.checked)}
                      className="w-4 h-4 accent-pink-500" />
                  </label>
                </div>
                {customOpts.textEnabled && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input ref={customTextRef} type="text" value={customOpts.text} onChange={(e) => updateCustom("text", e.target.value)}
                        placeholder="Ketik teks..."
                        className="flex-1 px-3 py-1.5 text-xs border-2 border-black rounded-lg font-display font-bold uppercase outline-none" />
                      <div className="relative group">
                        <button className="px-2 py-1.5 text-xs border-2 border-black rounded-lg font-bold bg-white hover:bg-gray-100">
                          💡
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white border-2 border-black rounded-xl p-2 hidden group-hover:grid grid-cols-3 gap-1 z-20 shadow-[4px_4px_0_#000]">
                          {TRENDY_TEXTS.map((t) => (
                            <button key={t} onClick={() => updateCustom("text", t)}
                              className="text-[8px] font-bold px-1 py-1 bg-gray-100 rounded hover:bg-pink-100 transition-colors uppercase">
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Warna Teks</p>
                        <div className="flex gap-1 flex-wrap">
                          {["#fff", "#000", "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"].map((c) => (
                            <button key={c} onClick={() => updateCustom("textColor", c)}
                              className={`w-6 h-6 rounded-full border-2 transition-all ${customOpts.textColor === c ? "border-black scale-110" : "border-gray-200"}`}
                              style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Background Teks</p>
                        <div className="flex gap-1 flex-wrap">
                          {["#000", "#fff", "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"].map((c) => (
                            <button key={c} onClick={() => updateCustom("textBg", c)}
                              className={`w-6 h-6 rounded-full border-2 transition-all ${customOpts.textBg === c ? "border-black scale-110" : "border-gray-200"}`}
                              style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Posisi</p>
                        <div className="flex gap-1">
                          <button onClick={() => updateCustom("textPosition", "top-bar")}
                            className={`px-2.5 py-1 text-[10px] border-2 rounded-lg font-bold transition-all ${customOpts.textPosition === "top-bar" ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-300"}`}>
                            Atas
                          </button>
                          <button onClick={() => updateCustom("textPosition", "bottom-bar")}
                            className={`px-2.5 py-1 text-[10px] border-2 rounded-lg font-bold transition-all ${customOpts.textPosition === "bottom-bar" ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-300"}`}>
                            Bawah
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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
