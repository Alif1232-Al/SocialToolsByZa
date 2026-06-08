"use client";
import { useState } from "react";
import { Scissors, User, Baby, Palette, RefreshCw, Utensils, Download } from "lucide-react";
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
  const owner = grandTotal * OWNER_SHARE;
  const employeeGross = grandTotal * EMPLOYEE_SHARE;
  const employeeGet = employeeGross + uangMakan;
  const ownerGet = owner - uangMakan;
  const totalCustomers = dewasa + anak + semir;
  const hasResult = totalCustomers > 0;

  const exportPdf = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("DEKA BARBER", 105, y, { align: "center" });
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(date, 105, y, { align: "center" });
    y += 6;

    doc.setDrawColor(0);
    doc.setLineWidth(0.8);
    doc.line(10, y, 200, y);
    y += 8;

    const colW = [60, 35, 35, 40];
    const headers = ["Layanan", "Harga", "Jumlah", "Total"];
    const dataR = [
      ["Potong Dewasa", "25.000", `${dewasa}`, `${totalDewasa}.000`],
      ["Potong Anak", "20.000", `${anak}`, `${totalAnak}.000`],
      ["Semir Rambut", "40.000", `${semir}`, `${totalSemir}.000`],
    ];

    const rowH = 8;
    const totalH = rowH * (1 + dataR.length + 1);
    const tableY = y;
    const tblX = 10;
    const tblW = colW.reduce((a, b) => a + b, 0);

    const drawCell = (x: number, y: number, w: number, h: number, txt: string, opts: { bold?: boolean; bg?: number[]; color?: number[]; align?: string; size?: number }) => {
      if (opts.bg) {
        doc.setFillColor(opts.bg[0], opts.bg[1], opts.bg[2]);
        doc.rect(x, y, w, h, "F");
      }
      doc.setDrawColor(0);
      doc.setLineWidth(0.3);
      doc.rect(x, y, w, h);
      doc.setFont("helvetica", opts.bold ? "bold" : "normal");
      doc.setFontSize(opts.size || 10);
      if (opts.color) doc.setTextColor(opts.color[0], opts.color[1], opts.color[2]);
      else doc.setTextColor(0);
      const a = opts.align as "center" | "left" | "right" | "justify";
      const alignX = a === "right" ? x + w - 3 : a === "center" || a === "justify" ? x + w / 2 : x + 3;
      doc.text(txt, alignX, y + h / 2 + 1.5, { align: a });
    };

    let cx = tblX;
    for (let i = 0; i < headers.length; i++) {
      drawCell(cx, tableY, colW[i], rowH, headers[i], { bold: true, bg: [0, 0, 0], color: [255, 255, 255], align: i === 3 ? "right" : i === 0 ? "left" : "center" });
      cx += colW[i];
    }

    for (let r = 0; r < dataR.length; r++) {
      cx = tblX;
      for (let c = 0; c < dataR[r].length; c++) {
        drawCell(cx, tableY + (r + 1) * rowH, colW[c], rowH, dataR[r][c], {
          align: c === 3 ? "right" : c === 0 ? "left" : "center",
        });
        cx += colW[c];
      }
    }

    const footY = tableY + (dataR.length + 1) * rowH;
    cx = tblX;
    for (let i = 0; i < colW.length; i++) {
      drawCell(cx, footY, i === 0 ? colW[0] + colW[1] : colW[i], rowH, 
        i === 0 ? "TOTAL" : i === 2 ? `${totalCustomers}` : `${grandTotal}.000`,
        { bold: true, bg: [253, 230, 138], align: i >= 2 ? "right" : "left", size: 11 });
      if (i === 1) cx += colW[1];
      cx += colW[i];
    }

    y = footY + rowH + 12;

    const boxX = 40;
    const boxW = 120;
    const boxH = 34;
    doc.setDrawColor(0);
    doc.setLineWidth(0.6);
    doc.rect(boxX, y, boxW, boxH);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("BAGI HASIL 60 : 40", 100, y + 7, { align: "center" });

    const mid = boxX + boxW / 2;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Owner (60%)", boxX + boxW / 4, y + 16, { align: "center" });
    doc.text("Karyawan (40%)", mid + boxW / 4, y + 16, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`${owner}.000`, boxX + boxW / 4, y + 22, { align: "center" });
    doc.text(`${employeeGross}.000`, mid + boxW / 4, y + 22, { align: "center" });

    doc.setFontSize(8);
    doc.setTextColor(200, 0, 0);
    doc.text(`- Uang Makan ${uangMakan}.000`, boxX + boxW / 4, y + 27, { align: "center" });
    doc.setTextColor(0, 150, 0);
    doc.text(`+ Uang Makan ${uangMakan}.000`, mid + boxW / 4, y + 27, { align: "center" });

    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`${ownerGet}.000`, boxX + boxW / 4, y + 33, { align: "center" });
    doc.text(`${employeeGet}.000`, mid + boxW / 4, y + 33, { align: "center" });

    y += boxH + 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("socialtoolsbyza", 105, y, { align: "center" });

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
            <button onClick={exportPdf}
              className="comic-btn bg-black text-white flex-1 text-xs flex items-center justify-center gap-1 py-2">
              <Download className="w-3.5 h-3.5" /> EXPORT PDF
            </button>
          )}
        </div>

        {hasResult && (
          <div className="border-4 border-black bg-white p-3 space-y-2">
            <div className="flex items-center justify-between text-sm border-b-2 border-black pb-1 font-bold">
              <span>TOTAL</span>
              <span className="font-display text-xl">{grandTotal}k</span>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 text-center bg-black text-white py-2 px-1">
                <p className="text-[9px] uppercase tracking-widest opacity-70">Owner (60%)</p>
                <p className="font-display text-base font-black">{owner}k</p>
                <p className="text-[8px] text-red-300">-{uangMakan}k</p>
                <p className="font-display text-sm font-black border-t border-white/30 pt-1 mt-1">{ownerGet}k</p>
              </div>
              <div className="flex-1 text-center bg-gray-800 text-white py-2 px-1">
                <p className="text-[9px] uppercase tracking-widest opacity-70">Karyawan (40%)</p>
                <p className="font-display text-base font-black">{employeeGross}k</p>
                <p className="text-[8px] text-green-300">+{uangMakan}k</p>
                <p className="font-display text-sm font-black border-t border-white/30 pt-1 mt-1">{employeeGet}k</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ComicPanel>
  );
}
