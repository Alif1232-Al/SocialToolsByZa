"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { Link, Plus, Trash2, Download, Camera } from "lucide-react";
import ComicPanel from "./ComicPanel";

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

const PLATFORMS = [
  "Instagram", "TikTok", "YouTube", "Twitter / X", "LinkedIn",
  "WhatsApp", "Telegram", "GitHub", "Website", "Shopee",
  "Facebook", "Threads", "Snapchat", "Discord", "Spotify",
];

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "📸", tiktok: "🎵", youtube: "▶️",
  "twitter / x": "🐦", linkedin: "💼", whatsapp: "💬",
  telegram: "✈️", github: "💻", website: "🌐",
  shopee: "🛒", facebook: "👍", threads: "🧵",
  snapchat: "👻", discord: "🎮", spotify: "🎧",
};

type LinkItem = { id: string; label: string; url: string };

let idCounter = 0;
function nextId() { return ++idCounter + ""; }

function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    instagram: "#E4405F", tiktok: "#000000", youtube: "#FF0000",
    twitter: "#000000", linkedin: "#0A66C2", whatsapp: "#25D366",
    telegram: "#0088CC", github: "#333333", website: "#6366F1",
    shopee: "#EE4D2D", facebook: "#1877F2", threads: "#000000",
    snapchat: "#FFFC00", discord: "#5865F2", spotify: "#1DB954",
  };
  for (const [key, val] of Object.entries(colors)) {
    if (platform.toLowerCase().includes(key)) return val;
  }
  return "#333";
}

function getPlatformIcon(platform: string): string {
  for (const [key, val] of Object.entries(PLATFORM_ICONS)) {
    if (platform.toLowerCase().includes(key)) return val;
  }
  return "🔗";
}

export default function LinktreeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoImgRef = useRef<HTMLImageElement | null>(null);
  const [name, setName] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([
    { id: nextId(), label: "Instagram", url: "" },
    { id: nextId(), label: "TikTok", url: "" },
  ]);
  const [downloading, setDownloading] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoReady, setPhotoReady] = useState(0);

  const updateLink = (id: string, field: "label" | "url", value: string) =>
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));

  const addLink = () => setLinks((prev) => [...prev, { id: nextId(), label: "Website", url: "" }]);
  const removeLink = (id: string) => setLinks((prev) => prev.filter((l) => l.id !== id));

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!photo) {
      photoImgRef.current = null;
      setPhotoReady((n) => n + 1);
      return;
    }
    const img = new Image();
    img.onload = () => {
      photoImgRef.current = img;
      setPhotoReady((n) => n + 1);
    };
    img.src = photo;
  }, [photo]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (photo && !photoImgRef.current) return;
    const ctx = canvas.getContext("2d")!;
    const size = 500;

    canvas.width = size;
    canvas.height = size;

    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, "#fdf2f8");
    grad.addColorStop(0.5, "#fce7f3");
    grad.addColorStop(1, "#fef3c7");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    const margin = 32;
    const contentW = size - margin * 2;
    let y = margin + 8;

    ctx.textAlign = "center";

    const displayName = name.trim() || "yourname";
    const avatarR = 36;

    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, y + avatarR, avatarR + 3, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, y + avatarR, avatarR, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    if (photo && photoImgRef.current) {
      const img = photoImgRef.current;
      const s = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - s) / 2;
      const sy = (img.naturalHeight - s) / 2;
      ctx.drawImage(img, sx, sy, s, s, size / 2 - avatarR, y, avatarR * 2, avatarR * 2);
    } else {
      ctx.fillStyle = "#111";
      ctx.fillRect(size / 2 - avatarR, y, avatarR * 2, avatarR * 2);
      ctx.fillStyle = "#fff";
      ctx.font = 'bold 28px "Arial",sans-serif';
      ctx.textBaseline = "middle";
      ctx.fillText(displayName[0].toUpperCase(), size / 2, y + avatarR);
    }
    ctx.restore();

    y += avatarR * 2 + 14;

    ctx.fillStyle = "#111";
    ctx.font = 'bold 24px "Arial",sans-serif';
    ctx.textBaseline = "middle";
    ctx.fillText(displayName, size / 2, y);
    y += 32;

    ctx.font = '12px "Arial",sans-serif';
    ctx.fillStyle = "#999";
    ctx.fillText(links.filter((l) => l.label.trim()).length + " links", size / 2, y);
    y += 22;

    const btnH = 44;
    const btnGap = 10;
    const btnRadius = 22;

    const visibleLinks = links.filter((l) => l.label.trim());
    const totalBtnH = visibleLinks.length * btnH + (visibleLinks.length - 1) * btnGap;
    const availableSpace = size - y - margin - 24;
    let finalBtnH = btnH;
    if (totalBtnH > availableSpace) {
      finalBtnH = Math.floor((availableSpace - (visibleLinks.length - 1) * btnGap) / visibleLinks.length);
      finalBtnH = Math.max(28, finalBtnH);
    }

    ctx.textBaseline = "middle";

    for (const link of visibleLinks) {
      if (y + finalBtnH > size - margin - 14) break;
      const color = getPlatformColor(link.label);
      const btnX = margin;
      const btnW = contentW;

      ctx.shadowColor = "rgba(0,0,0,0.1)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 3;

      roundRect(ctx, btnX, y, btnW, finalBtnH, btnRadius);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.shadowBlur = 0;

      const fs = Math.min(14, Math.floor(finalBtnH * 0.4));
      const icon = getPlatformIcon(link.label);
      ctx.font = `${fs + 4}px "Arial",sans-serif`;
      ctx.textAlign = "left";
      ctx.fillText(icon, btnX + 14, y + finalBtnH / 2);

      ctx.font = `bold ${fs}px "Arial",sans-serif`;
      ctx.fillStyle = "#fff";
      const labelX = btnX + 38;
      ctx.textAlign = "left";
      ctx.fillText(link.label, labelX, y + finalBtnH / 2);

      if (link.url.trim()) {
        ctx.font = `${fs - 1}px "Arial",sans-serif`;
        ctx.fillStyle = "rgba(255,255,255,0.65)";
        ctx.textAlign = "right";
        const displayUrl = link.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
        const maxUrlW = btnW - (link.label.length * fs * 0.55) - 80;
        const truncated = ctx.measureText(displayUrl).width > maxUrlW
          ? displayUrl.substring(0, Math.floor(maxUrlW / (fs * 0.5))) + ".."
          : displayUrl;
        ctx.fillText(truncated, btnX + btnW - 14, y + finalBtnH / 2);
      }

      y += finalBtnH + btnGap;
    }

    ctx.font = '9px "Arial",sans-serif';
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("socialtoolsbyza", size / 2, size - 10);
  }, [name, links, photo, photoReady]);

  useEffect(() => { renderCanvas(); }, [renderCanvas]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);
    const link = document.createElement("a");
    link.download = "linktree.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    setTimeout(() => setDownloading(false), 500);
  };

  return (
    <ComicPanel bgColor="bg-white" badge="TREE!" badgeColor="bg-green-500 text-white">
      <h3 className="font-display text-headline-md uppercase italic mb-4 flex items-center gap-2">
        <Link className="w-6 h-6" />Linktree Generator
      </h3>
      <p className="font-body text-body-md text-gray-600 mb-4">
        Bikin linktree aesthetic buat bio IG. Upload foto, tambah link, download!
      </p>

      <div className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border-4 border-black bg-white font-body font-bold text-sm outline-none"
          placeholder="Nama kamu..."
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="comic-btn bg-pink-500 text-white text-sm flex items-center justify-center gap-2 py-2"
        >
          <Camera className="w-4 h-4" />
          {photo ? "GANTI FOTO" : "UPLOAD FOTO"}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

        <div className="max-h-[240px] overflow-y-auto space-y-2 pr-1">
          {links.map((l) => (
            <div key={l.id} className="flex gap-1 items-center">
              <select
                value={l.label}
                onChange={(e) => updateLink(l.id, "label", e.target.value)}
                className="border-2 border-black p-2 font-body font-bold text-xs outline-none bg-white w-[110px] shrink-0"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{getPlatformIcon(p)} {p}</option>
                ))}
              </select>
              <input
                value={l.url}
                onChange={(e) => updateLink(l.id, "url", e.target.value)}
                className="flex-1 p-2 border-2 border-black font-body text-xs outline-none bg-white min-w-0"
                placeholder="https://..."
              />
              <button onClick={() => removeLink(l.id)} className="p-1 text-red-500 hover:text-red-700 shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button onClick={addLink} className="comic-btn bg-cyan-500 text-black text-sm flex items-center justify-center gap-1 py-2">
          <Plus className="w-4 h-4" /> TAMBAH LINK
        </button>

        <button onClick={handleDownload} disabled={downloading} className="comic-btn bg-black text-white w-full text-sm flex items-center justify-center gap-1 disabled:opacity-50 py-2">
          <Download className="w-4 h-4" /> {downloading ? "..." : "DOWNLOAD PNG"}
        </button>

        <div className="flex justify-center">
          <canvas ref={canvasRef} className="w-full max-w-[380px] shadow-[4px_4px_0_#000]" />
        </div>
      </div>
    </ComicPanel>
  );
}
