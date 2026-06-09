import { FILTERS } from "./photo-filters";

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
};

function drawPolygonStar(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, outerR: number, innerR: number, points: number
) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (Math.PI / points) * i - Math.PI / 2;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
}

export const FRAMES: FrameDef[] = [
  {
    id: "comic-boom",
    name: "Comic Boom",
    emoji: "💥",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#fdf2f8");
      g.addColorStop(0.3, "#fff1f2");
      g.addColorStop(0.6, "#fef3c7");
      g.addColorStop(1, "#fce7f3");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(42);
      ctx.fillStyle = "rgba(236,72,153,0.06)";
      const minDim = Math.min(w, h);
      const dotR = Math.max(2, minDim * 0.008);
      for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.arc(rng() * w, rng() * h, dotR + rng() * dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    borderColor: "#111", borderWidth: 5,
    cellBorderColor: "#111", cellBorderWidth: 3,
    showNumbers: true, watermark: true,
  },
  {
    id: "blue-ocean",
    name: "Blue Ocean",
    emoji: "🌊",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w * 0.7, h);
      g.addColorStop(0, "#dbeafe");
      g.addColorStop(0.4, "#bfdbfe");
      g.addColorStop(0.7, "#a5b4fc");
      g.addColorStop(1, "#67e8f9");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(99);
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        const y = rng() * h * 0.8 + h * 0.1;
        ctx.beginPath();
        for (let x = 0; x < w; x += 4) {
          const waveY = y + Math.sin((x + i * 50) * 0.02) * 6 + Math.sin((x + i * 30) * 0.04) * 3;
          x === 0 ? ctx.moveTo(x, waveY) : ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }
    },
    borderColor: "#1e3a5f", borderWidth: 5,
    cellBorderColor: "#1e3a5f", cellBorderWidth: 2,
    showNumbers: true, watermark: true,
  },
  {
    id: "snowy",
    name: "Snowy",
    emoji: "❄️",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#e0f2fe");
      g.addColorStop(0.5, "#f0f9ff");
      g.addColorStop(1, "#e0f2fe");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(77);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      for (let i = 0; i < 40; i++) {
        const sx = rng() * w;
        const sy = rng() * h;
        const sr = 1 + rng() * 2.5;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const sx = rng() * w;
        const sy = rng() * h;
        const size = 3 + rng() * 5;
        ctx.beginPath();
        for (let j = 0; j < 6; j++) {
          const a = (Math.PI / 3) * j;
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + Math.cos(a) * size, sy + Math.sin(a) * size);
        }
        ctx.stroke();
      }
    },
    borderColor: "#0c4a6e", borderWidth: 4,
    cellBorderColor: "#0c4a6e", cellBorderWidth: 2,
    showNumbers: true, watermark: true,
  },
  {
    id: "midnight",
    name: "Midnight",
    emoji: "🌙",
    render(ctx, w, h) {
      const g = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
      g.addColorStop(0, "#1e1b4b");
      g.addColorStop(0.6, "#0f172a");
      g.addColorStop(1, "#020617");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(11);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      for (let i = 0; i < 50; i++) {
        const sx = rng() * w;
        const sy = rng() * h;
        const sr = 0.5 + rng() * 1.2;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    borderColor: "#fbbf24", borderWidth: 4,
    cellBorderColor: "#fbbf24", cellBorderWidth: 2,
    showNumbers: false, watermark: false,
  },
  {
    id: "pastel-dream",
    name: "Pastel Dream",
    emoji: "🌸",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#fce7f3");
      g.addColorStop(0.3, "#fbcfe8");
      g.addColorStop(0.6, "#c7d2fe");
      g.addColorStop(1, "#a7f3d0");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(33);
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      for (let i = 0; i < 20; i++) {
        const cx = rng() * w, cy = rng() * h, rr = 4 + rng() * 10;
        drawPolygonStar(ctx, cx, cy, rr, rr * 0.5, 5);
        ctx.fill();
      }
    },
    borderColor: "#8b5cf6", borderWidth: 4,
    cellBorderColor: "#8b5cf6", cellBorderWidth: 2,
    showNumbers: true, watermark: true,
  },
  {
    id: "neon-cyber",
    name: "Neon Cyber",
    emoji: "💜",
    render(ctx, w, h) {
      ctx.fillStyle = "#0d0221";
      ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(55);
      ctx.strokeStyle = "rgba(236,72,153,0.15)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const y = rng() * h;
        ctx.beginPath();
        for (let x = 0; x < w; x += 3) {
          const yy = y + Math.sin((x + i * 100) * 0.01) * 15 + Math.sin((x + i * 70) * 0.03) * 5;
          x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
        }
        ctx.stroke();
      }
    },
    borderColor: "#ec4899", borderWidth: 4,
    cellBorderColor: "#06b6d4", cellBorderWidth: 2,
    showNumbers: true, watermark: false,
  },
  {
    id: "vintage-sepia",
    name: "Vintage Sepia",
    emoji: "📜",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#fef3c7");
      g.addColorStop(0.5, "#fde68a");
      g.addColorStop(1, "#fef3c7");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(88);
      ctx.fillStyle = "rgba(180,140,80,0.08)";
      for (let i = 0; i < 100; i++) {
        const sx = rng() * w, sy = rng() * h;
        ctx.fillRect(sx, sy, 1 + rng() * 2, 1 + rng() * 2);
      }
      ctx.strokeStyle = "rgba(180,140,80,0.3)";
      ctx.lineWidth = 1;
      ctx.strokeRect(8, 8, w - 16, h - 16);
      ctx.strokeRect(12, 12, w - 24, h - 24);
    },
    borderColor: "#92400e", borderWidth: 4,
    cellBorderColor: "#92400e", cellBorderWidth: 2,
    showNumbers: false, watermark: true,
  },
  {
    id: "tropical",
    name: "Tropical",
    emoji: "🌴",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#d9f99d");
      g.addColorStop(0.5, "#a7f3d0");
      g.addColorStop(1, "#6ee7b7");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(22);
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.arc(rng() * w, rng() * h, 3 + rng() * 6, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    borderColor: "#065f46", borderWidth: 4,
    cellBorderColor: "#065f46", cellBorderWidth: 2,
    showNumbers: true, watermark: true,
  },
  {
    id: "bubblegum",
    name: "Bubblegum",
    emoji: "🩷",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#fbcfe8");
      g.addColorStop(0.5, "#f9a8d4");
      g.addColorStop(1, "#f472b6");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(44);
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      for (let i = 0; i < 25; i++) {
        ctx.beginPath();
        ctx.arc(rng() * w, rng() * h, 5 + rng() * 12, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    borderColor: "#9d174d", borderWidth: 5,
    cellBorderColor: "#9d174d", cellBorderWidth: 3,
    showNumbers: true, watermark: true,
  },
  {
    id: "monochrome",
    name: "Monochrome",
    emoji: "⚫",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#f8fafc");
      g.addColorStop(0.5, "#e2e8f0");
      g.addColorStop(1, "#cbd5e1");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(66);
      ctx.strokeStyle = "rgba(0,0,0,0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        const x = rng() * w;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 10, h);
        ctx.stroke();
      }
    },
    borderColor: "#000", borderWidth: 4,
    cellBorderColor: "#475569", cellBorderWidth: 2,
    showNumbers: false, watermark: true,
  },
  {
    id: "sunset",
    name: "Sunset",
    emoji: "🌅",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#fde68a");
      g.addColorStop(0.3, "#fb923c");
      g.addColorStop(0.6, "#e11d48");
      g.addColorStop(1, "#4c1d95");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      for (let i = 0; i < 3; i++) {
        const sy = h * 0.15 + i * h * 0.08;
        ctx.beginPath();
        ctx.arc(w * 0.5 + i * w * 0.1, sy, w * 0.4 + i * w * 0.05, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    borderColor: "#2e1065", borderWidth: 4,
    cellBorderColor: "#fde68a", cellBorderWidth: 2,
    showNumbers: false, watermark: false,
  },
  {
    id: "forest",
    name: "Forest",
    emoji: "🌲",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#bbf7d0");
      g.addColorStop(0.4, "#86efac");
      g.addColorStop(0.7, "#22c55e");
      g.addColorStop(1, "#14532d");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      const rng = seededRandom(31);
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      for (let i = 0; i < 8; i++) {
        const tx = rng() * w * 0.8 + w * 0.1;
        const ty = rng() * h * 0.7 + h * 0.15;
        const tw = 8 + rng() * 16;
        const th = 12 + rng() * 20;
        ctx.beginPath();
        ctx.moveTo(tx, ty - th / 2);
        ctx.lineTo(tx + tw / 2, ty + th / 2);
        ctx.lineTo(tx - tw / 2, ty + th / 2);
        ctx.closePath();
        ctx.fill();
      }
    },
    borderColor: "#064e3b", borderWidth: 5,
    cellBorderColor: "#064e3b", cellBorderWidth: 2,
    showNumbers: false, watermark: true,
  },
];
