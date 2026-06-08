"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { Sparkles, Download, RefreshCw } from "lucide-react";
import ComicPanel from "./ComicPanel";

const QUOTES = [
  "gorengan ilang, hati remuk",
  "temen curhat: ai. temen real: ga ada",
  "skripsi? aku mah sosmed-an aja",
  "abstrak aja ga jelas, apalagi masa depan",
  "semangat tinggal semangat, duit tinggal duit",
  "tidur? buat apa? besok juga mati",
  "aku bukan pemalas, aku sedang menghemat energi",
  "hari ini diet. besok lagi. besoknya lagi. besoknya lagi.",
  "motivasi hidup: nanti aja deh",
  "kayaknya perlu healing, tapi kantong lagi sakit",
  "boss status: ga dibales karna chat cuma 'p'",
  "jadwal hari ini: rebahan tapi overthinking",
  "productive? iya, produktif scrolling",
  "dikit-dikit baper, kalo ga baper ga seru",
  "hidup itu kayak skripsi, penuh revisi",
  "aku ga insecure, aku cuma sadar diri",
  "semester ini targetku: ga nangis sampe UAS",
  "ngoding error, hidup juga error",
  "yang penting mah: pendinginan dulu",
  "dosen bilang 'santai aja' tapi tugas numpuk",
  "idup singleton: sendiri, sendiri, sendiri",
  "404: motivasi not found",
  "deploy hidup: always error 500",
  "commit hari ini: 'fix minor bugs'",
  "duit habis buat jajan, hati habis buat dia",
  "stres? namanya juga hidup, Nak",
  "kuota abis, sosial media dimatiin, batin pun teriak",
  "aku ga malas, aku cuma lagi menghemat tenaga",
  "hari senin aja males, apalagi hari lain",
  "kafein itu temen begadang, tapi hati tetap hampa",
];

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    const testLine = currentLine ? currentLine + " " + word : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export default function QuoteGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("");
  const [downloading, setDownloading] = useState(false);

  const randomQuote = useCallback(() => {
    setText(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  useEffect(() => { randomQuote(); }, [randomQuote]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !text.trim()) return;
    const ctx = canvas.getContext("2d")!;
    const size = 600;
    const accentHeight = 8;
    const watermarkSize = 11;
    const padding = 48;
    const maxTextWidth = size - padding * 2;
    const fontSize = 38;

    canvas.width = size;
    canvas.height = size;

    ctx.textAlign = "center";

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, size, size);

    const drawAccent = (y: number) => {
      const grad = ctx.createLinearGradient(0, y, size, y);
      grad.addColorStop(0, "#ec4899");
      grad.addColorStop(0.5, "#06b6d4");
      grad.addColorStop(1, "#ec4899");
      ctx.fillStyle = grad;
      ctx.fillRect(0, y, size, accentHeight);
    };

    const drawWatermark = () => {
      ctx.font = `700 ${watermarkSize}px "Inter",Arial,sans-serif`;
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.textBaseline = "bottom";
      ctx.fillText("socialtoolsbyza", size / 2, size - 16);
    };

    drawAccent(0);
    drawAccent(size - accentHeight);

    ctx.font = `900 ${fontSize}px "Anybody","Arial Black",Impact,sans-serif`;
    const lines = wrapText(ctx, text.trim(), maxTextWidth);
    const lineHeight = fontSize * 1.35;
    const textHeight = lines.length * lineHeight;
    const contentArea = size - accentHeight * 2 - 40;
    const startY = accentHeight + (contentArea - textHeight) / 2 + lineHeight / 2;

    ctx.textBaseline = "middle";
    ctx.fillStyle = "#111";
    lines.forEach((line, i) => {
      ctx.fillText(line, size / 2, startY + i * lineHeight);
    });

    drawWatermark();
  }, [text]);

  useEffect(() => { renderCanvas(); }, [renderCanvas]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);
    const link = document.createElement("a");
    link.download = "quote-gen-z.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    setTimeout(() => setDownloading(false), 500);
  };

  return (
    <ComicPanel bgColor="bg-white" badge="QUOTE!" badgeColor="bg-pink-500 text-white">
      <h3 className="font-display text-headline-md uppercase italic mb-4 flex items-center gap-2">
        <Sparkles className="w-6 h-6" />Quote Generator
      </h3>
      <p className="font-body text-body-md text-gray-600 mb-4">
        Bikin quote anak gen z buat story/feed. Random atau tulis sendiri!
      </p>
      <div className="flex flex-col gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full min-h-[80px] p-3 border-4 border-black bg-white font-body text-sm outline-none resize-none"
          placeholder="Tulis quote..."
          rows={2}
        />
        <div className="flex gap-2">
          <button onClick={randomQuote} className="comic-btn bg-yellow-400 text-black flex-1 text-sm flex items-center justify-center gap-1">
            <RefreshCw className="w-4 h-4" /> ACKAHIN!
          </button>
          <button onClick={handleDownload} disabled={downloading || !text.trim()} className="comic-btn bg-black text-white flex items-center justify-center gap-1 text-sm disabled:opacity-50">
            <Download className="w-4 h-4" /> {downloading ? "..." : "DOWNLOAD"}
          </button>
        </div>
        <div className="flex justify-center">
          <canvas ref={canvasRef} className="w-full max-w-[500px] shadow-[4px_4px_0_#000]" />
        </div>
      </div>
    </ComicPanel>
  );
}
