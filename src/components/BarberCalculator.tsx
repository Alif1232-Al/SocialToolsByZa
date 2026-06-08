"use client";
import { useState, useRef } from "react";
import { Scissors, User, Baby, Palette, RefreshCw, Utensils, Printer } from "lucide-react";
import ComicPanel from "./ComicPanel";

const PRICES = { dewasa: 25, anak: 20, semir: 40 };
const OWNER_SHARE = 0.6;
const EMPLOYEE_SHARE = 0.4;

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function formatDate(d: Date) {
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default function BarberCalculator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [date, setDate] = useState(formatDate(new Date()));
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

  const handlePrintPdf = () => {
    const w = printRef.current;
    if (!w) return;
    const clone = w.cloneNode(true) as HTMLDivElement;
    const styles = Array.from(document.styleSheets)
      .map((s) => {
        try {
          return Array.from(s.cssRules || []).map((r) => r.cssText).join("");
        } catch { return ""; }
      })
      .join("");

    const html = `<html><head><style>${styles}</style><style>
      body { padding: 40px; font-family: Arial, sans-serif; }
      .no-print { display: none !important; }
      .print-only { display: block !important; }
      .print-report { max-width: 600px; margin: 0 auto; }
      table { width: 100%; border-collapse: collapse; }
      td, th { border: 2px solid #000; padding: 8px; text-align: center; font-size: 14px; }
      th { background: #000; color: #fff; font-weight: bold; }
      .total-row td { font-weight: bold; background: #fde68a; }
      .split-box { border: 2px solid #000; padding: 12px; margin-top: 16px; text-align: center; }
      .split-box h3 { margin: 0 0 8px; font-size: 16px; }
      .split-row { display: flex; justify-content: space-around; }
      .split-item { padding: 8px 16px; }
      .split-item p { margin: 2px 0; }
    </style></head><body><div class="print-report">${clone.innerHTML}</div></body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) {
      win.onload = () => { win.print(); URL.revokeObjectURL(url); };
    }
  };

  return (
    <ComicPanel bgColor="bg-cyan-400" badge="HITUNG!" badgeColor="bg-pink-500 text-white">
      <h3 className="font-display text-headline-md uppercase italic mb-4 flex items-center gap-2">
        <Scissors className="w-6 h-6" />Barber Daily Kalkulator
      </h3>
      <p className="font-body text-body-md text-gray-800 mb-4">
        Hitung pendapatan harian barber. Sistem 60:40 + uang makan.
      </p>

      <div className="flex flex-col gap-3">
        <input value={date} onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 border-4 border-black bg-white font-body font-bold text-sm outline-none text-center" />

        <div className="flex items-center gap-3 border-4 border-black bg-white p-3">
          <User className="w-5 h-5 shrink-0 text-pink-600" />
          <span className="font-body font-bold text-sm min-w-[80px]">Dewasa (25k)</span>
          <input type="number" min={0} value={dewasa || ""}
            onChange={(e) => setDewasa(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-16 p-2 border-2 border-black text-center font-body font-bold text-sm outline-none" />
          <span className="font-body text-xs text-gray-500 ml-auto">={totalDewasa}k</span>
        </div>

        <div className="flex items-center gap-3 border-4 border-black bg-white p-3">
          <Baby className="w-5 h-5 shrink-0 text-yellow-600" />
          <span className="font-body font-bold text-sm min-w-[80px]">Anak (20k)</span>
          <input type="number" min={0} value={anak || ""}
            onChange={(e) => setAnak(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-16 p-2 border-2 border-black text-center font-body font-bold text-sm outline-none" />
          <span className="font-body text-xs text-gray-500 ml-auto">={totalAnak}k</span>
        </div>

        <div className="flex items-center gap-3 border-4 border-black bg-white p-3">
          <Palette className="w-5 h-5 shrink-0 text-purple-600" />
          <span className="font-body font-bold text-sm min-w-[80px]">Semir (40k)</span>
          <input type="number" min={0} value={semir || ""}
            onChange={(e) => setSemir(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-16 p-2 border-2 border-black text-center font-body font-bold text-sm outline-none" />
          <span className="font-body text-xs text-gray-500 ml-auto">={totalSemir}k</span>
        </div>

        <div className="flex items-center gap-3 border-4 border-black bg-white p-3">
          <Utensils className="w-5 h-5 shrink-0 text-orange-600" />
          <span className="font-body font-bold text-sm min-w-[80px]">Uang Makan</span>
          <div className="flex items-center gap-1">
            <span className="font-body text-xs font-bold">Rp</span>
            <input type="number" min={0} value={uangMakan || ""}
              onChange={(e) => setUangMakan(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-16 p-2 border-2 border-black text-center font-body font-bold text-sm outline-none" />
            <span className="font-body text-xs font-bold">k</span>
          </div>
        </div>

        <div className="flex gap-2 no-print">
          <button onClick={() => { setDewasa(0); setAnak(0); setSemir(0); setUangMakan(25); }}
            className="comic-btn bg-yellow-400 text-black flex-1 text-sm flex items-center justify-center gap-1 py-2">
            <RefreshCw className="w-4 h-4" /> RESET
          </button>
          {hasResult && (
            <button onClick={handlePrintPdf}
              className="comic-btn bg-black text-white flex-1 text-sm flex items-center justify-center gap-1 py-2">
              <Printer className="w-4 h-4" /> PRINT / PDF
            </button>
          )}
        </div>

        {hasResult && (
          <>
            <div ref={printRef} className="print-report" style={{ fontFamily: "Arial,sans-serif" }}>
              <div className="text-center mb-4" style={{ borderBottom: "3px solid #000", paddingBottom: 8 }}>
                <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, textTransform: "uppercase", letterSpacing: 2 }}>DEKA BARBER</h1>
                <p style={{ fontSize: 12, color: "#666", margin: "4px 0 0" }}>{date}</p>
              </div>

              <table>
                <thead>
                  <tr>
                    <th style={{ width: "40%" }}>Layanan</th>
                    <th style={{ width: "20%" }}>Harga</th>
                    <th style={{ width: "20%" }}>Jumlah</th>
                    <th style={{ width: "20%" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "left" }}>Potong Dewasa</td>
                    <td>25k</td>
                    <td>{dewasa}</td>
                    <td>{totalDewasa}k</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "left" }}>Potong Anak</td>
                    <td>20k</td>
                    <td>{anak}</td>
                    <td>{totalAnak}k</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "left" }}>Semir Rambut</td>
                    <td>40k</td>
                    <td>{semir}</td>
                    <td>{totalSemir}k</td>
                  </tr>
                  <tr className="total-row">
                    <td colSpan={2} style={{ textAlign: "right", fontWeight: "bold" }}>TOTAL</td>
                    <td>{totalCustomers}</td>
                    <td style={{ fontWeight: "bold", fontSize: 16 }}>{grandTotal}k</td>
                  </tr>
                </tbody>
              </table>

              <div className="split-box" style={{ border: "2px solid #000", padding: 12, marginTop: 16, textAlign: "center" }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 14, textTransform: "uppercase" }}>Bagi Hasil 60:40</h3>
                <div className="split-row" style={{ display: "flex", justifyContent: "space-around" }}>
                  <div className="split-item">
                    <p style={{ fontWeight: "bold", fontSize: 12, margin: "2px 0" }}>Owner (60%)</p>
                    <p style={{ fontSize: 18, fontWeight: 900, margin: "2px 0" }}>{owner}k</p>
                    <p style={{ fontSize: 11, color: "#c00", margin: "2px 0" }}>- Uang Makan {uangMakan}k</p>
                    <p style={{ fontSize: 16, fontWeight: 900, borderTop: "1px solid #000", paddingTop: 4, margin: "4px 0 0" }}>{ownerGet}k</p>
                  </div>
                  <div className="split-item">
                    <p style={{ fontWeight: "bold", fontSize: 12, margin: "2px 0" }}>Karyawan (40%)</p>
                    <p style={{ fontSize: 18, fontWeight: 900, margin: "2px 0" }}>{employeeGross}k</p>
                    <p style={{ fontSize: 11, color: "#090", margin: "2px 0" }}>+ Uang Makan {uangMakan}k</p>
                    <p style={{ fontSize: 16, fontWeight: 900, borderTop: "1px solid #000", paddingTop: 4, margin: "4px 0 0" }}>{employeeGet}k</p>
                  </div>
                </div>
              </div>

              <p style={{ textAlign: "center", fontSize: 10, color: "#999", marginTop: 24 }}>
                socialtoolsbyza
              </p>
            </div>

            <div className="border-4 border-black bg-white p-4 space-y-3 print-only" style={{ display: "none" }}>
            </div>
          </>
        )}
      </div>
    </ComicPanel>
  );
}
