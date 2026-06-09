export type TextPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

export type FontStyle = "bold" | "playful" | "elegant" | "compact" | "classic" | "funky" | "cute" | "retro" | "graffiti" | "minimal";

export type BadgeShape = "rounded" | "pill" | "flag" | "underline" | "outline";

const FONT_MAP: Record<FontStyle, string> = {
  bold: `bold 16px "Inter","Arial",sans-serif`,
  playful: `16px "Comic Sans MS","Comic Sans",cursive`,
  elegant: `italic 16px "Georgia","Times New Roman",serif`,
  compact: `600 16px "Segoe UI","Arial",sans-serif`,
  classic: `16px "Times New Roman",Georgia,serif`,
  funky: `900 16px "Impact","Arial Black",sans-serif`,
  cute: `16px "Segoe Print","Bradley Hand",cursive`,
  retro: `16px "Courier New","Lucida Console",monospace`,
  graffiti: `bold italic 16px "Impact","Arial Black",sans-serif`,
  minimal: `300 16px "Inter","Segoe UI",sans-serif`,
};

export type FrameText = {
  text: string;
  color: string;
  bgColor: string;
  bgColor2?: string;
  opacity?: number;
  shape: BadgeShape;
  position: TextPosition;
  fontSize: number;
  fontStyle: FontStyle;
  shadowColor: string;
};

export type PlacedEmoji = {
  id: string;
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
  textBg2: string;
  textBgGrad: boolean;
  textOpacity: number;
  textShape: BadgeShape;
  textShadow: string;
  textPosition: TextPosition;
  textFont: FontStyle;
  decoration: "none" | "stars" | "hearts" | "dots" | "circles";
  emojis: PlacedEmoji[];
  selectedEmoji: string | null;
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
  textBg2: "#333",
  textBgGrad: false,
  textOpacity: 100,
  textShape: "rounded",
  textShadow: "#000",
  textPosition: "bottom-center",
  textFont: "bold",
  decoration: "none",
  emojis: [],
  selectedEmoji: null,
};

export const EMOJI_CATEGORIES = [
  { name: "Faces", items: ["😊","😂","🥰","😎","🤩","😍","🔥","💯","✨","💪","🤙","👀","😜","🤗","🫶","🥹"] },
  { name: "Hearts", items: ["❤️","💜","💙","💚","💛","🧡","🩷","🩵","💕","💖","💗","🖤","🤍","💝","❤️‍🔥","🩶"] },
  { name: "Symbols", items: ["⭐","🌟","💫","🎀","🌸","🌺","🎯","🏆","👑","💎","🌈","🎉","🔮","💠","♾️","☮️"] },
  { name: "Nature", items: ["🌊","❄️","🌴","🌅","🌙","☀️","🌸","🌺","🍀","🌻","🦋","🌈","🌹","🌷","🍁","🌿"] },
  { name: "Party", items: ["🎉","🎊","🎈","🎁","🎶","🎵","🎸","🥳","🎤","💃","🕺","🎆","🎇","🎂","🍾","🥂"] },
  { name: "Misc", items: ["👾","🤖","👻","💀","☠️","🐱","🐶","🦄","🐉","🍕","🍦","☕","🌈","⚡","💥","🪐"] },
];

function drawRoundedRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
  c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r); c.lineTo(x, y + r);
  c.quadraticCurveTo(x, y, x + r, y); c.closePath();
}

function drawPolygonStar(c: CanvasRenderingContext2D, cx: number, cy: number, or: number, ir: number, pts: number) {
  c.beginPath();
  for (let i = 0; i < pts * 2; i++) { const r = i % 2 === 0 ? or : ir; const a = (Math.PI / pts) * i - Math.PI / 2; c.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); }
  c.closePath();
}

function seededRandom(seed: number) { let s = seed; return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }; }

export function drawTextBadge(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  text: string, textColor: string, bgColor: string, bgColor2: string | undefined,
  bgGrad: boolean, opacity: number, shape: BadgeShape, shadowColor: string,
  position: TextPosition, fontSize: number, fontStyle: FontStyle,
) {
  if (!text.trim()) return;
  const txt = text.toUpperCase().trim();
  const fontStr = FONT_MAP[fontStyle].replace(/16px/, `${fontSize}px`);
  ctx.font = fontStr;
  const metrics = ctx.measureText(txt);
  const tw = metrics.width;
  const padX = 16, padY = 8;
  const bw = tw + padX * 2;
  const bh = fontSize + padY * 2;
  const margin = 12;

  let bx: number, by: number;
  if (position.startsWith("top")) by = margin; else by = h - bh - margin;
  if (position.endsWith("left")) bx = margin;
  else if (position.endsWith("right")) bx = w - bw - margin;
  else bx = (w - bw) / 2;

  const alpha = Math.max(0, Math.min(1, opacity / 100));

  if (shape === "underline") {
    const lineY = by + bh - 4;
    ctx.fillStyle = bgColor;
    ctx.globalAlpha = alpha;
    ctx.fillRect(bx, lineY, bw, 5);
    ctx.globalAlpha = 1;
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  } else if (shape === "outline") {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.strokeStyle = bgColor;
    ctx.lineWidth = 3;
    ctx.globalAlpha = alpha;
    drawRoundedRect(ctx, bx, by, bw, bh, 8);
    ctx.stroke();
    ctx.globalAlpha = 1;
  } else {
    ctx.save();
    if (shadowColor && shadowColor !== "transparent") {
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }
    ctx.globalAlpha = alpha;

    if (bgGrad && bgColor2) {
      const grd = ctx.createLinearGradient(bx, 0, bx + bw, 0);
      grd.addColorStop(0, bgColor);
      grd.addColorStop(1, bgColor2);
      ctx.fillStyle = grd;
    } else {
      ctx.fillStyle = bgColor;
    }

    if (shape === "pill") {
      const px = bh / 2;
      drawRoundedRect(ctx, bx, by, bw, bh, px);
    } else if (shape === "flag") {
      ctx.beginPath();
      ctx.moveTo(bx + 10, by);
      ctx.lineTo(bx + bw, by);
      ctx.quadraticCurveTo(bx + bw + 4, by + bh / 2, bx + bw, by + bh);
      ctx.lineTo(bx + 10, by + bh);
      ctx.lineTo(bx, by + bh / 2);
      ctx.closePath();
    } else {
      drawRoundedRect(ctx, bx, by, bw, bh, 8);
    }
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.restore();
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
  const rng = seededRandom(123); ctx.globalAlpha = 0.12;
  if (type === "stars") { ctx.fillStyle = "#fbbf24"; for (let i = 0; i < 15; i++) { const cx = rng() * w, cy = rng() * h, sz = 4 + rng() * 10; drawPolygonStar(ctx, cx, cy, sz, sz * 0.4, 5); ctx.fill(); } }
  else if (type === "hearts") { ctx.fillStyle = "#f43f5e"; for (let i = 0; i < 12; i++) { const cx = rng() * w, cy = rng() * h, sz = 4 + rng() * 8; ctx.beginPath(); ctx.moveTo(cx, cy + sz * 0.3); ctx.bezierCurveTo(cx - sz * 0.5, cy - sz * 0.3, cx - sz, cy + sz * 0.3, cx, cy + sz); ctx.bezierCurveTo(cx + sz, cy + sz * 0.3, cx + sz * 0.5, cy - sz * 0.3, cx, cy + sz * 0.3); ctx.fill(); } }
  else if (type === "dots") { ctx.fillStyle = "#000"; for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.arc(rng() * w, rng() * h, 1 + rng() * 2.5, 0, Math.PI * 2); ctx.fill(); } }
  else if (type === "circles") { ctx.fillStyle = "#fff"; for (let i = 0; i < 20; i++) { ctx.beginPath(); ctx.arc(rng() * w, rng() * h, 4 + rng() * 12, 0, Math.PI * 2); ctx.fill(); } }
  else if (type === "lightning") { ctx.fillStyle = "#fbbf24"; ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2; for (let i = 0; i < 8; i++) { const x = rng() * w, y = rng() * h, s = 8 + rng() * 14; ctx.beginPath(); ctx.moveTo(x - s * 0.3, y - s); ctx.lineTo(x + s * 0.1, y - s * 0.2); ctx.lineTo(x - s * 0.05, y - s * 0.1); ctx.lineTo(x + s * 0.3, y + s); ctx.lineTo(x, y + s * 0.3); ctx.lineTo(x + s * 0.15, y + s * 0.15); ctx.closePath(); ctx.fill(); ctx.stroke(); } }
  else if (type === "confetti") { const colors = ["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#ec4899"]; for (let i = 0; i < 35; i++) { ctx.fillStyle = colors[i % colors.length]; const x = rng() * w, y = rng() * h, rw = 2 + rng() * 6, rh = 2 + rng() * 6; ctx.save(); ctx.translate(x, y); ctx.rotate(rng() * Math.PI); ctx.fillRect(-rw / 2, -rh / 2, rw, rh); ctx.restore(); } }
  else if (type === "sparkles") { ctx.fillStyle = "#fff"; for (let i = 0; i < 12; i++) { const cx = rng() * w, cy = rng() * h, sz = 2 + rng() * 5; ctx.beginPath(); for (let j = 0; j < 4; j++) { const a = (Math.PI / 2) * j; ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * sz, cy + Math.sin(a) * sz); } ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, sz * 0.3, 0, Math.PI * 2); ctx.fill(); } }
  else if (type === "waves") { ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = 1.5; for (let i = 0; i < 10; i++) { const y = rng() * h * 0.8 + h * 0.1; ctx.beginPath(); for (let x = 0; x < w; x += 4) { const wy = y + Math.sin((x + i * 40) * 0.025) * 5 + Math.sin((x + i * 25) * 0.05) * 2.5; x === 0 ? ctx.moveTo(x, wy) : ctx.lineTo(x, wy); } ctx.stroke(); } }
  else if (type === "grid") { ctx.strokeStyle = "rgba(0,0,0,0.04)"; ctx.lineWidth = 1; const step = 20 + rng() * 20; for (let x = 0; x < w; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); } for (let y = 0; y < h; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); } }
  else if (type === "music") { ctx.fillStyle = "rgba(0,0,0,0.08)"; ctx.font = '14px "Segoe UI Emoji","Arial",sans-serif'; ctx.textAlign = "center"; ctx.textBaseline = "middle"; const notes = ["♩","♪","♫","♬","🎵","🎶"]; for (let i = 0; i < 12; i++) { ctx.fillText(notes[i % notes.length], rng() * w, rng() * h); } }
  else if (type === "stripes") { ctx.fillStyle = "rgba(0,0,0,0.04)"; ctx.save(); ctx.translate(w / 2, h / 2); ctx.rotate(-0.4); for (let i = -Math.max(w, h); i < Math.max(w, h) * 1.5; i += 18) { ctx.fillRect(i, -h * 1.5, 8, h * 3); } ctx.restore(); }
  ctx.globalAlpha = 1;
}

export function renderCustomBackground(ctx: CanvasRenderingContext2D, w: number, h: number, opts: CustomFrameOptions) {
  if (opts.bgType === "gradient") { const g = ctx.createLinearGradient(0, 0, w, h); g.addColorStop(0, opts.bgColor1); g.addColorStop(1, opts.bgColor2); ctx.fillStyle = g; }
  else { ctx.fillStyle = opts.bgColor1; }
  ctx.fillRect(0, 0, w, h);
  drawDecoration(ctx, w, h, opts.decoration);
}

export const FRAMES: FrameDef[] = [
  {
    id: "comic-boom", name: "Comic Boom", emoji: "💥",
    render(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0,"#fdf2f8");g.addColorStop(0.3,"#fff1f2");g.addColorStop(0.6,"#fef3c7");g.addColorStop(1,"#fce7f3");
      ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
      const r=seededRandom(42);ctx.fillStyle="rgba(236,72,153,0.06)";
      for(let i=0;i<30;i++){ctx.beginPath();ctx.arc(r()*w,r()*h,2+r()*3,0,Math.PI*2);ctx.fill();}
    },
    borderColor:"#111",borderWidth:5,cellBorderColor:"#111",cellBorderWidth:3,showNumbers:true,watermark:true,
    text:{text:"BOOM!",color:"#fff",bgColor:"#111",shape:"rounded",position:"bottom-center",fontSize:22,fontStyle:"bold",shadowColor:"#000"},
  },
  {
    id: "blue-ocean", name: "Blue Ocean", emoji: "🌊",
    render(ctx, w, h) {
      const g=ctx.createLinearGradient(0,0,w*0.7,h);g.addColorStop(0,"#dbeafe");g.addColorStop(0.4,"#bfdbfe");g.addColorStop(0.7,"#a5b4fc");g.addColorStop(1,"#67e8f9");
      ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
      const r=seededRandom(99);ctx.strokeStyle="rgba(255,255,255,0.3)";ctx.lineWidth=1.5;
      for(let i=0;i<8;i++){const y=r()*h*0.8+h*0.1;ctx.beginPath();for(let x=0;x<w;x+=4){const wy=y+Math.sin((x+i*50)*0.02)*6+Math.sin((x+i*30)*0.04)*3;x===0?ctx.moveTo(x,wy):ctx.lineTo(x,wy);}ctx.stroke();}
    },
    borderColor:"#1e3a5f",borderWidth:5,cellBorderColor:"#1e3a5f",cellBorderWidth:2,showNumbers:true,watermark:true,
    text:{text:"CHILL VIBES",color:"#fff",bgColor:"#1e3a5f",shape:"pill",position:"bottom-center",fontSize:20,fontStyle:"bold",shadowColor:"#000"},
  },
  {
    id: "snowy", name: "Snowy", emoji: "❄️",
    render(ctx, w, h) {
      const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,"#e0f2fe");g.addColorStop(0.5,"#f0f9ff");g.addColorStop(1,"#e0f2fe");
      ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
      const r=seededRandom(77);ctx.fillStyle="rgba(255,255,255,0.7)";
      for(let i=0;i<40;i++){ctx.beginPath();ctx.arc(r()*w,r()*h,1+r()*2.5,0,Math.PI*2);ctx.fill();}
      ctx.strokeStyle="rgba(255,255,255,0.5)";ctx.lineWidth=1;
      for(let i=0;i<8;i++){const sx=r()*w,sy=r()*h,sz=3+r()*5;ctx.beginPath();for(let j=0;j<6;j++){const a=(Math.PI/3)*j;ctx.moveTo(sx,sy);ctx.lineTo(sx+Math.cos(a)*sz,sy+Math.sin(a)*sz);}ctx.stroke();}
    },
    borderColor:"#0c4a6e",borderWidth:4,cellBorderColor:"#0c4a6e",cellBorderWidth:2,showNumbers:true,watermark:true,
    text:{text:"WINTER",color:"#fff",bgColor:"#0c4a6e",shape:"pill",position:"top-center",fontSize:22,fontStyle:"bold",shadowColor:"#000"},
  },
  {
    id: "midnight", name: "Midnight", emoji: "🌙",
    render(ctx,w,h){const g=ctx.createRadialGradient(w*0.3,h*0.3,0,w*0.5,h*0.5,Math.max(w,h)*0.8);g.addColorStop(0,"#1e1b4b");g.addColorStop(0.6,"#0f172a");g.addColorStop(1,"#020617");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);const r=seededRandom(11);ctx.fillStyle="rgba(255,255,255,0.6)";for(let i=0;i<50;i++){ctx.beginPath();ctx.arc(r()*w,r()*h,0.5+r()*1.2,0,Math.PI*2);ctx.fill();}},
    borderColor:"#fbbf24",borderWidth:4,cellBorderColor:"#fbbf24",cellBorderWidth:2,showNumbers:false,watermark:false,
    text:{text:"STARLIGHT",color:"#fbbf24",bgColor:"rgba(0,0,0,0.7)",shape:"rounded",position:"bottom-center",fontSize:20,fontStyle:"elegant",shadowColor:"#000"},
  },
  {
    id: "pastel-dream", name: "Pastel Dream", emoji: "🌸",
    render(ctx,w,h){const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"#fce7f3");g.addColorStop(0.3,"#fbcfe8");g.addColorStop(0.6,"#c7d2fe");g.addColorStop(1,"#a7f3d0");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);const r=seededRandom(33);ctx.fillStyle="rgba(255,255,255,0.25)";for(let i=0;i<20;i++){const cx=r()*w,cy=r()*h,rr=4+r()*10;drawPolygonStar(ctx,cx,cy,rr,rr*0.5,5);ctx.fill();}},
    borderColor:"#8b5cf6",borderWidth:4,cellBorderColor:"#8b5cf6",cellBorderWidth:2,showNumbers:true,watermark:true,
    text:{text:"DREAMY",color:"#fff",bgColor:"#8b5cf6",shape:"flag",position:"top-center",fontSize:22,fontStyle:"playful",shadowColor:"#000"},
  },
  {
    id: "neon-cyber", name: "Neon Cyber", emoji: "💜",
    render(ctx,w,h){ctx.fillStyle="#0d0221";ctx.fillRect(0,0,w,h);const r=seededRandom(55);ctx.strokeStyle="rgba(236,72,153,0.15)";ctx.lineWidth=1;for(let i=0;i<6;i++){const y=r()*h;ctx.beginPath();for(let x=0;x<w;x+=3){const yy=y+Math.sin((x+i*100)*0.01)*15+Math.sin((x+i*70)*0.03)*5;x===0?ctx.moveTo(x,yy):ctx.lineTo(x,yy);}ctx.stroke();}},
    borderColor:"#ec4899",borderWidth:4,cellBorderColor:"#06b6d4",cellBorderWidth:2,showNumbers:true,watermark:false,
    text:{text:"CYBER",color:"#06b6d4",bgColor:"#111",shape:"outline",position:"bottom-center",fontSize:24,fontStyle:"compact",shadowColor:"transparent"},
  },
  {
    id: "vintage-sepia", name: "Vintage Sepia", emoji: "📜",
    render(ctx,w,h){const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"#fef3c7");g.addColorStop(0.5,"#fde68a");g.addColorStop(1,"#fef3c7");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);const r=seededRandom(88);ctx.fillStyle="rgba(180,140,80,0.08)";for(let i=0;i<100;i++){ctx.fillRect(r()*w,r()*h,1+r()*2,1+r()*2);}ctx.strokeStyle="rgba(180,140,80,0.3)";ctx.lineWidth=1;ctx.strokeRect(8,8,w-16,h-16);ctx.strokeRect(12,12,w-24,h-24);},
    borderColor:"#92400e",borderWidth:4,cellBorderColor:"#92400e",cellBorderWidth:2,showNumbers:false,watermark:true,
    text:{text:"TIMELESS",color:"#92400e",bgColor:"rgba(255,255,255,0.6)",shape:"underline",position:"bottom-center",fontSize:20,fontStyle:"elegant",shadowColor:"transparent"},
  },
  {
    id: "tropical", name: "Tropical", emoji: "🌴",
    render(ctx,w,h){const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,"#d9f99d");g.addColorStop(0.5,"#a7f3d0");g.addColorStop(1,"#6ee7b7");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);const r=seededRandom(22);ctx.fillStyle="rgba(255,255,255,0.15)";for(let i=0;i<30;i++){ctx.beginPath();ctx.arc(r()*w,r()*h,3+r()*6,0,Math.PI*2);ctx.fill();}},
    borderColor:"#065f46",borderWidth:4,cellBorderColor:"#065f46",cellBorderWidth:2,showNumbers:true,watermark:true,
    text:{text:"PARADISE",color:"#fff",bgColor:"#065f46",shape:"pill",position:"bottom-center",fontSize:20,fontStyle:"playful",shadowColor:"#000"},
  },
  {
    id: "bubblegum", name: "Bubblegum", emoji: "🩷",
    render(ctx,w,h){const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"#fbcfe8");g.addColorStop(0.5,"#f9a8d4");g.addColorStop(1,"#f472b6");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);const r=seededRandom(44);ctx.fillStyle="rgba(255,255,255,0.15)";for(let i=0;i<25;i++){ctx.beginPath();ctx.arc(r()*w,r()*h,5+r()*12,0,Math.PI*2);ctx.fill();}},
    borderColor:"#9d174d",borderWidth:5,cellBorderColor:"#9d174d",cellBorderWidth:3,showNumbers:true,watermark:true,
    text:{text:"SWEET",color:"#fff",bgColor:"#9d174d",bgColor2:"#f472b6",opacity:90,shape:"flag",position:"top-center",fontSize:22,fontStyle:"cute",shadowColor:"#000"},
  },
  {
    id: "monochrome", name: "Monochrome", emoji: "⚫",
    render(ctx,w,h){const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"#f8fafc");g.addColorStop(0.5,"#e2e8f0");g.addColorStop(1,"#cbd5e1");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);const r=seededRandom(66);ctx.strokeStyle="rgba(0,0,0,0.05)";ctx.lineWidth=1;for(let i=0;i<20;i++){const x=r()*w;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+10,h);ctx.stroke();}},
    borderColor:"#000",borderWidth:4,cellBorderColor:"#475569",cellBorderWidth:2,showNumbers:false,watermark:true,
    text:{text:"CLASSIC",color:"#000",bgColor:"#fff",shape:"outline",position:"bottom-right",fontSize:18,fontStyle:"classic",shadowColor:"transparent"},
  },
  {
    id: "sunset", name: "Sunset", emoji: "🌅",
    render(ctx,w,h){const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,"#fde68a");g.addColorStop(0.3,"#fb923c");g.addColorStop(0.6,"#e11d48");g.addColorStop(1,"#4c1d95");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.fillStyle="rgba(255,255,255,0.08)";for(let i=0;i<3;i++){const sy=h*0.15+i*h*0.08;ctx.beginPath();ctx.arc(w*0.5+i*w*0.1,sy,w*0.4+i*w*0.05,0,Math.PI*2);ctx.fill();}},
    borderColor:"#2e1065",borderWidth:4,cellBorderColor:"#fde68a",cellBorderWidth:2,showNumbers:false,watermark:false,
    text:{text:"GOLDEN HOUR",color:"#fff",bgColor:"#2e1065",shape:"pill",position:"bottom-center",fontSize:18,fontStyle:"elegant",shadowColor:"#000"},
  },
  {
    id: "forest", name: "Forest", emoji: "🌲",
    render(ctx,w,h){const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,"#bbf7d0");g.addColorStop(0.4,"#86efac");g.addColorStop(0.7,"#22c55e");g.addColorStop(1,"#14532d");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);const r=seededRandom(31);ctx.fillStyle="rgba(0,0,0,0.06)";for(let i=0;i<8;i++){const tx=r()*w*0.8+w*0.1,ty=r()*h*0.7+h*0.15,tw=8+r()*16,th=12+r()*20;ctx.beginPath();ctx.moveTo(tx,ty-th/2);ctx.lineTo(tx+tw/2,ty+th/2);ctx.lineTo(tx-tw/2,ty+th/2);ctx.closePath();ctx.fill();}},
    borderColor:"#064e3b",borderWidth:5,cellBorderColor:"#064e3b",cellBorderWidth:2,showNumbers:false,watermark:true,
    text:{text:"NATURE",color:"#fff",bgColor:"#064e3b",shape:"flag",position:"top-center",fontSize:22,fontStyle:"compact",shadowColor:"#000"},
  },
];
