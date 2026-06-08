"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { Link, Plus, Trash2, Download, Camera, Copy, ChevronUp, ChevronDown } from "lucide-react";
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

const THEMES = [
  { id: "sunset", name: "Sunset", bg: ["#fdf2f8", "#fce7f3", "#fef3c7"], text: "#111", badge: "bg-pink-500" },
  { id: "ocean", name: "Ocean", bg: ["#ecfeff", "#cffafe", "#e0f2fe"], text: "#111", badge: "bg-cyan-500" },
  { id: "dark", name: "Dark", bg: ["#1e1e2e", "#2a2a3e", "#3a3a5e"], text: "#fff", badge: "bg-purple-600" },
  { id: "forest", name: "Forest", bg: ["#ecfdf5", "#d1fae5", "#bbf7d0"], text: "#111", badge: "bg-green-600" },
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

function getPlatformIcon(platform: string): string {
  for (const [key, val] of Object.entries(PLATFORM_ICONS)) {
    if (platform.toLowerCase().includes(key)) return val;
  }
  return "🔗";
}

const URL_HINTS: Record<string, string> = {
  instagram: "username",
  tiktok: "@username",
  youtube: "@channel",
  "twitter / x": "@username",
  linkedin: "nama-lo",
  whatsapp: "62812xxxxxxx (no HP)",
  telegram: "@username",
  github: "username",
  shopee: "shopee.co.id/...",
  facebook: "username",
  threads: "@username",
  snapchat: "username",
  discord: "invite-code",
  spotify: "open.spotify.com/...",
  website: "https://...",
};

function getUrlHint(label: string): string {
  for (const [key, val] of Object.entries(URL_HINTS)) {
    if (label.toLowerCase().includes(key)) return val;
  }
  return "https://...";
}

export default function LinktreeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoImgRef = useRef<HTMLImageElement | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [theme, setTheme] = useState("sunset");
  const [links, setLinks] = useState<LinkItem[]>([
    { id: nextId(), label: "Instagram", url: "" },
    { id: nextId(), label: "TikTok", url: "" },
  ]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoReady, setPhotoReady] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const dragIdx = useRef<number | null>(null);

  const updateLink = (id: string, field: "label" | "url", value: string) =>
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));

  const formatUrl = (label: string, url: string) => {
    if (!url.trim() || url.startsWith("http://") || url.startsWith("https://")) return url;
    const p = label.toLowerCase();
    const u = url.trim();
    if (p.includes("instagram")) return `https://instagram.com/${u.replace(/^@/, "")}`;
    if (p.includes("tiktok")) return `https://tiktok.com/@${u.replace(/^@/, "")}`;
    if (p.includes("whatsapp")) { const d = u.replace(/[^0-9]/g, ""); return d ? `https://wa.me/${d}` : u; }
    if (p.includes("telegram")) return `https://t.me/${u.replace(/^@/, "")}`;
    if (p.includes("github")) return `https://github.com/${u.replace(/^@/, "")}`;
    if (p.includes("twitter")) return `https://x.com/${u.replace(/^@/, "")}`;
    if (p.includes("youtube")) return `https://youtube.com/@${u.replace(/^@/, "")}`;
    if (p.includes("linkedin")) return `https://linkedin.com/in/${u.replace(/^@/, "")}`;
    if (p.includes("facebook")) return `https://facebook.com/${u.replace(/^@/, "")}`;
    if (p.includes("threads")) return `https://threads.net/@${u.replace(/^@/, "")}`;
    if (p.includes("snapchat")) return `https://snapchat.com/add/${u}`;
    if (p.includes("spotify") && u.startsWith("open.spotify.com")) return `https://${u}`;
    if (p.includes("shopee") && u.startsWith("shopee.")) return `https://${u}`;
    if (p.includes("discord")) return u.startsWith("discord.gg/") ? `https://${u}` : u;
    return u;
  };


  const addLink = () => setLinks((prev) => [...prev, { id: nextId(), label: "Website", url: "" }]);
  const removeLink = (id: string) => setLinks((prev) => prev.filter((l) => l.id !== id));
  const moveLink = (idx: number, dir: -1 | 1) => {
    const to = idx + dir;
    if (to < 0 || to >= links.length) return;
    setLinks((prev) => {
      const next = [...prev];
      const tmp = next[idx];
      next[idx] = next[to];
      next[to] = tmp;
      return next;
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!photo) { photoImgRef.current = null; setPhotoReady((n) => n + 1); return; }
    const img = new Image();
    img.onload = () => { photoImgRef.current = img; setPhotoReady((n) => n + 1); };
    img.src = photo;
  }, [photo]);

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (photo && !photoImgRef.current) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const cw = 450;
    const ch = 700;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = cw + "px";
    canvas.style.height = ch + "px";
    ctx.scale(dpr, dpr);

    const ct = currentTheme;
    const grad = ctx.createLinearGradient(0, 0, cw, ch);
    ct.bg.forEach((c, i) => grad.addColorStop(i / (ct.bg.length - 1), c));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);

    const margin = 36;
    let y = margin + 10;

    const displayName = name.trim() || "yourname";
    const avatarR = 40;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cw / 2, y + avatarR, avatarR + 3, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(0,0,0,0.12)";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cw / 2, y + avatarR, avatarR, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    if (photo && photoImgRef.current) {
      const img = photoImgRef.current;
      const s = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - s) / 2;
      const sy = (img.naturalHeight - s) / 2;
      ctx.drawImage(img, sx, sy, s, s, cw / 2 - avatarR, y, avatarR * 2, avatarR * 2);
    } else {
      ctx.fillStyle = ct.text === "#fff" ? "#444" : "#111";
      ctx.fillRect(cw / 2 - avatarR, y, avatarR * 2, avatarR * 2);
      ctx.fillStyle = ct.text === "#fff" ? "#fff" : "#fff";
      ctx.font = 'bold 30px "Arial",sans-serif';
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(displayName[0].toUpperCase(), cw / 2, y + avatarR);
    }
    ctx.restore();

    y += avatarR * 2 + 16;

    ctx.fillStyle = ct.text;
    ctx.font = 'bold 26px "Arial",sans-serif';
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(displayName, cw / 2, y);
    y += 30;

    if (bio.trim()) {
      ctx.fillStyle = ct.text === "#fff" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.55)";
      ctx.font = '13px "Arial",sans-serif';
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      const maxW = cw - margin * 2;
      const words = bio.trim().split(" ");
      let line = "";
      let ly = y;
      for (const w of words) {
        const test = line ? line + " " + w : w;
        if (ctx.measureText(test).width > maxW) { ctx.fillText(line, cw / 2, ly); line = w; ly += 18; }
        else line = test;
      }
      if (line) ctx.fillText(line, cw / 2, ly);
      y = ly + 10;
    }

    y += 8;

    const visibleLinks = links.filter((l) => l.label.trim());
    const btnH = 46;
    const btnGap = 10;
    const btnRadius = 23;
    const contentW = cw - margin * 2;
    const totalH = visibleLinks.length * btnH + (visibleLinks.length - 1) * btnGap;
    const spaceLeft = ch - y - margin - 14;
    let finalH = btnH;
    if (totalH > spaceLeft) {
      finalH = Math.floor((spaceLeft - (visibleLinks.length - 1) * btnGap) / visibleLinks.length);
      finalH = Math.max(30, finalH);
    }

    ctx.textBaseline = "middle";

    for (const link of visibleLinks) {
      if (y + finalH > ch - margin - 14) break;
      const color = getPlatformColor(link.label);
      const btnX = margin;
      const btnW = contentW;

      ctx.shadowColor = "rgba(0,0,0,0.08)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;

      roundRect(ctx, btnX, y, btnW, finalH, btnRadius);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.shadowBlur = 0;

      const fs = Math.min(14, Math.floor(finalH * 0.4));
      const icon = getPlatformIcon(link.label);
      ctx.font = `${fs + 4}px "Arial",sans-serif`;
      ctx.textAlign = "left";
      ctx.fillText(icon, btnX + 16, y + finalH / 2);

      ctx.font = `bold ${fs}px "Arial",sans-serif`;
      ctx.fillStyle = "#fff";
      ctx.textAlign = "left";
      ctx.fillText(link.label, btnX + 42, y + finalH / 2);

      if (link.url.trim()) {
        ctx.font = `${fs - 1}px "Arial",sans-serif`;
        ctx.fillStyle = "rgba(255,255,255,0.65)";
        ctx.textAlign = "right";
        const displayUrl = link.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
        const maxUrlW = btnW - (link.label.length * fs * 0.55) - 90;
        const truncated = ctx.measureText(displayUrl).width > maxUrlW
          ? displayUrl.substring(0, Math.floor(maxUrlW / (fs * 0.5))) + ".."
          : displayUrl;
        ctx.fillText(truncated, btnX + btnW - 14, y + finalH / 2);
      }

      y += finalH + btnGap;
    }

    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.font = '9px "Arial",sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("socialtoolsbyza", cw / 2, ch - 10);
  }, [name, bio, theme, links, photo, photoReady]);

  useEffect(() => { renderCanvas(); }, [renderCanvas]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "linktree.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleGenerateLink = async () => {
    let photoData = "";
    if (photo) {
      const img = new Image();
      await new Promise((resolve) => { img.onload = resolve; img.src = photo; });
      const c = document.createElement("canvas");
      const s = 128;
      c.width = s; c.height = s;
      const cx = c.getContext("2d")!;
      const min = Math.min(img.naturalWidth, img.naturalHeight);
      cx.drawImage(img, (img.naturalWidth - min) / 2, (img.naturalHeight - min) / 2, min, min, 0, 0, s, s);
      photoData = c.toDataURL("image/jpeg", 0.75);
    }
    const visibleLinks = links.filter((l) => l.label.trim() && l.url.trim());
    const data = { name: name.trim() || "Bio Links", bio: bio.trim(), links: visibleLinks.map((l) => ({ label: l.label, url: l.url })), photo: photoData };
    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}/link?d=${encoded}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <ComicPanel bgColor={currentTheme.bg[0]} badge="TREE!" badgeColor={`${currentTheme.badge} text-white`}>
      <h3 className={`font-display text-headline-md uppercase italic mb-4 flex items-center gap-2 ${currentTheme.text === "#fff" ? "text-white" : ""}`}>
        <Link className="w-6 h-6" />Linktree Generator
      </h3>
      <p className={`font-body text-body-md mb-4 ${currentTheme.text === "#fff" ? "text-gray-300" : "text-gray-600"}`}>
        Bikin linktree aesthetic buat bio IG. Upload foto, tambah link, download!
      </p>

      <div className="flex flex-col gap-3">
        <input value={name} onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border-4 border-black bg-white font-body font-bold text-sm outline-none" placeholder="Nama kamu..." />

        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2}
          className="w-full p-3 border-4 border-black bg-white font-body text-sm outline-none resize-none" placeholder="Bio / deskripsi singkat..." />

        <div className="flex gap-1.5">
          {THEMES.map((t) => (
            <button key={t.id} onClick={() => setTheme(t.id)}
              className={`flex-1 py-2 border-2 border-black text-xs font-display font-bold tracking-wider transition-all ${
                theme === t.id ? "ring-2 ring-pink-500 scale-[1.02]" : ""
              }`}
              style={{ background: `linear-gradient(135deg, ${t.bg[0]}, ${t.bg[t.bg.length - 1]})`, color: t.text }}>{t.name}</button>
          ))}
        </div>

        <button onClick={() => fileInputRef.current?.click()}
          className="comic-btn bg-pink-500 text-white text-sm flex items-center justify-center gap-2 py-2">
          <Camera className="w-4 h-4" />{photo ? "GANTI FOTO" : "UPLOAD FOTO"}</button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

        <div className="max-h-[260px] overflow-y-auto space-y-1.5 pr-1">
          {links.map((l, idx) => (
            <div key={l.id} className="flex gap-1 items-center" draggable
              onDragStart={() => { dragIdx.current = idx; }}
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={() => {
                if (dragIdx.current === null || dragIdx.current === idx) return;
                setLinks((prev) => {
                  const next = [...prev];
                  const [m] = next.splice(dragIdx.current!, 1);
                  next.splice(idx, 0, m);
                  return next;
                });
                dragIdx.current = null;
              }}>
              <div className="flex flex-col gap-0.5 shrink-0">
                <button onClick={() => moveLink(idx, -1)} disabled={idx === 0}
                  className="p-0.5 text-gray-400 hover:text-black disabled:opacity-20"><ChevronUp className="w-3.5 h-3.5" /></button>
                <button onClick={() => moveLink(idx, 1)} disabled={idx === links.length - 1}
                  className="p-0.5 text-gray-400 hover:text-black disabled:opacity-20"><ChevronDown className="w-3.5 h-3.5" /></button>
              </div>
              <select value={l.label} onChange={(e) => updateLink(l.id, "label", e.target.value)}
                className="border-2 border-black p-2 font-body font-bold text-xs outline-none bg-white w-[105px] shrink-0">
                {PLATFORMS.map((p) => (<option key={p} value={p}>{getPlatformIcon(p)} {p}</option>))}
              </select>
              <input value={l.url} onChange={(e) => updateLink(l.id, "url", e.target.value)}
                onBlur={(e) => updateLink(l.id, "url", formatUrl(l.label, e.target.value))}
                className="flex-1 p-2 border-2 border-black font-body text-xs outline-none bg-white min-w-0" placeholder={getUrlHint(l.label)} />
              <button onClick={() => removeLink(l.id)} className="p-1 text-red-500 hover:text-red-700 shrink-0">
                <Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>

        <button onClick={addLink}
          className="comic-btn bg-cyan-500 text-black text-sm flex items-center justify-center gap-1 py-2">
          <Plus className="w-4 h-4" /> TAMBAH LINK</button>

        <button onClick={handleGenerateLink}
          className="comic-btn bg-green-500 text-white w-full text-sm flex items-center justify-center gap-1 py-2">
          <Copy className="w-4 h-4" /> {linkCopied ? "✓ LINK COPIED!" : "GENERATE LINK"}</button>

        <button onClick={handleDownload}
          className="comic-btn bg-black text-white w-full text-sm flex items-center justify-center gap-1 py-2">
          <Download className="w-4 h-4" /> DOWNLOAD PNG</button>

        <div className="flex justify-center">
          <canvas ref={canvasRef} className="w-full max-w-[320px] shadow-[4px_4px_0_#000]" />
        </div>
      </div>
    </ComicPanel>
  );
}
