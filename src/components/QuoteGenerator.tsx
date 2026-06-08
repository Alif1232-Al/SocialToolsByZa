"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { Sparkles, Download, RefreshCw } from "lucide-react";
import ComicPanel from "./ComicPanel";

const QUOTES = [
  "dia: jangan baper\naku: *baper*",
  "suka sama kamu\ntapi kamu suka dia\nyaudah\n*nyanyi lagu sedih*",
  "chat cuma 'p'\njawab cuma 'iya'\naku baper", "dia chat 'hmm'\naku udah bikin\nskenario nikah",
  "akun diagnosed:\nsuka suka\nyang gak bales",
  "aku: santai aja\njuga aku:\n*overthinking 24/7*",
  "tiap liat story dia\ntapi ga pernah\nberani chat",
  "mental health:\n-30\ncinta:\n0",
  "dia: kita temenan aja\naku: *pura pura ikhlas*",
  "followers dia naik\naku? sedih naik",
  "suka sama yang\ngak seharusnya\nclassic deh pokoknya",
  "aku bukan pelarian\ntapi kalo kamu\nmau ngejar, gapapa",
  "dia: jangan baper ya\naku yang salah\n*salahkan diri sendiri*",
  "nyaman sama kamu\ntapi kamu nyaman\nsama semua orang",
  "aku? patah hati terus\nudah jadi hobi",
  "dia suka sama\ntemenku\naku: *pura pura happy*",
  "story dia diliatin\nchat aja ga pernah\ngimana sih",
  "relationship status:\noverthinking",
  "aku suka kamu\ntapi gpp\nbiasa aja",
  "dia chat seminggu sekali\naku? siap sedia 24 jam",
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

function splitLines(text: string): string[] {
  return text.split("\n");
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
    const wrapWidth = 340;

    canvas.width = size;
    canvas.height = size;

    ctx.textAlign = "center";

    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, size, size);

    const rawLines = splitLines(text.trim());
    if (!rawLines.some((l) => l.trim())) return;

    ctx.font = '900 120px "Inter","Arial Black",Impact,sans-serif';
    let maxW = 0;
    for (const line of rawLines) {
      const w = ctx.measureText(line).width;
      if (w > maxW) maxW = w;
    }

    let fs = Math.floor(120 * ((wrapWidth * 0.95) / maxW));
    fs = Math.min(220, Math.max(28, fs));

    ctx.font = `900 ${fs}px "Inter","Arial Black",Impact,sans-serif`;

    const allLines: string[] = [];
    for (const line of rawLines) {
      if (ctx.measureText(line).width <= wrapWidth) {
        allLines.push(line);
      } else {
        const wrapped = wrapText(ctx, line, wrapWidth);
        allLines.push(...wrapped);
      }
    }

    if (allLines.length * (fs + fs * 0.12) > size * 0.92) {
      const ratio = (size * 0.92) / (allLines.length * (fs + fs * 0.12));
      fs = Math.floor(fs * ratio);
      fs = Math.max(20, fs);
      ctx.font = `900 ${fs}px "Inter","Arial Black",Impact,sans-serif`;
      allLines.length = 0;
      for (const line of rawLines) {
        if (ctx.measureText(line).width <= wrapWidth) {
          allLines.push(line);
        } else {
          const wrapped = wrapText(ctx, line, wrapWidth);
          allLines.push(...wrapped);
        }
      }
    }

    const lineSpacing = fs * 0.12;
    const lineHeight = fs + lineSpacing;
    const totalTextHeight = allLines.length * lineHeight;
    const startY = (size - totalTextHeight) / 2 + lineHeight / 2;

    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000";
    let cy = startY;
    for (const line of allLines) {
      if (line) {
        ctx.fillText(line, size / 2, cy);
      }
      cy += lineHeight;
    }
    ctx.shadowBlur = 0;
  }, [text]);

  useEffect(() => { renderCanvas(); }, [renderCanvas]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);
    const link = document.createElement("a");
    link.download = "quote.png";
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
        Auto jadi gambar, tinggal download. Cocok buat story, feed, atau sindiran buat crush!
      </p>
      <div className="flex flex-col gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full min-h-[90px] p-3 border-4 border-black bg-white font-body text-sm outline-none resize-none"
          placeholder="ketik quote..."
          rows={3}
        />
        <div className="flex gap-2 flex-wrap">
          <button onClick={randomQuote} className="comic-btn bg-yellow-400 text-black flex-1 text-sm flex items-center justify-center gap-1 min-w-[120px]">
            <RefreshCw className="w-4 h-4" /> ACKAHIN!
          </button>
          <button onClick={handleDownload} disabled={downloading || !text.trim()} className="comic-btn bg-black text-white flex items-center justify-center gap-1 text-sm disabled:opacity-50 min-w-[120px]">
            <Download className="w-4 h-4" /> {downloading ? "..." : "DOWNLOAD"}
          </button>
        </div>
        <div className="flex justify-center">
          <canvas ref={canvasRef} className="w-full max-w-[400px]" />
        </div>
      </div>
    </ComicPanel>
  );
}
