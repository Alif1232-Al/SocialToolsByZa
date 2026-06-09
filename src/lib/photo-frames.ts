export type TextPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

export type FontStyle = "bold" | "playful" | "elegant" | "compact";

const FONT_MAP: Record<FontStyle, string> = {
  bold: `bold 16px "Inter","Arial",sans-serif`,
  playful: `16px "Comic Sans MS","Comic Sans",cursive`,
  elegant: `italic 16px "Georgia","Times New Roman",serif`,
  compact: `600 16px "Segoe UI","Arial",sans-serif`,
};

export type FrameText = {
  text: string;
  color: string;
  bgColor: string;
  position: TextPosition;
  fontSize: number;
  fontStyle: FontStyle;
  shadowColor: string;
};

export type PlacedEmoji = {
  emoji: string;
  x: number;
  y: number;
  size: number;
};

export type FrameDef = {
  id: string;
  name: string;
  emoji: string;
  render: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  borderColor: string;
  borderWidth: number;
  cellBorderColor: string;
  cellBorderWidth: number;
  showNumbers: boolean;
  watermark: boolean;
  text?: FrameText;
};

export type CustomFrameOptions = {
  bgType: "gradient" | "solid";
  bgColor1: string;
  bgColor2: string;
  borderColor: string;
  borderWidth: number;
  cellBorderColor: string;
  cellBorderWidth: number;
  textEnabled: boolean;
  text: string;
  textColor: string;
  textBg: string;
  textShadow: string;
  textPosition: TextPosition;
  textFont: FontStyle;
  decoration: "none" | "stars" | "hearts" | "dots" | "circles";
  emojis: PlacedEmoji[];
};

const FONT_SIZES = {
  "top-left": 16, "top-center": 18, "top-right": 16,
  "bottom-left": 16, "bottom-center": 18, "bottom-right": 16,
};

export const DEFAULT_CUSTOM: CustomFrameOptions = {
  bgType: "gradient",
  bgColor1: "#fdf2f8",
  bgColor2: "#fef3c7",
  borderColor: "#111",
  borderWidth: 5,
  cellBorderColor: "#111",
  cellBorderWidth: 3,
  textEnabled: true,
  text: "MY MOMENTS",
  textColor: "#fff",
  textBg: "#000",
  textShadow: "#000",
  textPosition: "bottom-center",
  textFont: "bold",
  decoration: "none",
  emojis: [],
};

export const EMOJI_CATEGORIES = [
  {
    name: "Faces",
    items: ["😊", "😂", "🥰", "😎", "🤩", "😍", "🔥", "💯", "✨", "💪", "🤙", "👀"],
  },
  {
    name: "Hearts",
    items: ["❤️", "💜", "💙", "💚", "💛", "🧡", "🩷", "🩵", "💕", "💖", "💗", "🖤"],
  },
  {
    name: "Symbols",
    items: ["⭐", "🌟", "💫", "🎀", "🌸", "🌺", "🎯", "🏆", "👑", "💎", "🌈", "🎉"],
  },
  {
    name: "Nature",
    items: ["🌊", "❄️", "🌴", "🌅", "🌙", "☀️", "🌸", "🌺", "🍀", "🌻", "🦋", "🌈"],
  },
  {
    name: "Party",
    items: ["🎉", "🎊", "🎈", "🎁", "🎶", "🎵", "🎸", "🥳", "🎤", "💃", "🕺", "🎆"],
  },
  {
    name: "Misc",
    items: ["👾", "🤖", "👻", "💀", "☠️", "🐱", "🐶", "🦄", "🐉", "🍕", "🍦", "☕"],
  },
];

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

function drawPolygonStar(c: CanvasRenderingContext2D, cx: number, cy: number, or: number, ir: number, pts: number) {
  c.beginPath();
  for (let i = 0; i < pts * 2; i++) {
    const r = i % 2 === 0 ? or : ir;
    const a = (Math.PI / pts) * i - Math.PI / 2;
    c.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  c.closePath();
}

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
}

export function drawTextBadge(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  text: string, textColor: string, bgColor: string, shadowColor: string,
  position: TextPosition, fontSize: number, fontStyle: FontStyle,
) {
  if (!text.trim()) return;
  const txt = text.toUpperCase().trim();
  const fontStr = FONT_MAP[fontStyle].replace(/16px/, `${fontSize}px`);
  ctx.font = fontStr;
  const metrics = ctx.measureText(txt);
  const tw = metrics.width;
  const padX = 14, padY = 6;
  const bw = tw + padX * 2;
  const bh = fontSize + padY * 2;
  const cornerR = 8;
  const margin = 10;

  let bx: number, by: number;
  const isTop = position.startsWith("top");
  const isLeft = position.endsWith("left");
  const isRight = position.endsWith("right");

  if (isTop) by = margin;
  else by = h - bh - margin;
  if (isLeft) bx = margin;
  else if (isRight) bx = w - bw - margin;
  else bx = (w - bw) / 2;

  ctx.save();
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = bgColor;
  drawRoundedRect(ctx, bx, by, bw, bh, cornerR);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.restore();

  if (shadowColor && shadowColor !== "transparent") {
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 0.5;
    drawRoundedRect(ctx, bx, by, bw, bh, cornerR);
    ctx.stroke();
  }

  ctx.fillStyle = textColor;
  ctx.font = fontStr;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(txt, bx + bw / 2, by + bh / 2 - 1);
}

export function drawEmojis(ctx: CanvasRenderingContext2D, w: number, h: number, emojis: PlacedEmoji[]) {
  for (const e of emojis) {
    const x = (e.x / 100) * w;
    const y = (e.y / 100) * h;
    ctx.font = `${e.size}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(e.emoji, x, y);
  }
}

function drawDecoration(ctx: CanvasRenderingContext2D, w: number, h: number, type: string) {
  const rng = seededRandom(123);
  ctx.globalAlpha = 0.12;
  if (type === "stars") {
    ctx.fillStyle = "#fbbf24";
    for (let i = 0; i < 15; i++) {
      const cx = rng() * w, cy = rng() * h, sz = 4 + rng() * 10;
      drawPolygonStar(ctx, cx, cy, sz, sz * 0.4, 5);
      ctx.fill();
    }
  } else if (type === "hearts") {
    ctx.fillStyle = "#f43f5e";
    for (let i = 0; i < 12; i++) {
      const cx = rng() * w, cy = rng() * h, sz = 4 + rng() * 8;
      ctx.beginPath();
      ctx.moveTo(cx, cy + sz * 0.3);
      ctx.bezierCurveTo(cx - sz * 0.5, cy - sz * 0.3, cx - sz, cy + sz * 0.3, cx, cy + sz);
      ctx.bezierCurveTo(cx + sz, cy + sz * 0.3, cx + sz * 0.5, cy - sz * 0.3, cx, cy + sz * 0.3);
      ctx.fill();
    }
  } else if (type === "dots") {
    ctx.fillStyle = "#000";
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(rng() * w, rng() * h, 1 + rng() * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === "circles") {
    ctx.fillStyle = "#fff";
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(rng() * w, rng() * h, 4 + rng() * 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

export function renderCustomBackground(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  opts: CustomFrameOptions,
) {
  if (opts.bgType === "gradient") {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, opts.bgColor1);
    g.addColorStop(1, opts.bgColor2);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = opts.bgColor1;
  }
  ctx.fillRect(0, 0, w, h);
  drawDecoration(ctx, w, h, opts.decoration);
}

export const FRAMES: FrameDef[] = [
  {
    id: "comic-boom", name: "Comic Boom", emoji: "💥",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#fdf2f8"); g.addColorStop(0.3, "#fff1f2");
      g.addColorStop(0.6, "#fef3c7"); g.addColorStop(1, "#fce7f3");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(42);
      ctx.fillStyle = "rgba(236,72,153,0.06)";
      for (let i = 0; i < 30; i++) { ctx.beginPath(); ctx.arc(rng() * w, rng() * h, 2 + rng() * 3, 0, Math.PI * 2); ctx.fill(); }
    },
    borderColor: "#111", borderWidth: 5, cellBorderColor: "#111", cellBorderWidth: 3,
    showNumbers: true, watermark: true,
    text: { text: "BOOM!", color: "#fff", bgColor: "#111", shadowColor: "#000", position: "bottom-center", fontSize: 22, fontStyle: "bold" },
  },
  {
    id: "blue-ocean", name: "Blue Ocean", emoji: "🌊",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w * 0.7, h);
      g.addColorStop(0, "#dbeafe"); g.addColorStop(0.4, "#bfdbfe");
      g.addColorStop(0.7, "#a5b4fc"); g.addColorStop(1, "#67e8f9");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(99);
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        const y = rng() * h * 0.8 + h * 0.1;
        ctx.beginPath();
        for (let x = 0; x < w; x += 4) { const wy = y + Math.sin((x + i * 50) * 0.02) * 6 + Math.sin((x + i * 30) * 0.04) * 3; x === 0 ? ctx.moveTo(x, wy) : ctx.lineTo(x, wy); }
        ctx.stroke();
      }
    },
    borderColor: "#1e3a5f", borderWidth: 5, cellBorderColor: "#1e3a5f", cellBorderWidth: 2,
    showNumbers: true, watermark: true,
    text: { text: "CHILL VIBES", color: "#fff", bgColor: "#1e3a5f", shadowColor: "#000", position: "bottom-center", fontSize: 20, fontStyle: "bold" },
  },
  {
    id: "snowy", name: "Snowy", emoji: "❄️",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#e0f2fe"); g.addColorStop(0.5, "#f0f9ff"); g.addColorStop(1, "#e0f2fe");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(77);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.arc(rng() * w, rng() * h, 1 + rng() * 2.5, 0, Math.PI * 2); ctx.fill(); }
      ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) { const sx = rng() * w, sy = rng() * h, sz = 3 + rng() * 5; ctx.beginPath(); for (let j = 0; j < 6; j++) { const a = (Math.PI / 3) * j; ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(a) * sz, sy + Math.sin(a) * sz); } ctx.stroke(); }
    },
    borderColor: "#0c4a6e", borderWidth: 4, cellBorderColor: "#0c4a6e", cellBorderWidth: 2,
    showNumbers: true, watermark: true,
    text: { text: "WINTER", color: "#fff", bgColor: "#0c4a6e", shadowColor: "#000", position: "top-center", fontSize: 22, fontStyle: "bold" },
  },
  {
    id: "midnight", name: "Midnight", emoji: "🌙",
    render(ctx, w, h) {
      const g = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
      g.addColorStop(0, "#1e1b4b"); g.addColorStop(0.6, "#0f172a"); g.addColorStop(1, "#020617");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(11);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      for (let i = 0; i < 50; i++) { ctx.beginPath(); ctx.arc(rng() * w, rng() * h, 0.5 + rng() * 1.2, 0, Math.PI * 2); ctx.fill(); }
    },
    borderColor: "#fbbf24", borderWidth: 4, cellBorderColor: "#fbbf24", cellBorderWidth: 2,
    showNumbers: false, watermark: false,
    text: { text: "STARLIGHT", color: "#fbbf24", bgColor: "rgba(0,0,0,0.7)", shadowColor: "#000", position: "bottom-center", fontSize: 20, fontStyle: "elegant" },
  },
  {
    id: "pastel-dream", name: "Pastel Dream", emoji: "🌸",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#fce7f3"); g.addColorStop(0.3, "#fbcfe8"); g.addColorStop(0.6, "#c7d2fe"); g.addColorStop(1, "#a7f3d0");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(33);
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      for (let i = 0; i < 20; i++) { const cx = rng() * w, cy = rng() * h, rr = 4 + rng() * 10; drawPolygonStar(ctx, cx, cy, rr, rr * 0.5, 5); ctx.fill(); }
    },
    borderColor: "#8b5cf6", borderWidth: 4, cellBorderColor: "#8b5cf6", cellBorderWidth: 2,
    showNumbers: true, watermark: true,
    text: { text: "DREAMY", color: "#fff", bgColor: "#8b5cf6", shadowColor: "#000", position: "top-center", fontSize: 22, fontStyle: "playful" },
  },
  {
    id: "neon-cyber", name: "Neon Cyber", emoji: "💜",
    render(ctx, w, h) {
      ctx.fillStyle = "#0d0221"; ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(55);
      ctx.strokeStyle = "rgba(236,72,153,0.15)"; ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const y = rng() * h; ctx.beginPath();
        for (let x = 0; x < w; x += 3) { const yy = y + Math.sin((x + i * 100) * 0.01) * 15 + Math.sin((x + i * 70) * 0.03) * 5; x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
        ctx.stroke();
      }
    },
    borderColor: "#ec4899", borderWidth: 4, cellBorderColor: "#06b6d4", cellBorderWidth: 2,
    showNumbers: true, watermark: false,
    text: { text: "CYBER", color: "#06b6d4", bgColor: "#111", shadowColor: "#000", position: "bottom-center", fontSize: 24, fontStyle: "compact" },
  },
  {
    id: "vintage-sepia", name: "Vintage Sepia", emoji: "📜",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#fef3c7"); g.addColorStop(0.5, "#fde68a"); g.addColorStop(1, "#fef3c7");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(88);
      ctx.fillStyle = "rgba(180,140,80,0.08)";
      for (let i = 0; i < 100; i++) { ctx.fillRect(rng() * w, rng() * h, 1 + rng() * 2, 1 + rng() * 2); }
      ctx.strokeStyle = "rgba(180,140,80,0.3)"; ctx.lineWidth = 1;
      ctx.strokeRect(8, 8, w - 16, h - 16); ctx.strokeRect(12, 12, w - 24, h - 24);
    },
    borderColor: "#92400e", borderWidth: 4, cellBorderColor: "#92400e", cellBorderWidth: 2,
    showNumbers: false, watermark: true,
    text: { text: "TIMELESS", color: "#92400e", bgColor: "rgba(255,255,255,0.6)", shadowColor: "transparent", position: "bottom-center", fontSize: 20, fontStyle: "elegant" },
  },
  {
    id: "tropical", name: "Tropical", emoji: "🌴",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#d9f99d"); g.addColorStop(0.5, "#a7f3d0"); g.addColorStop(1, "#6ee7b7");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(22);
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      for (let i = 0; i < 30; i++) { ctx.beginPath(); ctx.arc(rng() * w, rng() * h, 3 + rng() * 6, 0, Math.PI * 2); ctx.fill(); }
    },
    borderColor: "#065f46", borderWidth: 4, cellBorderColor: "#065f46", cellBorderWidth: 2,
    showNumbers: true, watermark: true,
    text: { text: "PARADISE", color: "#fff", bgColor: "#065f46", shadowColor: "#000", position: "bottom-center", fontSize: 20, fontStyle: "playful" },
  },
  {
    id: "bubblegum", name: "Bubblegum", emoji: "🩷",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#fbcfe8"); g.addColorStop(0.5, "#f9a8d4"); g.addColorStop(1, "#f472b6");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(44);
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      for (let i = 0; i < 25; i++) { ctx.beginPath(); ctx.arc(rng() * w, rng() * h, 5 + rng() * 12, 0, Math.PI * 2); ctx.fill(); }
    },
    borderColor: "#9d174d", borderWidth: 5, cellBorderColor: "#9d174d", cellBorderWidth: 3,
    showNumbers: true, watermark: true,
    text: { text: "SWEET", color: "#fff", bgColor: "#9d174d", shadowColor: "#000", position: "top-center", fontSize: 22, fontStyle: "playful" },
  },
  {
    id: "monochrome", name: "Monochrome", emoji: "⚫",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#f8fafc"); g.addColorStop(0.5, "#e2e8f0"); g.addColorStop(1, "#cbd5e1");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(66);
      ctx.strokeStyle = "rgba(0,0,0,0.05)"; ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) { const x = rng() * w; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 10, h); ctx.stroke(); }
    },
    borderColor: "#000", borderWidth: 4, cellBorderColor: "#475569", cellBorderWidth: 2,
    showNumbers: false, watermark: true,
    text: { text: "CLASSIC", color: "#fff", bgColor: "#000", shadowColor: "#000", position: "bottom-right", fontSize: 18, fontStyle: "compact" },
  },
  {
    id: "sunset", name: "Sunset", emoji: "🌅",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#fde68a"); g.addColorStop(0.3, "#fb923c"); g.addColorStop(0.6, "#e11d48"); g.addColorStop(1, "#4c1d95");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      for (let i = 0; i < 3; i++) { const sy = h * 0.15 + i * h * 0.08; ctx.beginPath(); ctx.arc(w * 0.5 + i * w * 0.1, sy, w * 0.4 + i * w * 0.05, 0, Math.PI * 2); ctx.fill(); }
    },
    borderColor: "#2e1065", borderWidth: 4, cellBorderColor: "#fde68a", cellBorderWidth: 2,
    showNumbers: false, watermark: false,
    text: { text: "GOLDEN HOUR", color: "#fff", bgColor: "#2e1065", shadowColor: "#000", position: "bottom-center", fontSize: 18, fontStyle: "elegant" },
  },
  {
    id: "forest", name: "Forest", emoji: "🌲",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#bbf7d0"); g.addColorStop(0.4, "#86efac"); g.addColorStop(0.7, "#22c55e"); g.addColorStop(1, "#14532d");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(31);
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      for (let i = 0; i < 8; i++) {
        const tx = rng() * w * 0.8 + w * 0.1, ty = rng() * h * 0.7 + h * 0.15;
        const tw = 8 + rng() * 16, th = 12 + rng() * 20;
        ctx.beginPath(); ctx.moveTo(tx, ty - th / 2); ctx.lineTo(tx + tw / 2, ty + th / 2); ctx.lineTo(tx - tw / 2, ty + th / 2); ctx.closePath(); ctx.fill();
      }
    },
    borderColor: "#064e3b", borderWidth: 5, cellBorderColor: "#064e3b", cellBorderWidth: 2,
    showNumbers: false, watermark: true,
    text: { text: "NATURE", color: "#fff", bgColor: "#064e3b", shadowColor: "#000", position: "top-center", fontSize: 22, fontStyle: "compact" },
  },
];
