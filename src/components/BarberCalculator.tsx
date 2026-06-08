"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Scissors, User, Baby, Palette, RefreshCw, Utensils, Download, ImageIcon } from "lucide-react";
import ComicPanel from "./ComicPanel";
import jsPDF from "jspdf";

const PRICES = { dewasa: 25, anak: 20, semir: 40 };
const OWNER_SHARE = 0.6;
const EMPLOYEE_SHARE = 0.4;

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function todayStr() {
  const d = new Date();
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default function BarberCalculator() {
  const [date, setDate] = useState(todayStr());
  const [dewasa, setDewasa] = useState(0);
  const [anak, setAnak] = useState(0);
  const [semir, setSemir] = useState(0);
  const [uangMakan, setUangMakan] = useState(25);

  const totalDewasa = dewasa * PRICES.dewasa;
  const totalAnak = anak * PRICES.anak;
  const totalSemir = semir * PRICES.semir;
  const grandTotal = totalDewasa + totalAnak + totalSemir;
  const netTotal = Math.max(0, grandTotal - uangMakan);
  const owner = netTotal * OWNER_SHARE;
  const employee = netTotal * EMPLOYEE_SHARE;
  const totalCustomers = dewasa + anak + semir;
  const hasResult = totalCustomers > 0;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderCanvas = useCallback(() => {
    const cvs = canvasRef.current;
    if (!cvs || !hasResult) return;
    const ctx = cvs.getContext("2d")!;
    const sz = 500;
    cvs.width = sz;
    cvs.height = sz;

    const grad = ctx.createLinearGradient(0, 0, sz, sz);
    grad.addColorStop(0, "#fdf2f8");
    grad.addColorStop(0.5, "#fce7f3");
    grad.addColorStop(1, "#fef3c7");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, sz, sz);

    ctx.textAlign = "center";

    ctx.fillStyle = "#111";
    ctx.font = '900 28px "Inter","Arial",sans-serif';
    ctx.fillText("DEKA BARBER", sz / 2, 50);

    ctx.font = '400 14px "Inter","Arial",sans-serif';
    ctx.fillStyle = "#666";
    ctx.fillText(date, sz / 2, 70);

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 85);
    ctx.lineTo(sz - 40, 85);
    ctx.stroke();

    const rows = [
      ["Potong Dewasa", `${dewasa} × 25k`, `${totalDewasa}k`],
      ["Potong Anak", `${anak} × 20k`, `${totalAnak}k`],
      ["Semir Rambut", `${semir} × 40k`, `${totalSemir}k`],
    ];
    ctx.font = '400 14px "Inter","Arial",sans-serif';
    let y = 115;
    for (const r of rows) {
      ctx.textAlign = "left";
      ctx.fillStyle = "#333";
      ctx.fillText(r[0], 50, y);
      ctx.textAlign = "center";
      ctx.fillText(r[1], sz / 2, y);
      ctx.textAlign = "right";
      ctx.fillText(r[2], sz - 50, y);
      y += 28;
    }

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(sz - 40, y);
    ctx.stroke();
    y += 10;

    ctx.textAlign = "left";
    ctx.font = '700 16px "Inter","Arial",sans-serif';
    ctx.fillStyle = "#111";
    ctx.fillText("TOTAL", 50, y);
    ctx.textAlign = "right";
    ctx.fillText(`${grandTotal}k`, sz - 50, y);
    y += 40;

    ctx.textAlign = "center";
    ctx.font = '700 12px "Inter","Arial",sans-serif';
    ctx.fillStyle = "#555";
    ctx.fillText("— BAGI HASIL 60 : 40 —", sz / 2, y);
    y += 8;

    const bx = 60;
    const bw = sz - 120;
    const by = y;
    const bh = 65;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.font = '700 12px "Inter","Arial",sans-serif';
    ctx.fillStyle = "#111";
    ctx.textAlign = "center";
    ctx.fillText("Owner (60%)", bx + bw * 0.25, by + 18);
    ctx.fillText("Karyawan (40%)", bx + bw * 0.75, by + 18);

    ctx.font = '700 22px "Inter","Arial",sans-serif';
    ctx.fillText(`${owner}k`, bx + bw * 0.25, by + 50);
    ctx.fillText(`${employee}k`, bx + bw * 0.75, by + 50);

    y = by + bh + 10;
    ctx.font = '400 10px "Inter","Arial",sans-serif';
    ctx.fillStyle = "#888";
    ctx.fillText(`Pendapatan bersih: ${netTotal}k (setelah uang makan ${uangMakan}k)`, sz / 2, y);

    ctx.font = '400 10px "Inter","Arial",sans-serif';
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillText("socialtoolsbyza", sz / 2, sz - 15);
  }, [hasResult, date, dewasa, anak, semir, uangMakan, grandTotal, totalDewasa, totalAnak, totalSemir, owner, employee, netTotal, totalCustomers]);

  useEffect(() => { renderCanvas(); }, [renderCanvas]);

  const handleDownloadPng = () => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const link = document.createElement("a");
    link.download = "deka-barber-preview.png";
    link.href = cvs.toDataURL("image/png");
    link.click();
  };

  const exportPdf = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pw = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("DEKA BARBER", pw / 2, y, { align: "center" });
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(date, pw / 2, y, { align: "center" });
    y += 6;

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(15, y, pw - 15, y);
    y += 8;

    const ml = 15;
    const mr = 15;
    const tw = pw - ml - mr;
    const colW = [tw * 0.38, tw * 0.2, tw * 0.17, tw * 0.25];

    const headers = ["Layanan", "Harga", "Jumlah", "Total"];
    const dataR = [
      ["Potong Dewasa", "25.000", `${dewasa}`, `${totalDewasa}.000`],
      ["Potong Anak", "20.000", `${anak}`, `${totalAnak}.000`],
      ["Semir Rambut", "40.000", `${semir}`, `${totalSemir}.000`],
    ];

    const rh = 7.5;
    const fs = 9;
    const fw = (txt: string, s?: number) => doc.getTextWidth(txt) * (s || fs) / doc.getFontSize();

    const cell = (x: number, y: number, w: number, h: number, txt: string, a: string, opts?: { bold?: boolean; bg?: number[]; color?: number[]; sz?: number }) => {
      if (opts?.bg) { doc.setFillColor(opts.bg[0], opts.bg[1], opts.bg[2]); doc.rect(x, y, w, h, "F"); }
      doc.setDrawColor(0);
      doc.setLineWidth(0.3);
      doc.rect(x, y, w, h);
      doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
      doc.setFontSize(opts?.sz || fs);
      const c = opts?.color || [0, 0, 0];
      doc.setTextColor(c[0], c[1], c[2]);
      const ax = a === "r" ? x + w - 3 : a === "c" ? x + w / 2 : x + 3;
      type AlignT = "center" | "left" | "right" | "justify";
      const alignMap: Record<string, AlignT> = { r: "right", c: "center", l: "left" };
      const align1 = a === "r" ? "right" as const : a === "c" ? "center" as const : "left" as const;
      doc.text(txt, ax, y + h / 2 + 1.2, { align: alignMap[a] || "left" });
    };

    const cxPos = () => { let s = ml; return (i: number) => { const p = s; s += colW[i]; return p; }; };

    let cx = ml;
    for (let i = 0; i < headers.length; i++) { cell(cx, y, colW[i], rh, headers[i], i === 0 ? "l" : "c", { bold: true, bg: [0, 0, 0], color: [255, 255, 255] }); cx += colW[i]; }
    y += rh;

    for (const row of dataR) {
      cx = ml;
      for (let c = 0; c < row.length; c++) { cell(cx, y, colW[c], rh, row[c], c === 0 ? "l" : "c"); cx += colW[c]; }
      y += rh;
    }

    cell(ml, y, colW[0] + colW[1], rh, "TOTAL", "l", { bold: true, bg: [253, 230, 138] });
    cell(ml + colW[0] + colW[1], y, colW[2], rh, `${totalCustomers}`, "c", { bold: true, bg: [253, 230, 138] });
    cell(ml + colW[0] + colW[1] + colW[2], y, colW[3], rh, `${grandTotal}.000`, "r", { bold: true, bg: [253, 230, 138], sz: 10 });
    y += rh + 12;

    const bx = pw / 2 - 55;
    const bw = 110;
    const bh = 30;
    doc.setLineWidth(0.5);
    doc.rect(bx, y, bw, bh);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("BAGI HASIL 60 : 40", pw / 2, y + 6.5, { align: "center" });

    const m = bx + bw / 2;
    const lx = bx + bw / 4;
    const rx = m + bw / 4;

    doc.setFontSize(8);
    doc.text("Owner (60%)", lx, y + 15, { align: "center" });
    doc.text("Karyawan (40%)", rx, y + 15, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`${owner}.000`, lx, y + 24, { align: "center" });
    doc.text(`${employee}.000`, rx, y + 24, { align: "center" });

    y += bh + 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Pendapatan bersih: ${netTotal}.000 (setelah uang makan ${uangMakan}.000)`, pw / 2, y, { align: "center" });
    doc.setTextColor(0);
    y += 12;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(180);
    doc.text("socialtoolsbyza", pw / 2, y, { align: "center" });

    doc.save(`deka-barber-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <ComicPanel bgColor="bg-cyan-400" badge="HITUNG!" badgeColor="bg-pink-500 text-white">
      <div className="flex items-center gap-2 mb-1">
        <Scissors className="w-6 h-6 shrink-0" />
        <h3 className="font-display text-headline-md uppercase italic">Barber Daily Kalkulator</h3>
      </div>
      <p className="font-body text-body-md text-gray-800 mb-4">
        Hitung pendapatan harian. Sistem 60:40 + uang makan.
      </p>

      <div className="flex flex-col gap-2.5">
        <input value={date} onChange={(e) => setDate(e.target.value)}
          className="w-full p-2.5 border-4 border-black bg-white font-body font-bold text-sm outline-none text-center" />

        {([ 
          { label: "Potong Dewasa", price: "25k", icon: User, color: "text-pink-600", val: dewasa, set: setDewasa, total: totalDewasa },
          { label: "Potong Anak", price: "20k", icon: Baby, color: "text-yellow-600", val: anak, set: setAnak, total: totalAnak },
          { label: "Semir Rambut", price: "40k", icon: Palette, color: "text-purple-600", val: semir, set: setSemir, total: totalSemir },
        ] as const).map((item, i) => (
          <div key={i} className="flex items-center gap-2 border-4 border-black bg-white p-2.5">
            <item.icon className={`w-5 h-5 shrink-0 ${item.color}`} />
            <span className="font-body font-bold text-xs min-w-[90px]">{item.label}</span>
            <span className="font-body text-[10px] text-gray-400 w-[28px]">({item.price})</span>
            <input type="number" min={0} value={item.val || ""}
              onChange={(e) => item.set(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-14 p-1.5 border-2 border-black text-center font-body font-bold text-sm outline-none" />
            <span className="font-body text-xs text-gray-500 ml-auto">={item.total}k</span>
          </div>
        ))}

        <div className="flex items-center gap-2 border-4 border-black bg-white p-2.5">
          <Utensils className="w-5 h-5 shrink-0 text-orange-600" />
          <span className="font-body font-bold text-xs min-w-[90px]">Uang Makan</span>
          <div className="flex items-center gap-1">
            <span className="font-body text-xs font-bold">Rp</span>
            <input type="number" min={0} value={uangMakan || ""}
              onChange={(e) => setUangMakan(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-14 p-1.5 border-2 border-black text-center font-body font-bold text-sm outline-none" />
            <span className="font-body text-xs font-bold">k</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => { setDewasa(0); setAnak(0); setSemir(0); setUangMakan(25); }}
            className="comic-btn bg-yellow-400 text-black flex-1 text-xs flex items-center justify-center gap-1 py-2">
            <RefreshCw className="w-3.5 h-3.5" /> RESET
          </button>
          {hasResult && (
            <>
              <button onClick={exportPdf}
                className="comic-btn bg-black text-white flex-1 text-xs flex items-center justify-center gap-1 py-2">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button onClick={handleDownloadPng}
                className="comic-btn bg-green-600 text-white flex-1 text-xs flex items-center justify-center gap-1 py-2">
                <ImageIcon className="w-3.5 h-3.5" /> PNG
              </button>
            </>
          )}
        </div>

        {hasResult && (
          <div className="border-4 border-black bg-white p-3 space-y-2">
            <div className="flex items-center justify-between text-sm border-b-2 border-black pb-1 font-bold">
              <span>TOTAL</span>
              <span className="font-display text-xl">{grandTotal}k</span>
            </div>
            <div className="text-xs text-gray-500 text-center -mt-1">
              Uang makan: {uangMakan}k → Pendapatan bersih: <strong>{netTotal}k</strong>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 text-center bg-black text-white py-3 px-1">
                <p className="text-[9px] uppercase tracking-widest opacity-70">Owner (60%)</p>
                <p className="font-display text-xl font-black">{owner}k</p>
              </div>
              <div className="flex-1 text-center bg-gray-800 text-white py-3 px-1">
                <p className="text-[9px] uppercase tracking-widest opacity-70">Karyawan (40%)</p>
                <p className="font-display text-xl font-black">{employee}k</p>
              </div>
            </div>
          </div>
        )}

        {hasResult && (
          <div className="flex justify-center">
            <canvas ref={canvasRef} className="w-full max-w-[380px] border-4 border-black shadow-[4px_4px_0_#000]" />
          </div>
        )}
      </div>
    </ComicPanel>
  );
}
