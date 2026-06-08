"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { Link, Plus, Trash2, Download } from "lucide-react";
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

export default function LinktreeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([
    { id: nextId(), label: "Instagram", url: "" },
    { id: nextId(), label: "TikTok", url: "" },
  ]);
  const [downloading, setDownloading] = useState(false);

  const updateLink = (id: string, field: "label" | "url", value: string) =>
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));

  const addLink = () => setLinks((prev) => [...prev, { id: nextId(), label: "Website", url: "" }]);

  const removeLink = (id: string) => setLinks((prev) => prev.filter((l) => l.id !== id));

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const size = 500;

    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, size, size);

    const margin = 30;
    const contentW = size - margin * 2;
    let y = margin + 10;

    ctx.textAlign = "center";

    const displayName = name.trim() || "yourname";
    const initial = displayName[0].toUpperCase();
    const avatarR = 30;
    ctx.beginPath();
    ctx.arc(size / 2, y + avatarR, avatarR, 0, Math.PI * 2);
    ctx.fillStyle = "#111";
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = 'bold 24px "Arial",sans-serif';
    ctx.textBaseline = "middle";
    ctx.fillText(initial, size / 2, y + avatarR);
    y += avatarR * 2 + 12;

    ctx.fillStyle = "#111";
    ctx.font = 'bold 22px "Arial",sans-serif';
    ctx.textBaseline = "middle";
    ctx.fillText(displayName, size / 2, y);
    y += 34;

    ctx.font = '13px "Arial",sans-serif';
    ctx.fillStyle = "#888";
    ctx.fillText("linktree", size / 2, y);
    y += 24;

    const btnH = 44;
    const btnGap = 10;

    const visibleLinks = links.filter((l) => l.label.trim());
    const totalBtnH = visibleLinks.length * btnH + (visibleLinks.length - 1) * btnGap;
    const availableSpace = size - y - margin - 20;
    let finalBtnH = btnH;
    if (totalBtnH > availableSpace) {
      finalBtnH = Math.floor((availableSpace - (visibleLinks.length - 1) * btnGap) / visibleLinks.length);
      finalBtnH = Math.max(28, finalBtnH);
    }

    const btnRadius = 10;
    ctx.textBaseline = "middle";

    for (const link of visibleLinks) {
      if (y + finalBtnH > size - margin) break;
      const color = getPlatformColor(link.label);
      const btnX = margin;
      const btnW = contentW;

      ctx.shadowColor = "rgba(0,0,0,0.08)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;

      roundRect(ctx, btnX, y, btnW, finalBtnH, btnRadius);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.shadowBlur = 0;

      const fs = Math.min(15, Math.floor(finalBtnH * 0.38));
      ctx.font = `bold ${fs}px "Arial",sans-serif`;
      ctx.fillStyle = "#fff";
      ctx.textAlign = "left";
      ctx.fillText(link.label, btnX + 14, y + finalBtnH / 2);

      if (link.url.trim()) {
        ctx.font = `${fs - 2}px "Arial",sans-serif`;
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.textAlign = "right";
        const displayUrl = link.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
        ctx.fillText(displayUrl, btnX + btnW - 14, y + finalBtnH / 2);
      }

      ctx.textAlign = "center";
      y += finalBtnH + btnGap;
    }

    ctx.font = '9px "Arial",sans-serif';
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("socialtoolsbyza", size / 2, size - 10);
  }, [name, links]);

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
        Bikin linktree keren buat bio IG-mu. Tinggal masukin link, download, upload ke bio!
      </p>

      <div className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border-4 border-black bg-white font-body font-bold text-sm outline-none"
          placeholder="Nama kamu..."
        />

        <div className="max-h-[240px] overflow-y-auto space-y-2 pr-1">
          {links.map((l) => (
            <div key={l.id} className="flex gap-1 items-center">
              <select
                value={l.label}
                onChange={(e) => updateLink(l.id, "label", e.target.value)}
                className="border-2 border-black p-2 font-body font-bold text-xs outline-none bg-white w-[110px] shrink-0"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
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

        <div className="flex gap-2">
          <button onClick={handleDownload} disabled={downloading} className="comic-btn bg-black text-white flex-1 text-sm flex items-center justify-center gap-1 disabled:opacity-50">
            <Download className="w-4 h-4" /> {downloading ? "..." : "DOWNLOAD"}
          </button>
        </div>

        <div className="flex justify-center">
          <canvas ref={canvasRef} className="w-full max-w-[380px] shadow-[4px_4px_0_#000]" />
        </div>
      </div>
    </ComicPanel>
  );
}
