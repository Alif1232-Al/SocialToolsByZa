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
    const w = 600;
    const padding = 40;
    const borderSize = 6;
    const maxTextWidth = w - padding * 2;
    const fontSize = 34;

    ctx.font = `900 ${fontSize}px "Inter","Arial Black",Impact,sans-serif`;
    const lines = wrapText(ctx, text.trim(), maxTextWidth);
    const lineHeight = fontSize * 1.4;
    const textHeight = lines.length * lineHeight;
    const totalHeight = Math.max(300, textHeight + padding * 2);

    canvas.width = w;
    canvas.height = totalHeight;

    ctx.font = `900 ${fontSize}px "Inter","Arial Black",Impact,sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, totalHeight);

    ctx.strokeStyle = "#000";
    ctx.lineWidth = borderSize;
    ctx.strokeRect(borderSize / 2, borderSize / 2, w - borderSize, totalHeight - borderSize);

    ctx.fillStyle = "#000";
    const startY = (totalHeight - textHeight) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, w / 2, startY + i * lineHeight + lineHeight / 2);
    });
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
          <canvas ref={canvasRef} className="w-full max-w-[600px] border-4 border-black" />
        </div>
      </div>
    </ComicPanel>
  );
}
